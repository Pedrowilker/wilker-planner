const http=require("http"),fs=require("fs"),path=require("path"),{exec}=require("child_process");
const PORT=8080,ROOT=__dirname;
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8"};
const s=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split("?")[0]);if(p==="/"||!path.extname(p))p="/index.html";const file=path.join(ROOT,p);if(!file.startsWith(ROOT)){res.writeHead(403);return res.end("Forbidden")}fs.readFile(file,(e,d)=>{if(e){res.writeHead(404);return res.end("Not found")}res.writeHead(200,{"Content-Type":types[path.extname(file).toLowerCase()]||"application/octet-stream","Cache-Control":"no-store"});res.end(d)})});
s.listen(PORT,"127.0.0.1",()=>{console.log("WILKER Planner: http://127.0.0.1:"+PORT);if(process.platform==="win32")exec('start "" "http://127.0.0.1:'+PORT+'"');});
