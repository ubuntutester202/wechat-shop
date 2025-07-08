# WeChat Shop

<p align="center">
  <b>面向个人卖家的一站式微信电商解决方案</b><br/>
  <sub>React 18 · NestJS · PostgreSQL · 微信支付 v3 · Serverless</sub>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"/></a>
  <a href="https://example.com/ci-status">
  <img src="https://img.shields.io/badge/CI%20Status-passing-brightgreen.svg" alt="CI Status"></a>
  <a href="https://github.com/yourname/plan3-online-sales-wechat/actions/workflows/ci.yml"><img src="https://img.shields.io/badge/tests-passing-brightgreen.svg" alt="Tests"/></a>
</p>

---

## ✨ 项目简介

`wechat-shop` 致力于帮助小商家和个人开发者 **用最少的成本** 搭建微信生态的电商平台，涵盖从商品展示、购物车、结算到微信支付与订单管理的全流程。

> 本仓库遵循 **前端优先** 原则，先使用 Mock 数据完成 UI/交互，再接入 NestJS 后端和微信支付沙箱，最后一键部署。

## 🔥 核心特性

- **零部署开箱即用**：Vercel + Render 免费额度即可上线。
- **多端复用**：同一代码库支持 Web H5 / PWA，后续计划接入小程序。
- **微信支付 v3**：官方 SDK，沙箱演练 → 正式环境秒切换。
- **模块化后端**：NestJS + Prisma，易扩展、易测试。
- **AI 助力开发**：推荐使用 Cursor IDE 进行代码生成与重构。

## 🛠️ 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 · Vite · TypeScript · TailwindCSS · Zustand · MSW |
| 后端 | NestJS · PostgreSQL · Prisma ORM · Redis · BullMQ |
| DevOps | GitHub Actions · Docker · Vercel (Web) · Render (API) |
| 支付 | 微信支付 v3 SDK |

## 🚀 快速开始

```bash
# 克隆仓库
$ git clone git@github.com:yourname/wechat-shop.git && cd wechat-shop

# 安装依赖（需要 pnpm）
$ pnpm install

# 启动前端 (http://localhost:5173)
$ pnpm --filter frontend dev

# 启动后端 (http://localhost:3000)
$ pnpm --filter backend start:dev

# 运行全部测试
$ pnpm test
```

> 📖 本地开发需提前准备 PostgreSQL & Redis，或修改 `.env.dev` 连接字符串指向 docker-compose 服务。

## 📚 文档索引

- 项目概述：[`docs/overview.md`](docs/overview.md)
- 4 周实操计划书：[`docs/action-plan.md`](docs/action-plan.md)
- API 资源设计：[`docs/api-resources.md`](docs/api-resources.md)
- 数据库 ER 图：[`docs/database-er.md`](docs/database-er.md)
- Git Flow 策略：[`docs/git-flow.md`](docs/git-flow.md)
- 贡献指南：[`CONTRIBUTING.md`](CONTRIBUTING.md)
- Roadmap：[roadmap.md](docs/roadmap.md)
- 所有教程在[docs/tutorial](./docs/tutorial)
- 查看完整路线图与任务拆解，请见 [`docs/action-plan.md`](docs/action-plan.md)。

## 🤝 贡献

欢迎 Issue / PR！在开始之前，请阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md) 以及遵循 Git 提交规范。

## 📄 License

[MIT](LICENSE) © 2025 yourname
