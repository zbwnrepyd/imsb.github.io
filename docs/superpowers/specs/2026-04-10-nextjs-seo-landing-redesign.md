# Next.js SEO Landing Redesign

**Goal:** 将当前纯静态单页人格测试站重构为基于 Next.js 的多页面站点，提供英文 SEO 友好的 landing page，同时保留原有中文测试内容与结果逻辑，并支持浏览器持久化结果。

## Scope

- 使用 Next.js 重构当前站点
- 首页改为英文 SEO 文章型 landing page
- 保留原测试题库、人格库、文案和娱乐属性
- 将问卷页和结果页拆分为独立路由
- 在浏览器中缓存问卷进度和最近一次测试结果
- 支持用户重新打开网站后继续查看最近一次结果
- 为搜索引擎提供可索引的文本内容、基础 metadata 和结构化 FAQ

## Non-Goals

- 不引入后端数据库或用户系统
- 不实现账号登录、跨设备同步或分享型结果短链
- 不改变当前人格计算规则
- 不把测试结果改造成“专业心理测评”产品
- 不做中英双语全量切换，首页以英文为主，原中文内容作为保留内容块

## Product Direction

站点的流量目标以英文搜索为主，因此首页不再承担问卷与结果的全部逻辑，而是转为 SEO 友好的文章型 landing page。测试仍保留原始中文内容与荒诞语气，避免被重构成常规心理测试模板。

站点定位是 “IMSB / MBTI parody personality test”。首页承接用户对 `imsb`、`mbti personality test`、`funny personality test`、`parody personality test` 等关键词的搜索意图，测试本身承接用户的互动与留存。

## Information Architecture

建议使用 Next.js App Router，并拆分为以下页面：

- `/`：英文 SEO landing page
- `/quiz`：问卷页面
- `/result`：结果页面

辅助系统页面与文件：

- `app/layout.tsx`：全局 metadata、字体、站点壳层
- `app/globals.css`：全局样式
- `app/robots.ts`：robots 规则
- `app/sitemap.ts`：站点地图

## Page Responsibilities

### `/`

首页用于搜索引擎收录和用户首次理解产品，不直接承载问卷题目。页面将包含：

- Hero 区：明确 IMSB 是一个带恶搞性质的人格测试
- 长文介绍：解释 IMSB 与 MBTI 的关系
- Why people take it：承接 personality test / funny quiz 搜索需求
- Result previews：展示若干人格类型示例
- How it works：说明题量、维度、隐藏分支和玩法
- FAQ：回答真实性、娱乐性、重测方式和结果存储
- Original Chinese content：保留原作者说明、原站风格与免责声明
- 已有结果入口：如果浏览器中存在最近一次结果，展示 “View your last result”

### `/quiz`

问卷页只负责答题流程：

- 展示题目与进度
- 保留原有插题逻辑与特殊饮酒分支
- 在本地缓存进度
- 完成后计算结果并写入结果缓存
- 跳转到 `/result`

### `/result`

结果页只负责读取并展示最近一次结果：

- 存在缓存结果时，完整展示人格、维度、解释和原结果内容
- 不存在缓存结果时，展示空状态和返回 `/quiz` 的引导
- 页面允许用户重新测试

## SEO Strategy

首页以英文 SEO 为主，但保留中文内容块辅助覆盖中文长尾词。

核心英文关键词：

- `imsb`
- `mbti`
- `personality`
- `test`
- `personality test`
- `funny personality test`
- `parody personality test`
- `mbti parody test`

辅助中文关键词：

- `人格测试`
- `恶搞测试`

SEO 实现要求：

- 首页正文必须可被服务端直接输出，不能完全依赖客户端渲染
- 使用明确的 `<title>` 与 `<meta name="description">`
- 提供 Open Graph 与 Twitter metadata
- 添加 FAQ structured data
- 添加 WebPage / WebSite 级别 schema
- 生成 `robots.ts` 和 `sitemap.ts`

## Content Strategy

首页内容写法不做“专业心理学”承诺，而是明确写出：

- IMSB 是娱乐向、恶搞向人格测试
- 它借用了 MBTI 用户熟悉的探索欲，但不是专业诊断工具
- 原站的中文世界观和作者语气被保留，不做去人格化清洗

这样既能匹配英文搜索，又不会把原站内容抽空成普通模板站。

## Data and Code Boundaries

当前 `public/main.js` 体积过大，且将数据、算法、渲染、DOM 操作混在一起。重构时需要拆成以下边界：

- `lib/quiz-data.ts`
  - 题库
  - 特殊题
  - 人格库
  - 维度解释
  - 维度顺序
- `lib/quiz-engine.ts`
  - 纯计算函数
  - 维度换算
  - 结果匹配
  - 特殊结果判断
- `lib/storage.ts`
  - `localStorage` 读写
  - 版本控制
  - 缺失值和损坏数据兜底
- `components/`
  - 首页区块组件
  - 问题卡组件
  - 结果卡组件
  - 最近一次结果入口组件

## Persistence Design

需要在浏览器中持久化两类数据：

### 1. Quiz Progress

用途：用户刷新页面或中断后继续答题。

建议字段：

- 当前题目顺序
- 当前已答答案
- 是否已触发饮酒分支
- 最近更新时间
- 数据版本号

### 2. Latest Result

用途：用户重新打开网站后还能看到最近一次结果。

建议字段：

- 人格代码
- 人格名称
- 匹配度
- 维度分数
- 维度等级
- 特殊结果标记
- 结果生成时间
- 结果所需文案快照或可稳定重建所需数据
- 数据版本号

## UX Rules

- 首页不自动强跳到结果页，避免影响 SEO 首屏与首次访问体验
- 首页如果检测到最近一次结果，显示清晰入口
- `/result` 可独立打开
- `/result` 没有缓存结果时，不报错，只显示空状态
- `/quiz` 支持从空状态开始，也支持继续上次进度
- “重新测试” 会清空历史进度并重新生成测试顺序

## Styling Direction

虽然首页会重做，但视觉语言应继承原站的轻恶搞、清爽卡片、轻绿色基调，不做通用 SaaS 风格。要求：

- 首页视觉更适合英文 SEO 阅读
- 原测试区和结果区仍保留原站的气质与文案
- 在移动端和桌面端都能稳定展示
- 保持 CTA 明确，不让长文案吞掉测试入口

## Error Handling

- `localStorage` 不可用时，测试仍可运行，但不承诺持久化
- 读取到损坏缓存时，自动清空并回退到空状态
- `/result` 没有结果时展示空状态而不是异常
- 未来若数据结构升级，使用版本号进行兼容或清空

## Deployment Implications

站点从纯静态 HTML/CSS/JS 变为 Next.js 项目后，部署方式需要从“直接发布 `public/`”改为适合 Next.js 的 Cloudflare Pages / OpenNext 流程。当前 spec 只定义产品和代码结构，不限定最终适配器实现细节，但要求部署产物仍能运行在 Cloudflare 生态中。

## Testing Strategy

- 结果计算函数需要可独立验证
- 至少验证：
  - 常规人格匹配不变
  - 饮酒隐藏分支不变
  - 低匹配度 fallback 结果不变
  - 刷新后仍能恢复问卷进度
  - 重新打开网站后 `/result` 能读出最近结果
  - 没有缓存时 `/result` 显示空状态

## Open Decisions Already Resolved

- Landing page 主语言：英文
- 首页风格：SEO/article style
- 结果保留方式：首页显示最近结果入口，结果页独立存在
- 数据持久化方式：浏览器本地缓存
- 是否拆分超大 `main.js`：是
