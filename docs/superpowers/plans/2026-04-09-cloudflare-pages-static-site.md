# Cloudflare Pages Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前纯静态页面整理为 Cloudflare Pages 可直接发布的项目结构。

**Architecture:** 使用 `public/` 作为唯一发布目录，将页面入口命名为 `index.html`，样式和脚本保持同级相对引用。仓库根目录仅保留说明文档和辅助文档，不引入构建工具。

**Tech Stack:** HTML, CSS, Vanilla JavaScript, Cloudflare Pages

---

### Task 1: 建立发布目录结构

**Files:**
- Create: `public/`
- Create: `public/index.html`
- Create: `public/main.css`
- Create: `public/main.js`

- [ ] Step 1: 创建 `public/` 目录并迁移现有静态资源
- [ ] Step 2: 将 `imsb.html` 重命名为 `public/index.html`
- [ ] Step 3: 将 `main.css` 和 `main.js` 迁移到 `public/`
- [ ] Step 4: 确认 `index.html` 中的相对引用仍指向 `./main.css` 和 `./main.js`

### Task 2: 补部署说明

**Files:**
- Modify: `README.md`

- [ ] Step 1: 写明这是纯静态站点
- [ ] Step 2: 写明 Cloudflare Pages 使用 `None` preset、空 build command、`public` 作为 output directory
- [ ] Step 3: 补一个本地预览命令，便于快速验证

### Task 3: 结构校验

**Files:**
- Verify: `public/index.html`
- Verify: `public/main.css`
- Verify: `public/main.js`
- Verify: `README.md`

- [ ] Step 1: 运行文件结构检查，确认发布目录存在
- [ ] Step 2: 检查入口文件、样式文件、脚本文件都在 `public/`
- [ ] Step 3: 检查 `README.md` 中的部署说明与当前目录结构一致
