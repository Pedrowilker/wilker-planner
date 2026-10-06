import fs from 'node:fs/promises';

const feeds = [
  { source: 'B3 â€” Bora Investir', category: 'Mercado', q: 'site:borainvestir.b3.com.br mercado investimentos aÃ§Ãµes FIIs' },
  { source: 'Banco Central â€” Focus', category: 'Economia', q: 'site:bcb.gov.br Focus Selic inflaÃ§Ã£o cÃ¢mbio mercado' },
  { source: 'CVM â€” Investidor', category: 'RegulaÃ§Ã£o', q: 'site:gov.br/cvm investidor mercado de capitais educaÃ§Ã£o' },
  { source: 'Tesouro Direto', category: 'Renda fixa', q: 'site:tesourodireto.com.br Tesouro Selic IPCA Prefixado' },
  { source: 'InfoMoney', category: 'Mercado', q: 'site:infomoney.com.br mercados investimentos economia' },
  { source: 'InvestNews', category: 'Investimentos', q: 'site:investnews.com.br investimentos mercado economia' },
  { source: 'Exame Invest', category: 'Investimentos', q: 'site:exame.com/invest investimentos mercados finanÃ§as' },
  { source: 'AgÃªncia Brasil â€” Economia', category: 'Economia', q: 'site:agenciabrasil.ebc.com.br/economia economia Brasil' },
  { source: 'IBGE', category: 'Indicadores', q: 'site:ibge.gov.br inflaÃ§Ã£o PIB emprego economia' },
  { source: 'Reuters â€” Markets', category: 'Internacional', q: 'site:reuters.com markets Brazil Fed dollar oil gold' }
];

function decode(v='') {
  return v.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}
function tag(block, name) {
  const re = new RegExp(`<${name}>([\\s\\S]*?)<\\/${name}>`, 'i');
  const m = block.match(re);
  return m ? decode(m[1]) : '';
}
async function fetchFeed(feed) {
  const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(feed.q) + '&hl=pt-BR&gl=BR&ceid=BR:pt-419';
  const res = await fetch(url, { headers: { 'user-agent': 'WILKER-Finance-News/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const items = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)) {
    const b = m[1];
    const title = tag(b, 'title');
    const link = tag(b, 'link');
    const pubDate = tag(b, 'pubDate');
    if (title && link) items.push({ title, link, pubDate, source: feed.source, category: feed.category });
  }
  return items;
}

const results = [];
for (const feed of feeds) {
  try { results.push(...await fetchFeed(feed)); } catch {}
}

results.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
const seen = new Set();
const unique = results.filter(item => {
  if (seen.has(item.link)) return false;
  seen.add(item.link);
  return true;
}).slice(0, 60);

await fs.writeFile('data/finance-news.json', JSON.stringify({
  updatedAt: new Date().toISOString(),
  items: unique
}, null, 2) + '\n', 'utf8');

console.log(`WILKER finance news: ${unique.length} items`);
