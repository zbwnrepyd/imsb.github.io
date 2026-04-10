# imsb

Next.js 静态导出工程。当前对外生效的首页来自 `app/page.tsx`，而 `public/` 里的旧静态文件保留为迁移参考。

## 目录

- `app/layout.tsx`：App Router 根布局
- `app/page.tsx`：当前生效的 Next.js 首页
- `app/globals.css`：全局样式
- `public/index.html`：保留的旧站点入口
- `public/main.css`：保留的旧页面样式
- `public/main.js`：保留的旧题库、评分和结果页逻辑

## Cloudflare Pages 配置

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npx next build`
- Build output directory: `out`

## 本地预览

开发时运行 Next.js，预览导出产物时先构建再启动静态服务：

```bash
npm install
npm run dev
```

```bash
npm run build
npm start
```

`npm run dev` 用于开发，`npm start` 用于预览 `out/`。

然后访问 `http://localhost:3000`。

## 说明

- 这是静态导出配置，构建产物会输出到 `out`
- 旧的纯静态资源保留在 `public/`，用于迁移参考，不是当前导出首页来源
