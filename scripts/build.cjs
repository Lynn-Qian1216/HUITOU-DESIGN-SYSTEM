const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/standalone');

const project = path.resolve(__dirname, '..');
const output = path.join(project, 'dist');
// Only regenerate this project's known build directory.
if (path.dirname(output) !== project || path.basename(output) !== 'dist') throw new Error('Invalid build directory');
fs.rmSync(output, {recursive:true, force:true});
fs.mkdirSync(output, {recursive:true});

const extensions = new Set(['.html','.css','.js','.json','.svg','.png','.jpg','.jpeg','.webp','.woff','.woff2','.gif']);
function copyDirectory(relative) {
  const directory = path.join(project, relative);
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    if (entry.name === '_figma' || entry.name.startsWith('figma-') || entry.name === 'standalone.html') continue;
    const item = path.join(relative, entry.name);
    if (entry.isDirectory()) copyDirectory(item);
    else if (extensions.has(path.extname(entry.name))) {
      fs.mkdirSync(path.dirname(path.join(output,item)), {recursive:true});
      fs.copyFileSync(path.join(project,item),path.join(output,item));
    }
  }
}
for (const directory of ['assets','tokens','components','guidelines','design-system','ui_kits']) copyDirectory(directory);
for (const file of ['styles.css','_ds_bundle.js','_ds_manifest.json','doc-page.js']) fs.copyFileSync(path.join(project,file),path.join(output,file));

const vendorFiles = {
  'react': ['node_modules/react/umd/react.production.min.js','vendor/react.production.min.js'],
  'react-dom': ['node_modules/react-dom/umd/react-dom.production.min.js','vendor/react-dom.production.min.js'],
};
fs.mkdirSync(path.join(output,'vendor'),{recursive:true});
for (const [source,destination] of Object.values(vendorFiles)) fs.copyFileSync(path.join(project,source),path.join(output,destination));
const compiled = new Set();
function compileJSX(relative) {
  const destination = relative.replace(/\.jsx$/,'.js');
  if (!compiled.has(relative)) {
    const source = fs.readFileSync(path.join(project,relative),'utf8');
    const code = babel.transform(source,{presets:['react'],filename:relative,comments:false,compact:true}).code;
    fs.mkdirSync(path.dirname(path.join(output,destination)),{recursive:true});
    fs.writeFileSync(path.join(output,destination),code);
    compiled.add(relative);
  }
  return destination;
}
const toURL = value => value.split(path.sep).join('/');
let htmlCount = 0;
function processHTML(directory) {
  for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file = path.join(directory,entry.name);
    if (entry.isDirectory()) {processHTML(file);continue;}
    if (!file.endsWith('.html')) continue;
    const relative = path.relative(output,file);
    let inline = 0;
    const html = fs.readFileSync(file,'utf8').replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/g,(tag,attributes,body)=>{
      const src = attributes.match(/\bsrc="([^"]+)"/);
      if (src && /(?:@babel\/standalone|babel\.min\.js)/.test(src[1])) return '';
      if (src && /(?:react(?:-dom)?@|node_modules\/react(?:-dom)?\/)/.test(src[1])) {
        const library = src[1].includes('react-dom') ? 'react-dom' : 'react';
        const url = toURL(path.relative(path.dirname(file),path.join(output,vendorFiles[library][1])));
        return `<script src="${url}"></script>`;
      }
      if (!/type=["']text\/babel["']/.test(attributes)) return tag;
      let destination;
      if (src) {
        const sourcePath = path.normalize(path.join(path.dirname(relative),src[1]));
        if (sourcePath.startsWith('..') || path.isAbsolute(sourcePath)) throw new Error('Script escapes project: '+sourcePath);
        destination = path.join(output,compileJSX(sourcePath));
      } else {
        destination = file.replace(/\.html$/,`.inline-${++inline}.js`);
        fs.writeFileSync(destination,babel.transform(body,{presets:['react'],filename:relative,comments:false,compact:true}).code);
      }
      const url = toURL(path.relative(path.dirname(file),destination));
      return `<script src="${url}"></script>`;
    });
    fs.writeFileSync(file,html);
    htmlCount++;
  }
}
processHTML(output);
fs.writeFileSync(path.join(output,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>慧投 Design System</title><meta http-equiv="refresh" content="0;url=./design-system/"></head><body><a href="./design-system/">打开慧投 Design System</a><script>const target=new URL('./design-system/',location.href);target.hash=location.hash;location.replace(target.href);</script></body></html>`);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
fs.writeFileSync(path.join(output,'vendor/NOTICE.txt'),'React and ReactDOM 18.3.1 — MIT License. Copyright Meta Platforms, Inc. and affiliates.\n\n'+fs.readFileSync(path.join(project,'node_modules/react/LICENSE'),'utf8'));
console.log(`Built ${htmlCount} pages and ${compiled.size} JSX modules into dist/.`);
console.log('Entry: dist/index.html → design-system/. No runtime Babel or node_modules required.');
