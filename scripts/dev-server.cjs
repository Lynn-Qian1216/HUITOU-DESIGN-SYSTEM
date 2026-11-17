const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const isPreview = process.argv.includes('--dist');
const root = path.resolve(__dirname, '..', isPreview ? 'dist' : '.');
const port = Number(process.env.PORT || (isPreview ? 4173 : 5173));
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.jsx':'text/plain; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json'};
const server = http.createServer((req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/') {
    if (isPreview) pathname = '/index.html';
    else { res.writeHead(302, {Location:'/ui_kits/console/index.html'}); return res.end(); }
  }
  let file = path.resolve(root, '.' + pathname);
  if (!file.startsWith(root + path.sep) || pathname.split('/').some(p => p.startsWith('.'))) { res.writeHead(403); return res.end('Forbidden'); }
  fs.stat(file, (err, stat) => {
    if (!err && stat.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err, body) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-store'});
      res.end(req.method === 'HEAD' ? undefined : body);
    });
  });
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `端口 ${port} 已被占用。请关闭已有预览，或设置 PORT 后重试。` : error); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`慧投控制台已启动：http://127.0.0.1:${port}\n修改 ui_kits/console 中的源码后刷新页面即可。`));
