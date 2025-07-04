# 4 周电商练手项目实战计划书  
（按半天 ≈ 4 h 粒度安排，周末不休息，共 56 个时间块）  
面向：独立新手开发者   |  时间：2025 年 6 月  
目标：从 0 到上线并可创收的完整电商应用（前端优先开发，支持微信支付）  

> 需求来源：详见 [`docs/overview.md`](overview.md)。所有任务拆解均基于其中的 MVP 功能与非功能需求，请优先查阅。  

---

## 一、技术栈与工具

| 层次 | 选型 | 说明 |
|---|---|---|
| 前端 | React 18 + Vite + TypeScript + TailwindCSS + Zustand | 主流组合，社区活跃，文档丰富 |
| Mock | MSW (Mock Service Worker) | 前端阶段脱离后端即可联调 |
| 后端 | NestJS + PostgreSQL (Prisma ORM) + Redis | 结构清晰、CLI 丰富，易学易扩展 |
| 支付 | 微信支付 v3 Sandbox | 先接入沙箱，后替换正式商户号 |
| 测试 | Jest + RTL (前端) / Supertest (后端) | 保证回归与重构安全 |
| DevOps | GitHub + GitHub Actions CI/CD + Docker | 免费额度充足，流程简单 |
| 部署 | Vercel (前端) / Render or 腾讯云 Serverless (后端) | 几分钟即可上线 |
| 协作 | Cursor IDE + GitHub Projects | AI-Pair & 看板管理 |

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
| Day | 时段 | 任务概述 | 子任务待办 |
|---|---|---|---|
| 1 | 上午 | 环境&仓库初始化 | ☐ 安装 Node 20、PNPM <br> ☐ 配置 VSCode + Cursor 插件 <br> ☐ 注册 / 登录 GitHub，创建私有仓库 `wechat-shop` <br> ☐ 初始化 README.md，写项目愿景 <br> ☐ 提交首个 commit |
|   | 下午 | 需求分析 & 功能分解 | ☐ 列出 MVP 功能（商品列表、详情、购物车、结算、订单、用户）<br> ☐ 制作用户流程图 (draw.io)<br> ☐ 创建 GitHub Project 看板，列 Epic / Story<br> ☐ 编写 API 资源草表 (商品 / 订单 …)<br> ☐ 制定数据库 ER 草图 |
| 2 | 上午 | UI/UX 设计原型 | ☐ 使用 Figma 绘制首页 / 商品卡片 / 购物车弹窗草图<br> ☐ 设定品牌色 & 字体<br> ☐ 输出移动端 375 px 和桌面 1440 px 版式<br> ☐ 标注组件尺寸 & 状态<br> ☐ 将原型图链接写入 README |
|   | 下午 | 前端脚手架搭建 | ☐ `pnpm create vite@latest wechat-shop --template react-ts`<br> ☐ `pnpm add -D tailwindcss postcss autoprefixer` 并执行 `npx tailwindcss init -p`<br> ☐ 配置 ESLint + Prettier + Husky 提交钩子<br> ☐ 建 `src/components`, `src/pages`, `src/styles` 目录<br> ☐ hello world 页面跑通本地 `pnpm dev` |
| 3 | 上午 | 路由 & 布局体系 | ☐ `pnpm add react-router-dom@6`<br> ☐ 设置主布局 `Layout.tsx` (Header, Footer, Outlet)<br> ☐ 配置路由：`/`, `/product/:id`, `/cart`, `/checkout`, `/orders`<br> ☐ 加入懒加载 `React.lazy`<br> ☐ 在 README 绘制路由表 |
|   | 下午 | 状态管理 & Mock 方案 | ☐ `pnpm add zustand` 建立 `useCartStore`<br> ☐ `pnpm add -D msw`<br> ☐ 编写 `src/mocks/handlers.ts` 商品列表 / 详情 / 购物车接口<br> ☐ service worker 注册开关（仅 dev 环境）<br> ☐ 用 Mock 数据渲染首页列表 |
| 4 | 上午 | 商品列表页面完成 | ☐ 列表瀑布流 / 网格布局 Tailwind<br> ☐ 商品卡片组件抽离 (图片 / 标题 / 价格)<br> ☐ 加入 Skeleton loading<br> ☐ 点击卡片跳转详情<br> ☐ 单元测试 `ProductCard.test.tsx` |
|   | 下午 | 商品详情 & 购物车交互 | ☐ `useParams` 取 :id 调用 Mock<br> ☐ 数量加减、规格选择<br> ☐ `addToCart(product)` 调用 zustand<br> ☐ 侧边抽屉/弹窗展示购物车<br> ☐ 购物车数量徽标联动 |
| 5 | 上午 | 结算&地址表单原型 | ☐ 页面 `/checkout` 骨架<br> ☐ 使用 React Hook Form 创建地址输入<br> ☐ 校验规则 (手机号, 邮编)<br> ☐ Mock 订单金额计算接口<br> ☐ 按钮"去支付"显示未接入提示 |
|   | 下午 | 单元/集成测试搭建 | ☐ `pnpm add -D jest @testing-library/react @testing-library/jest-dom`<br> ☐ 配置 `vitest` 亦可选<br> ☐ 编写首页渲染 smoke test<br> ☐ 配置 CI：GitHub Actions 触发 test<br> ☐ README 更新测试 badge |
| 6 | 上午 | 代码质量工具 | ☐ 集成 SonarLint 插件<br> ☐ 设置 TypeScript 严格模式<br> ☐ 配置 absolute import 路径 `@/`<br> ☐ Storybook 初始化（组件文档）<br> ☐ 在 CI 中执行 `npm run lint` |
|   | 下午 | 前端阶段复盘 & 文档同步 | ☐ 更新 API Mock 描述至 `docs/api.md`<br> ☐ 总结本周遇到的问题 + 解决<br> ☐ 生成 `CHANGELOG.md` Week 1<br> ☐ Roadmap 看板移动已完成卡片<br> ☐ 预研 NestJS 创建步骤 |

