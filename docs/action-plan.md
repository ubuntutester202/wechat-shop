# 4 周电商练手项目实战计划书

（按半天 ≈ 4 h 粒度安排，周末不休息，共 56 个时间块）面向：独立新手开发者   |  时间：2025 年 6 月目标：从 0 到上线并可创收的完整电商应用（前端优先开发，支持微信支付）

> 需求来源：详见 [`docs/overview.md`](overview.md)。所有任务拆解均基于其中的 MVP 功能与非功能需求，请优先查阅。

---

## 一、技术栈与工具


| 层次   | 选型                                                 | 说明                           |
| -------- | ------------------------------------------------------ | -------------------------------- |
| 前端   | React 18 + Vite + TypeScript + TailwindCSS + Zustand | 主流组合，社区活跃，文档丰富   |
| Mock   | MSW (Mock Service Worker)                            | 前端阶段脱离后端即可联调       |
| 后端   | NestJS + PostgreSQL (Prisma ORM) + Redis             | 结构清晰、CLI 丰富，易学易扩展 |
| 支付   | 微信支付 v3 Sandbox                                  | 先接入沙箱，后替换正式商户号   |
| 测试   | Jest + RTL (前端) / Supertest (后端)                 | 保证回归与重构安全             |
| DevOps | GitHub + GitHub Actions CI/CD + Docker               | 免费额度充足，流程简单         |
| 部署   | Vercel (前端) / Render or 腾讯云 Serverless (后端)   | 几分钟即可上线                 |
| 协作   | Cursor IDE + GitHub Projects                         | AI-Pair & 看板管理             |

---

## 二、整体里程碑

1. Week 1：需求 & 设计 & 前端脚手架
2. Week 2：前端核心页面 + Mock 数据完成交互
3. Week 3：后端 API + 微信支付沙箱 + 真数据联调
4. Week 4：部署上线 + 多端适配 + 创收渠道 & 业务运营

---

## 三、详细日程（半天 × 56）

说明：
• 每块先给「任务概述」，后列「子任务待办」；
• 子任务 ≥ 5 条，使用 markdown ✅ / ☐ ；
• 伪代码 / 命令行示例用 ```bash …```；
• 建议上午 09 : 00-13 : 00，下午 14 : 00-18 : 00，自行调整。

---

### Week 1 基础铺设 & 前端起步

#### Day 1

- 上午：环境&仓库初始化
  - [X] 安装 Node 20、PNPM
  - [X] 配置 VSCode + Cursor 插件
  - [X] 注册 / 登录 GitHub，创建私有仓库 `wechat-shop`
  - [X] 初始化 README.md，写项目愿景
  - [X] 提交首个 commit
- 下午：需求分析 & 功能分解
  - [X] 列出 MVP 功能（商品列表、详情、购物车、结算、订单、用户）
  - [X] 制作用户流程图 (draw.io)
  - [X] 创建 GitHub Project 看板，列 Epic / Story
  - [X] 编写 API 资源草表 (商品 / 订单 …)
  - [X] 制定数据库 ER 草图

#### Day 2

- 上午：UI/UX 设计原型
  - [x] 使用 Figma 模板完成首页 / 商品卡片 / 购物车 / 配置 等。
- 下午：前端脚手架搭建
  - [x] `pnpm create vite@latest wechat-shop --template react-ts`
  - [x] `pnpm add -D tailwindcss postcss autoprefixer` 并执行 `npx tailwindcss init -p`
  - [x] 配置 ESLint + Prettier + Husky 提交钩子
  - [x] 建 `src/components`, `src/pages`, `src/styles` 目录
  - [x] hello world 页面跑通本地 `pnpm dev`

#### Day 3

- 上午：路由 & 布局体系
  - [x] `pnpm add react-router-dom@6`
  - [x] 设置主布局 `Layout.tsx` (Header, Footer, Outlet)
  - [x] 配置路由：`/`, `/product/:id`, `/cart`, `/profile`, `/message`
  - [x] 加入懒加载 `React.lazy`
- 下午：状态管理 & Mock 方案
  - [x] `pnpm add zustand` 建立 `useCartStore`
  - [x] `pnpm add -D msw`
  - [x] 编写 `src/mocks/handlers.ts` 商品列表 / 详情 / 购物车接口
  - [x] service worker 注册开关（仅 dev 环境）
  - [x] 用 Mock 数据渲染首页列表

#### Day 4

