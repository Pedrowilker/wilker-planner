const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const STATE_FILE = path.join(DATA_DIR, 'wilker-state.json');
const MAX_BODY = 4 * 1024 * 1024;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

fs.mkdirSync(DATA_DIR, { recursive: true });

function safePath(urlPath) {
  const pathname = decodeURIComponent((urlPath || '/').split('?')[0]);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const resolved = path.resolve(ROOT, relative);
  if (!resolved.startsWith(path.resolve(ROOT) + path.sep)) return null;
  return resolved;
}

function readState() {
  try {
    if (!fs.existsSync(STATE_FILE)) return {};
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeState(state) {
  const tmp = `${STATE_FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, STATE_FILE);
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (Buffer.byteLength(body, 'utf8') > MAX_BODY) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent((req.url || '/').split('?')[0]);

    if (pathname === '/api/state') {
      if (req.method === 'GET') return sendJson(res, 200, readState());
      if (req.method === 'PUT') {
        const body = await readBody(req);
        if (!body.trim()) return sendJson(res, 400, { error: 'Empty state' });
        let parsed;
        try { parsed = JSON.parse(body); } catch { return sendJson(res, 400, { error: 'Invalid JSON' }); }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return sendJson(res, 400, { error: 'Invalid state object' });
        writeState(parsed);
        return sendJson(res, 200, { ok: true });
      }
      res.writeHead(405, { Allow: 'GET, PUT' });
      return res.end('Method not allowed');
    }

    const filePath = safePath(req.url);
    if (!filePath) { res.writeHead(403); return res.end('Forbidden'); }
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (error) {
    sendJson(res, 500, { error: 'Server error' });
  }
});

server.on('listening', () => {
  const url = `http://127.0.0.1:${PORT}`;
  console.log(`WILKER Planner ativo em ${url}`);
  const opener = process.platform === 'win32' ? `start "" "${url}"` : `xdg-open "${url}"`;
  exec(opener, () => {});
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`A porta ${PORT} já está em uso.`);
    process.exitCode = 1;
  } else {
    console.error(error);
    process.exitCode = 1;
  }
});

server.listen(PORT, '127.0.0.1');
process.on('SIGINT', () => server.close(() => process.exit(0)));