---

### Week 2 前端功能完备 & UI 打磨
| Day | 时段 | 任务概述 | 子任务待办 |
|---|---|---|---|
| 7 | 上午 | 订单列表 & 详情页面 | ☐ 路由 `/orders` & `/orders/:id`<br> ☐ Mock 历史订单数据<br> ☐ 订单卡片组件<br> ☐ 分页 / 无限滚动<br> ☐ 详情展示商品快照 |
|   | 下午 | 用户中心原型 | ☐ `/profile` 基本信息页<br> ☐ Mock 登录态 (localStorage token)<br> ☐ 头像上传占位<br> ☐ 地址管理入口<br> ☐ 安全设置 placeholder |
|   | 下午 | 用户中心扩展 | ☐ `/profile` 基本信息页<br> ☐ Mock 登录态 (localStorage token)<br> ☐ 头像上传占位<br> ☐ 地址管理入口<br> ☐ 浏览记录页 `/profile/history` (最近浏览 20 条)<br> ☐ 我的收藏 `/profile/favorites` 列表<br> ☐ 我的优惠券 `/profile/coupons` 列表 |
| 8 | 上午 | 图片上传 & OSS 预研 | ☐ 调研腾讯云 COS / 阿里 OSS<br> ☐ 用 Mock URL 占位上传返回<br> ☐ 创建通用 `Uploader` 组件<br> ☐ 撤销、进度条逻辑<br> ☐ Unit test for Uploader |
|   | 下午 | 样式规范化 | ☐ 配置 Tailwind Theme (`tailwind.config.js`)<br> ☐ 提炼颜色/字号/圆角变量<br> ☐ 提供 `@apply` mixin 框架<br> ☐ Dark Mode 切换 demo<br> ☐ Figma Token 对应更新 |
| 9 | 上午 | 国际化 & 数字格式 | ☐ `pnpm add react-i18next`<br> ☐ 中/英语言包抽离<br> ☐ 价格格式化 `Intl.NumberFormat`<br> ☐ 日期 `dayjs` 本地化<br> ☐ 切换按钮完成 |
|   | 下午 | 性能优化 & 懒加载 | ☐ 路由分包 `chunkName` 注释<br> ☐ 图片懒加载 `<img loading="lazy">` 或 `react-lazy-load-image`<br> ☐ Lighthouse 测试<br> ☐ Tailwind purge 配置<br> ☐ 记录性能基线 |
| 10 | 上午 | PWA 支持 | ☐ `pnpm add -D vite-plugin-pwa`<br> ☐ 生成 manifest.json (名称/图标)<br> ☐ 离线缓存首页 & 静态资源<br> ☐ 添加安装提示<br> ☐ 测试 Chrome DevTools 加装 |
|    | 下午 | 前端与后端契约文档 | ☐ 使用 OpenAPI 3.1 草稿<br> ☐ 定义 `GET /products` 等接口 schema<br> ☐ 生成 `openapi.yaml` 放 `/api` 目录<br> ☐ `pnpm add -D openapi-typescript` 生成类型<br> ☐ README 更新如何 mock |
| 11 | 上午 | Storybook 组件文档完善 | ☐ 写 `ProductCard.stories.tsx`, `Button.stories.tsx`<br> ☐ 配置 Addon-controls<br> ☐ 自动快照测试<br> ☐ Deploy Storybook 到 GitHub Pages<br> ☐ PR Review checklist |
|    | 下午 | 前端收尾 & 移交 | ☐ 清理 TODO / console.log<br> ☐ `npm run build` 产物 sizecheck<br> ☐ Issue 列出后台需求清单<br> ☐ Week 2 回顾会议记录<br> ☐ 更新里程碑、推进 Week 3 |