- 上午：商品列表页面完成
  - [x] 列表瀑布流 / 网格布局 Tailwind
  - [x] 商品卡片组件抽离 (图片 / 标题 / 价格)
  - [x] 加入 Skeleton loading
  - [x] 点击卡片跳转详情
  - [x] 创建搜索结果页面
  - [x] 实现搜索功能跳转
  - [x] 单元测试 `ProductCard.test.tsx`
- 下午：商品详情 & 购物车交互
  - [x] `useParams` 取 :id 调用 Mock
  - [x] 数量加减、规格选择
  - [x] `addToCart(product)` 调用 zustand
  - [x] 购物车数量徽标联动

#### Day 5

- 上午：结算&地址表单原型
  - [x] 页面 `/checkout` 骨架
  - [x] 使用 React Hook Form 创建地址输入
  - [x] 校验规则 (手机号，不搞复杂了，目前只是UI设计阶段)
  - [x] Mock 订单金额计算接口
  - [x] 按钮"去支付"显示未接入提示
- 下午：单元/集成测试搭建
  - [x] `pnpm add -D @testing-library/react @testing-library/jest-dom vitest`
  - [x] 配置 `vitest` 作为主要测试框架（推荐：与Vite更好集成）
  - [x] 编写首页渲染 smoke test
  - [x] 配置 CI：GitHub Actions 触发 test
  - [x] README 更新测试 badge

#### Day 6

- 上午：代码质量工具
  - [ ] 集成 SonarLint 插件
  - [ ] 设置 TypeScript 严格模式
  - [ ] 配置 absolute import 路径 `@/`
  - [ ] Storybook 初始化（组件文档）
  - [ ] 在 CI 中执行 `npm run lint`
- 下午：前端阶段复盘 & 文档同步
  - [ ] 更新 API Mock 描述至 `docs/api.md`
  - [ ] 总结本周遇到的问题 + 解决
  - [ ] 生成 `CHANGELOG.md` Week 1
  - [ ] Roadmap 看板移动已完成卡片
  - [ ] 预研 NestJS 创建步骤

---

### Week 2 前端功能完备 & UI 打磨

#### Day 7

- 上午：订单列表 & 详情页面
  - [ ] 路由 `/orders` & `/orders/:id`
  - [ ] Mock 历史订单数据
  - [ ] 订单卡片组件
  - [ ] 分页 / 无限滚动
  - [ ] 详情展示商品快照
- 下午：用户中心原型
  - [ ] `/profile` 基本信息页
  - [ ] Mock 登录态 (localStorage token)
  - [ ] 头像上传占位
  - [ ] 地址管理入口
  - [ ] 安全设置 placeholder

#### Day 8

- 上午：图片上传 & OSS 预研
  - [ ] 调研腾讯云 COS / 阿里 OSS
  - [ ] 用 Mock URL 占位上传返回
  - [ ] 创建通用 `Uploader` 组件
  - [ ] 撤销、进度条逻辑
  - [ ] Unit test for Uploader
- 下午：样式规范化
  - [ ] 配置 Tailwind Theme (`tailwind.config.js`)
  - [ ] 提炼颜色/字号/圆角变量
  - [ ] 提供 `@apply` mixin 框架
  - [ ] Dark Mode 切换 demo
  - [ ] Figma Token 对应更新

#### Day 9

- 上午：国际化 & 数字格式
  - [ ] `pnpm add react-i18next`
  - [ ] 中/英语言包抽离
  - [ ] 价格格式化 `Intl.NumberFormat`
  - [ ] 日期 `dayjs` 本地化
  - [ ] 切换按钮完成
- 下午：性能优化 & 懒加载
  - [ ] 路由分包 `chunkName` 注释
  - [ ] 图片懒加载 `<img loading="lazy">` 或 `react-lazy-load-image`
  - [ ] Lighthouse 测试
  - [ ] Tailwind purge 配置
  - [ ] 记录性能基线

#### Day 10

- 上午：PWA 支持
  - [ ] `pnpm add -D vite-plugin-pwa`
  - [ ] 生成 manifest.json (名称/图标)
  - [ ] 离线缓存首页 & 静态资源
  - [ ] 添加安装提示
  - [ ] 测试 Chrome DevTools 加装
- 下午：前端与后端契约文档
  - [ ] 使用 OpenAPI 3.1 草稿
  - [ ] 定义 `GET /products` 等接口 schema
  - [ ] 生成 `openapi.yaml` 放 `/api` 目录
  - [ ] `pnpm add -D openapi-typescript` 生成类型
  - [ ] README 更新如何 mock

