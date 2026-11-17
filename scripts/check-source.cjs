const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/standalone');
const project = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(project, '_ds_manifest.json'), 'utf8'));
const entries = ['ui_kits/console/index.html', 'design-system/index.html', ...manifest.cards.filter(c=>c.path.startsWith('components/')).map(c=>c.path)];
let count = 0;
for (const relative of entries) {
const entry = path.join(project, relative);
const html = fs.readFileSync(entry, 'utf8');
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
  if (!match[1].includes('text/babel')) continue;
  const src = match[1].match(/src="([^"]+)"/);
  const code = src ? fs.readFileSync(path.join(path.dirname(entry), src[1]), 'utf8') : match[2];
  babel.transform(code, {presets:['react'], filename:src ? src[1] : 'App.jsx'});
  count++;
}
}
console.log(`已检查 ${count} 个控制台与设计系统 JSX 脚本，语法全部通过。`);
