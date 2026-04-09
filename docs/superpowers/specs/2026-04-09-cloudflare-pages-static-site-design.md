# Cloudflare Pages Static Site Design

**Goal:** 把当前单页静态测试站整理成 Cloudflare Pages 可直接发布的结构，不改页面功能。

## Scope

- 保持原有 HTML、CSS、JS 行为不变
- 不引入构建工具
- 不增加后端、Workers 或打包流程

## Design

当前项目只有 3 个静态文件，失败原因不是代码逻辑，而是部署流程使用了 `wrangler deploy`，这要求项目能提供明确的静态资源目录或 Workers 配置。对于 Cloudflare Pages，最小稳定方案是使用固定发布目录。

本次调整采用 `public/` 目录作为单一发布根目录：

- `public/index.html` 作为默认入口，满足静态站托管平台约定
- `public/main.css` 和 `public/main.js` 作为同级静态资源
- 仓库根目录保留说明文档和后续可选的部署文档

## Non-Goals

- 不拆分 `main.js` 逻辑模块
- 不改变视觉设计
- 不新增测试框架
- 不接入 Cloudflare Workers