#### Day 11

- 上午：Storybook 组件文档完善
  - [ ] 写 `ProductCard.stories.tsx`, `Button.stories.tsx`
  - [ ] 配置 Addon-controls
  - [ ] 自动快照测试
  - [ ] Deploy Storybook 到 GitHub Pages
  - [ ] PR Review checklist
- 下午：前端收尾 & 移交
  - [ ] 清理 TODO / console.log
  - [ ] `npm run build` 产物 sizecheck
  - [ ] Issue 列出后台需求清单
  - [ ] Week 2 回顾会议记录
  - [ ] 更新里程碑、推进 Week 3

---

### Week 3 后端实现 & 真数据联调

#### Day 12

- 上午：NestJS 项目初始化
  - [ ] `pnpm add -g @nestjs/cli`；`nest new backend`
  - [ ] 配置 ESLint, Prettier, Jest
  - [ ] 环境区分 `.env.dev/.env.prod`
  - [ ] Dockerfile & docker-compose 基础
  - [ ] 首次 commit
- 下午：数据库模型 & Prisma
  - [ ] `pnpm add -D prisma`；`npx prisma init`
  - [ ] 建表：User, Product, CartItem, Order, Address
  - [ ] `prisma migrate dev --name init`
  - [ ] 种子脚本 `prisma/seed.ts`
  - [ ] ER 图导出

#### Day 13

- 上午：用户模块 & JWT
  - [ ] nest g module user / service / controller
  - [ ] 注册、登录、加密 `bcrypt`
  - [ ] 签发 JWT、守卫 `AuthGuard`
  - [ ] Postman 测试通过
  - [ ] 单元测试 service
- 下午：商品模块 API
  - [ ] 列表、详情、搜索分页
  - [ ] Prisma 查询优化 `select`
  - [ ] Swagger Decorator 添加
  - [ ] 响应 DTO & 验证管道
  - [ ] 10 条种子商品生成

#### Day 14

- 上午：购物车 & 订单逻辑
  - [ ] 添加/修改/删除 CartItem API
  - [ ] 结算金额计算服务抽象
  - [ ] 生成订单号 (雪花算法或 UUID)
  - [ ] 订单状态枚举 draft/paid/failed
  - [ ] E2E 测试 Cart → Order
- 下午：微信支付沙箱接入
  - [ ] 注册沙箱 key，下载证书
  - [ ] `pnpm add @wechat-pay/node` SDK
  - [ ] 创建 `/pay/wxpay` controller
  - [ ] 本地回调地址 ngrok 映射测试
  - [ ] 记录签名校验
- 晚上：Coupon & 收藏 & 浏览 API
  - [ ] 建表：Coupon, Favorite, BrowseRecord
  - [ ] nest g module/service/controller (coupon/favorite/history)
  - [ ] 券的状态流转 (未使用/已使用/已过期)
  - [ ] API: 领取优惠券、我的优惠券列表
  - [ ] API: 收藏/取消收藏、获取收藏列表
  - [ ] API: 新增浏览记录、获取最近浏览

#### Day 15

- 上午：集成 Redis & 队列
  - [ ] `pnpm add ioredis bull`
  - [ ] 创建 Job：订单超时取消
  - [ ] NestJS BullModule 配置
  - [ ] 本地观察流水日志
  - [ ] Unit test for consumer
- 下午：前后端联调 (产品&购物车)
  - [ ] 修改前端 API baseURL 指向后端
  - [ ] 移除对应 MSW mock
  - [ ] 验证商品列表真数据
  - [ ] 处理跨域 CORS
  - [ ] 记录 bug / fix

#### Day 16

- 上午：前后端联调 (支付&订单)
  - [ ] 调用后端生成支付参数
  - [ ] H5 调起微信支付 (沙箱公众号)
  - [ ] 回调后变更订单状态
  - [ ] 前端支付成功界面
  - [ ] 日志 & 失败重试策略
- 下午：安全 & 日志
  - [ ] Helmet 中间件、RateLimit
  - [ ] Winston 日志到文件 & 控制台
  - [ ] 生产日志分级 error/info/debug
  - [ ] Swagger Auth token 全局 header
  - [ ] Week 3 Summary & 文档同步

---

### Week 4 上线部署 & 运营变现

#### Day 17

