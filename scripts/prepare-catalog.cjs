const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'_ds_manifest.json'),'utf8'));
const libraries={
 'https://unpkg.com/react@18.3.1/umd/react.development.js':'node_modules/react/umd/react.development.js',
 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js':'node_modules/react-dom/umd/react-dom.development.js',
 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js':'node_modules/@babel/standalone/babel.min.js'
};
let changed=0;
for(const card of manifest.cards){
 const file=path.join(root,card.path);
 const original=fs.readFileSync(file,'utf8');
 const updated=original.replace(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g,(tag,src)=>libraries[src]?`<script src="${path.relative(path.dirname(file),path.join(root,libraries[src])).replaceAll('\\','/')}"></script>`:tag);
 if(updated!==original){fs.writeFileSync(file,updated);changed++;}
}
console.log(`已将 ${changed} 个示例页面切换为本地 React 和 Babel。`);
