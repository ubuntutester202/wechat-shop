# 项目概述

## 产品定位

面向个人卖家与初创品牌的一站式微信电商解决方案，提供从商品展示、下单支付到订单管理的完整链路，零开发部署成本，极速上线。

## 目标用户

1. 拥有微信流量、需要快速上线商城的小商家。
2. 想要验证电商 MVP 的创业团队。
3. 需要二次开发或自定义主题的前端工程师。

## 核心卖点

- **即插即用**：前端 PWA + 微信支付一键接入，开箱即用。
- **多端复用**：同一代码库支持 Web H5、PWA、未来小程序、RN。
- **低成本维护**：Serverless + Docker，一人即可维护全栈。
- **可扩展**：基于 NestJS & Prisma，模块化设计，易于增加新业务。

## MVP 功能范围

| 模块       | 说明                                                                         |
| ---------- | ---------------------------------------------------------------------------- |
| 商品管理   | 列表、详情、库存、上下架、搜索、筛选                                         |
| 购物车     | 加购、数量编辑、删除、持久化（localStorage）、结算、买家一次下单可跨店铺结算 |
| 结算       | 地址簿、运费计算、优惠券占位                                                 |
| 支付       | 微信支付 v3 沙箱/正式环境                                                    |
| 订单       | 创建、状态流转、历史查询                                                     |
| 用户       | 微信注册登录、JWT、个人信息、地址管理                                        |
| 浏览记录   | 最近浏览 20 条，便于二次购买                                                 |
| 优惠券系统 | 商家创建折扣券，买家领取并在结算抵扣                                         |
| 收藏       | 商品收藏夹、库存到货提醒                                                     |

## 角色与权限

- **买家（PersonalUser）**：浏览、下单、支付、评价。
- **商家（MerchantUser）**：商品管理、订单处理、数据看板。
  - 普通买家可在"我的店铺"页申请升级为商家，管理员审核通过后获得后台权限。

## 非功能需求

- 首屏加载 ≤ 3s（4G 网络）
- 服务可用性 ≥ 99.5%
- 日志保留 30 天，可按需查询

## 关联文档

- 实操计划书：[`docs/action-plan.md`](action-plan.md)
- API 资源设计：[`docs/api-resources.md`](api-resources.md)
- 本项目的接口遵循 [OpenAPI 3.1](https://www.openapis.org/) 规范，契约文件位于 [`/api/openapi.yaml`](/api/openapi.yaml)。它统一了前后端的接口定义。
- 数据库 ER 图：[`docs/database-er.md`](database-er.md)

## 技术栈摘要

前端：React 18 + Vite + TypeScript + TailwindCSS + Zustand + MSW  
后端：NestJS + PostgreSQL（Prisma ORM）+ Redis + Bull  
支付：微信支付 v3  
DevOps：GitHub Actions + Docker + Vercel/Render

## 路线图（里程碑）

| 版本 | 目标                     | 预计时间 |
| ---- | ------------------------ | -------- |
| v0.1 | Mock 数据可交互前端 Demo | W1 结束  |
| v0.5 | 后端 API & 支付沙箱联通  | W3 中    |
| v1.0 | 正式支付上线、可接单创收 | W4 结束  |

## 目录结构速览

```txt
├── api/                             # OpenAPI 规范目录
├── backend/                         # 后端应用 (待开发)
│   ├── src/
│   └── package.json
├── docs/                            # 项目文档
│   └── tutorial/                    # 教程文档
├── frontend/                        # 前端应用 (Vite + React)
│   ├── public/                      # Vite 公共资源
│   ├── src/                         # 前端源代码
│   │   ├── assets/                  # 静态资源 (图片、数据)
│   │   ├── components/              # React 组件 (通用、UI)
│   │   ├── mocks/                   # MSW Mock Service Worker 配置
│   │   ├── pages/                   # 页面级组件
│   │   ├── stores/                  # Zustand 状态管理
│   │   ├── stories/                 # Storybook 文件
│   │   ├── test/                    # Vitest 配置文件
│   │   ├── types/                   # 类型定义
│   │   ├── utils/                   # 工具函数
│   │   ├── App.tsx                  # 应用根组件
│   │   └── main.tsx                 # 应用入口
│   ├── index.html                   # HTML 入口文件
│   └── package.json                 # 前端依赖与脚本
├── packages/                        # (规划中) 共享代码包
├── tests/                           # Playwright E2E 测试
├── .gitignore
├── package.json                     # Monorepo 根 package.json
└── pnpm-workspace.yaml              # pnpm 工作区配置
```

## 联系与支持

- 问题反馈：请在 GitHub Issues 提交，遵循模板。
- 加入交流群：请查看 README 中的二维码。
