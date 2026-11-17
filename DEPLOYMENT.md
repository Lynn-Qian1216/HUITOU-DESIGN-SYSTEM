# 部署慧投 Design System

## 构建

使用 Node.js 20 或更高版本：

```sh
npm ci
npm run check
npm run build
npm run check:build
npm run preview
```

构建输出目录为 `dist`，预览地址为 `http://127.0.0.1:4173/`。网站根路径自动打开 Design System，完整控制台原型位于 `ui_kits/console/`。

构建时会编译 JSX，并复制 React 与 ReactDOM 的生产运行库。部署后的页面不依赖 `node_modules`、浏览器 Babel 或本地预览服务。字体依然使用原设计系统的在线字体与系统回退字体。

## 静态托管

在支持静态网站的托管服务中使用：

- 安装命令：`npm ci`
- 构建命令：`npm run build`
- 发布目录：`dist`
- 网站入口：`index.html`

输出使用相对资源路径，可用于独立域名或 GitHub Pages 仓库子路径。GitHub Pages 应发布构建产物而不是仓库源码，保留 `_ds_bundle.js`、`_ds_manifest.json` 与 `.nojekyll`。

仓库中的 CI 只验证和生成构建产物，不会自动公开发布网站。首次推送完成后，再配置选定托管平台。

## 内容范围

包括设计变量、品牌资源、基础组件源码、交互示例、规范说明和控制台/官网原型。原型中的账户、手机号与投放数据属于演示数据；登录与 AI 回复为前端演示逻辑，不是实际业务系统。

不发布本地依赖、Figma 临时导出、历史独立大文件、剪贴板截图或原始上传素材。