---

### Week 3 后端实现 & 真数据联调
| Day | 时段 | 任务概述 | 子任务待办 |
|---|---|---|---|
| 12 | 上午 | NestJS 项目初始化 | ☐ `pnpm add -g @nestjs/cli`；`nest new backend`<br> ☐ 配置 ESLint, Prettier, Jest<br> ☐ 环境区分 `.env.dev/.env.prod`<br> ☐ Dockerfile & docker-compose 基础<br> ☐ 首次 commit |
|    | 下午 | 数据库模型 & Prisma | ☐ `pnpm add -D prisma`；`npx prisma init`<br> ☐ 建表：User, Product, CartItem, Order, Address<br> ☐ `prisma migrate dev --name init`<br> ☐ 种子脚本 `prisma/seed.ts`<br> ☐ ER 图导出 |
| 13 | 上午 | 用户模块 & JWT | ☐ nest g module user / service / controller<br> ☐ 注册、登录、加密 `bcrypt`<br> ☐ 签发 JWT、守卫 `AuthGuard`<br> ☐ Postman 测试通过<br> ☐ 单元测试 service |
|    | 下午 | 商品模块 API | ☐ 列表、详情、搜索分页<br> ☐ Prisma 查询优化 `select`<br> ☐ Swagger Decorator 添加<br> ☐ 响应 DTO & 验证管道<br> ☐ 10 条种子商品生成 |
| 14 | 上午 | 购物车 & 订单逻辑 | ☐ 添加/修改/删除 CartItem API<br> ☐ 结算金额计算服务抽象<br> ☐ 生成订单号 (雪花算法或 UUID)<br> ☐ 订单状态枚举 draft/paid/failed<br> ☐ E2E 测试 Cart → Order |
|    | 下午 | 微信支付沙箱接入 | ☐ 注册沙箱 key，下载证书<br> ☐ `pnpm add @wechat-pay/node` SDK<br> ☐ 创建 `/pay/wxpay` controller<br> ☐ 本地回调地址 ngrok 映射测试<br> ☐ 记录签名校验 |
|    | 晚上 | Coupon & 收藏 & 浏览 API | ☐ 建表：Coupon, Favorite, BrowseRecord<br> ☐ nest g module/service/controller (coupon/favorite/history)<br> ☐ 券的状态流转 (未使用/已使用/已过期)<br> ☐ API: 领取优惠券、我的优惠券列表<br> ☐ API: 收藏/取消收藏、获取收藏列表<br> ☐ API: 新增浏览记录、获取最近浏览 |
| 15 | 上午 | 集成 Redis & 队列 | ☐ `pnpm add ioredis bull`<br> ☐ 创建 Job：订单超时取消<br> ☐ NestJS BullModule 配置<br> ☐ 本地观察流水日志<br> ☐ Unit test for consumer |
|    | 下午 | 前后端联调 (产品&购物车) | ☐ 修改前端 API baseURL 指向后端<br> ☐ 移除对应 MSW mock<br> ☐ 验证商品列表真数据<br> ☐ 处理跨域 CORS<br> ☐ 记录 bug / fix |
| 16 | 上午 | 前后端联调 (支付&订单) | ☐ 调用后端生成支付参数<br> ☐ H5 调起微信支付 (沙箱公众号)<br> ☐ 回调后变更订单状态<br> ☐ 前端支付成功界面<br> ☐ 日志 & 失败重试策略 |
|    | 下午 | 安全 & 日志 | ☐ Helmet 中间件、RateLimit<br> ☐ Winston 日志到文件 & 控制台<br> ☐ 生产日志分级 error/info/debug<br> ☐ Swagger Auth token 全局 header<br> ☐ Week 3 Summary & 文档同步 |

