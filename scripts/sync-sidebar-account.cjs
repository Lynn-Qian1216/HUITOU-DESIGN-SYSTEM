const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/standalone');
const root = path.resolve(__dirname, '..');
const sourcePath = 'components/navigation/SidebarAccount.jsx';
const source = fs.readFileSync(path.join(root, sourcePath), 'utf8')
  .replace(/^import .*;\r?\n/gm, '')
  .replace('export function SidebarAccount', 'function SidebarAccount');
const compiled = babel.transform(source, {presets:['react'], filename:sourcePath}).code;
const bundlePath = path.join(root, '_ds_bundle.js');
const bundle = fs.readFileSync(bundlePath, 'utf8');
const start = bundle.indexOf('// ' + sourcePath + '\n');
const end = bundle.indexOf('// doc-page.js', start);
if (start < 0 || end < start) throw new Error('SidebarAccount runtime module boundaries not found');
const replacement = `// ${sourcePath}\ntry { (() => {\nconst { Avatar, Icon, Dialog, Button, Input, FormField } = __ds_scope;\nconst createPortal = ReactDOM.createPortal;\n${compiled}\nObject.assign(__ds_scope, { SidebarAccount });\n})(); } catch (e) { __ds_ns.__errors.push({ path: ${JSON.stringify(sourcePath)}, error: String((e && e.message) || e) }); }\n\n`;
fs.writeFileSync(bundlePath, bundle.slice(0, start) + replacement + bundle.slice(end));
console.log('SidebarAccount source and runtime synchronized.');