- 上午：CI/CD 流水线
  - [ ] GitHub Actions 前端 build + Vercel Deploy
  - [ ] 后端 Docker build & push ghcr.io
  - [ ] Render 自动拉取镜像
  - [ ] .env secrets 设置
  - [ ] 成功自动部署
- 下午：域名 & HTTPS
  - [ ] 购买域名 (阿里云 / Cloudflare)
  - [ ] Vercel 一键启用 SSL
  - [ ] 后端自配 Cloudflare Tunnel
  - [ ] 更新 CORS 允许域
  - [ ] 记录部署手册

#### Day 18

- 上午：SEO & 性能
  - [ ] Next-SEO 或 react-helmet 注入 meta
  - [ ] 站点地图 sitemap.xml & robots.txt
  - [ ] GTmetrix / PageSpeed 优化
  - [ ] 图片压缩 WebP
  - [ ] Bundle Analyzer 体积报告
- 下午：移动端适配 & Mini-Program 预研
  - [ ] Tailwind 响应式断点核查
  - [ ] PWA 在 Android 安装测试
  - [ ] 调研 Taro/Uni-App porting 难度
  - [ ] 小程序支付差异点记录
  - [ ] 形成技术决策文档

#### Day 19

- 上午：数据分析 & 埋点
  - [ ] 集成 umami / Matomo 自托管
  - [ ] 埋点：商品点击、支付成功
  - [ ] Dashboard 搭建
  - [ ] 定期导出 CSV
  - [ ] 数据隐私合规检查
- 下午：监控 & 告警
  - [ ] Sentry 前后端接入
  - [ ] Render 健康检查 endpoint
  - [ ] ChatOps：错误发送到 Slack / 飞书
  - [ ] 定时备份 PostgreSQL
  - [ ] 压力测试 k6 报告

#### Day 20

- 上午：商户号申请 & 正式支付
  - [ ] 提交企业资料申请微信商户号
  - [ ] 替换沙箱 key 为正式 key
  - [ ] 线下 0.01 元真实支付
  - [ ] 核对财务对账单
  - [ ] 更新 privacy policy
- 下午：创收渠道规划
  - [ ] 方案 1：自营商品利润
  - [ ] 方案 2：SaaS 授权（租用店铺）
  - [ ] 方案 3：技术接单（外包）
  - [ ] 注册 Fiverr / 猿急送 / 开源接单群
  - [ ] 制作展示 Demo & 报价单

#### Day 21

- 上午：市场推广启动
  - [ ] 申请微信公众号 + 小程序
  - [ ] 发布功能亮点推文
  - [ ] 抖音/视频号 demo 视频
  - [ ] GitHub 开源，写中文/英文 README
  - [ ] Hacker News & 掘金 投递
- 下午：文档 & 交付物整理
  - [ ] 完成 `docs/architecture.md`
  - [ ] API 文档 Swagger 导出 HTML
  - [ ] 部署 Storybook 静态站
  - [ ] 生成使用手册 PDF
  - [ ] 项目 logo / icon 收尾

#### Day 22

- 上午：用户反馈 & 快速迭代
  - [ ] 收集首批种子用户反馈表
  - [ ] 制作 Issues 标签：bug/feature
  - [ ] 完成 2 个高优 bug 修复
  - [ ] Hotfix 部署
  - [ ] 更新 CHANGELOG
- 下午：复盘 & 未来 roadmap
  - [ ] 绘制甘特图对比实际 vs 计划
  - [ ] 总结技术收获 & 踩坑
  - [ ] 梳理可自动化/可外包环节
  - [ ] 制定 3 个月扩展计划
  - [ ] 公开发布复盘文章

---

## 四、常见疑问解答

1. ⚙️ **前端先行没有后端数据怎么办？**
   通过 MSW 拦截 fetch/XHR，在浏览器内返回假数据；切后端上线时删除对应 handler 即可。
2. 💰 **如何创收？**
   • 最快路径：自营小批量周边商品，利润即现金流；
   • 技术接单：将本项目作为作品集，挂靠接外包；
   • SaaS 模式：支持多店铺部署，按月收费。
3. 📦 **多平台适配策略？**
   • Web H5 + PWA 一次开发；
   • 使用 Taro 打包微信/支付宝小程序；
   • React Native 重用业务逻辑（可选）。

---

> **行动建议**
>
> 1. 立即 fork 此计划，创建同名 Project 看板；
> 2. 每完成一半天块即勾选子任务，Push / PR；
> 3. 遇阻先查文档，再提 Issue，保持节奏。

祝你 4 周后成功上线并赚到第一笔收入！