---

### Week 4 上线部署 & 运营变现
| Day | 时段 | 任务概述 | 子任务待办 |
|---|---|---|---|
| 17 | 上午 | CI/CD 流水线 | ☐ GitHub Actions 前端 build + Vercel Deploy<br> ☐ 后端 Docker build & push ghcr.io<br> ☐ Render 自动拉取镜像<br> ☐ .env secrets 设置<br> ☐ 成功自动部署 |
|    | 下午 | 域名 & HTTPS | ☐ 购买域名 (阿里云 / Cloudflare)<br> ☐ Vercel 一键启用 SSL<br> ☐ 后端自配 Cloudflare Tunnel<br> ☐ 更新 CORS 允许域<br> ☐ 记录部署手册 |
| 18 | 上午 | SEO & 性能 | ☐ Next-SEO 或 react-helmet 注入 meta<br> ☐ 站点地图 sitemap.xml & robots.txt<br> ☐ GTmetrix / PageSpeed 优化<br> ☐ 图片压缩 WebP<br> ☐ Bundle Analyzer 体积报告 |
|    | 下午 | 移动端适配 & Mini-Program 预研 | ☐ Tailwind 响应式断点核查<br> ☐ PWA 在 Android 安装测试<br> ☐ 调研 Taro/Uni-App porting 难度<br> ☐ 小程序支付差异点记录<br> ☐ 形成技术决策文档 |
| 19 | 上午 | 数据分析 & 埋点 | ☐ 集成 umami / Matomo 自托管<br> ☐ 埋点：商品点击、支付成功<br> ☐ Dashboard 搭建<br> ☐ 定期导出 CSV<br> ☐ 数据隐私合规检查 |
|    | 下午 | 监控 & 告警 | ☐ Sentry 前后端接入<br> ☐ Render 健康检查 endpoint<br> ☐ ChatOps：错误发送到 Slack / 飞书<br> ☐ 定时备份 PostgreSQL<br> ☐ 压力测试 k6 报告 |
| 20 | 上午 | 商户号申请 & 正式支付 | ☐ 提交企业资料申请微信商户号<br> ☐ 替换沙箱 key 为正式 key<br> ☐ 线下 0.01 元真实支付<br> ☐ 核对财务对账单<br> ☐ 更新 privacy policy |
|    | 下午 | 创收渠道规划 | ☐ 方案 1：自营商品利润<br> ☐ 方案 2：SaaS 授权（租用店铺）<br> ☐ 方案 3：技术接单（外包）<br> ☐ 注册 Fiverr / 猿急送 / 开源接单群<br> ☐ 制作展示 Demo & 报价单 |
| 21 | 上午 | 市场推广启动 | ☐ 申请微信公众号 + 小程序<br> ☐ 发布功能亮点推文<br> ☐ 抖音/视频号 demo 视频<br> ☐ GitHub 开源，写中文/英文 README<br> ☐ Hacker News & 掘金 投递 |
|    | 下午 | 文档 & 交付物整理 | ☐ 完成 `docs/architecture.md`<br> ☐ API 文档 Swagger 导出 HTML<br> ☐ 部署 Storybook 静态站<br> ☐ 生成使用手册 PDF<br> ☐ 项目 logo / icon 收尾 |
| 22 | 上午 | 用户反馈 & 快速迭代 | ☐ 收集首批种子用户反馈表<br> ☐ 制作 Issues 标签：bug/feature<br> ☐ 完成 2 个高优 bug 修复<br> ☐ Hotfix 部署<br> ☐ 更新 CHANGELOG |
|    | 下午 | 复盘 & 未来 roadmap | ☐ 绘制甘特图对比实际 vs 计划<br> ☐ 总结技术收获 & 踩坑<br> ☐ 梳理可自动化/可外包环节<br> ☐ 制定 3 个月扩展计划<br> ☐ 公开发布复盘文章 |

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
> 1. 立即 fork 此计划，创建同名 Project 看板；  
> 2. 每完成一半天块即勾选子任务，Push / PR；  
> 3. 遇阻先查文档，再提 Issue，保持节奏。  

祝你 4 周后成功上线并赚到第一笔收入！