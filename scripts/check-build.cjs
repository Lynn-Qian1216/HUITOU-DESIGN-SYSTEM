const fs = require('node:fs');
const path = require('node:path');
const output = path.resolve(__dirname,'../dist');
const manifest = JSON.parse(fs.readFileSync(path.join(output,'_ds_manifest.json'),'utf8'));
const missing = [];
let htmlCount = 0;
function assertLocalReference(file,url) {
  if (!url || /^(?:https?:|data:|blob:|mailto:|tel:|#|javascript:)/i.test(url)) return;
  const clean = decodeURIComponent(url.split(/[?#]/)[0]);
  if (!clean) return;
  const resolved = path.resolve(path.dirname(file),clean);
  if (!resolved.startsWith(output+path.sep) && resolved!==output) throw new Error('Reference escapes deploy directory: '+url);
  if (!fs.existsSync(resolved)) missing.push(path.relative(output,file)+' → '+url);
}
function scan(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file = path.join(directory,entry.name);
    if (entry.isDirectory()) {scan(file);continue;}
    if (!/\.(?:html|css)$/.test(file)) continue;
    const text = fs.readFileSync(file,'utf8');
    if (file.endsWith('.html')) {
      htmlCount++;
      if (/text\/babel|node_modules\/|https:\/\/unpkg\.com\/(?:react|@babel)/.test(text)) throw new Error('Development dependency in '+file);
      for (const match of text.matchAll(/\b(?:src|href)="([^"]+)"/g)) assertLocalReference(file,match[1]);
    } else {
      for (const match of text.matchAll(/(?:url\(["']?|@import\s+["'])([^\s"')]+)["']?\)?/g)) assertLocalReference(file,match[1]);
    }
  }
}
scan(output);
for (const card of manifest.cards) if (!fs.existsSync(path.join(output,card.path))) missing.push('Manifest → '+card.path);
if (missing.length) throw new Error('Broken deployment references:\n'+missing.join('\n'));
if (manifest.cards.length!==43 || manifest.tokens.length!==230) console.warn('Manifest counts have changed; verify intended content.');
console.log(`Validated ${htmlCount} HTML pages, ${manifest.cards.length} manifest previews and all local HTML/CSS references.`);
