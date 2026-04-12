# imsb

基于 Next.js 静态导出的 IMSB 落地页和问卷站点。

## 目录

- `app/page.tsx`：英文 SEO 首页
- `app/quiz/page.tsx`：问卷页
- `app/result/page.tsx`：结果页
- `components/home/*`：首页区块
- `components/quiz/*`：问卷组件
- `components/result/*`：结果页组件
- `lib/quiz-data.ts`：题库和人格库
- `lib/quiz-engine.ts`：评分与匹配逻辑
- `lib/storage.ts`：浏览器缓存层

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
`npm start` 依赖系统可用的 `python3` 来提供静态文件服务。

然后访问 `http://localhost:3000`。

## 说明

- 这是静态导出配置，构建产物会输出到 `out`
- 站点入口已经迁移到 Next.js App Router
