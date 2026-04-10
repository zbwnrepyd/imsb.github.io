# imsb

Next.js 静态导出工程，现有 `public/` 静态站点会在后续任务中逐步迁移。

## 目录

- `app/layout.tsx`：App Router 根布局
- `app/page.tsx`：占位首页
- `app/globals.css`：全局样式
- `public/index.html`：旧站点入口
- `public/main.css`：旧页面样式
- `public/main.js`：旧题库、评分和结果页逻辑

## Cloudflare Pages 配置

- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npx next build`
- Build output directory: `out`

## 本地预览

开发时先安装依赖，再启动本地服务：

```bash
npm install
npm run dev
```

然后访问 `http://localhost:3000`。

## 说明

- 这是静态导出配置，构建产物会输出到 `out`
- 旧的纯静态资源保留在 `public/`，不在本任务中删除或重构
