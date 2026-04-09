# imsb

纯静态站点，适合直接部署到 Cloudflare Pages。

## 目录

- `public/index.html`：站点入口
- `public/main.css`：页面样式
- `public/main.js`：题库、评分和结果页逻辑

## Cloudflare Pages 配置

- Framework preset：`None`
- Build command：留空
- Build output directory：`public`

## 本地预览

如果只是快速看页面，可以在仓库根目录执行：

```bash
python3 -m http.server 8000 --directory public
```

然后访问 `http://localhost:8000`。

## 说明

- 不需要 `wrangler deploy`
- 这是纯静态资源发布，不需要依赖安装和构建步骤
