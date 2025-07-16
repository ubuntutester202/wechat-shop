# 技术教程总览

本部分包含了项目相关的各类技术教程和深入解析文章，旨在帮助开发者理解项目背后的技术栈、架构设计和最佳实践。

## 目录

- [**深入解析：从浏览器地址栏到 React 页面的奇妙旅程**](./how-vite-react-app-works.md): 详细解释了 Vite+React 应用的启动和渲染全过程。
- [**用户注册页的实现与路由集成**](./how-create-account-page-works.md): 详解 CreateAccountPage 的设计动机、页面结构、核心交互与路由注册。
- [**用户登录页的设计与交互实现**](./how-login-page-works.md): 基于 Figma 设计稿实现的 LoginPage 组件详细解析，包含 UI 组件结构、状态管理和路由导航。
- [**电商首页的设计与实现：Shop 页面深度解析**](./how-shop-page-works.md): 全面解析 Shop 页面的技术架构、图片资源管理、状态管理策略和 UI 组件实现，包含倒计时功能、图片加载错误处理等核心技术点。
- [**解构购物车：状态管理与 UI 分离的最佳实践**](./how-cart-and-state-management-works.md): 深入探讨了如何使用 Zustand 实现全局购物车状态管理，并将其与 React 组件（商品页、购物车页）解耦，实现数据与视图的分离。
- [**个人中心架构解析：从路由到交互的完整实现指南**](./how-profile-page-works.md): 深入解析 Profile 页面的模块化架构设计、分层布局策略、订单管理系统集成以及完整的用户交互体验实现，展示现代电商应用个人中心页面的最佳实践。
- [**MSW Mock 数据集成深度解析：路由顺序与 API 设计**](./how-msw-mock-integration-works.md): 深入探讨 MSW 路由配置中的核心概念，特别是路由顺序问题的排查与解决方案。通过实际案例分析，全面解析 productHandlers 的设计模式、错误处理机制和最佳实践，帮助开发者构建稳定可靠的前端 mock 系统。
- [**搜索体验的艺术：构建高效、美观的商品搜索结果页**](./how-search-result-page-works.md): 全面解析一个现代化搜索结果页的前端架构，覆盖从原子化组件（商品卡片、骨架屏）到页面级编排（Tailwind 网格布局、状态管理）的全过程。
- [**ProductCard 组件单元测试完全指南**](./how-ProductCard-unit-testing-works.md): 深入解析单元测试的工作原理，从 Vitest 环境配置到具体测试用例实现，详细讲解测试运行逻辑、结果判读和最佳实践，为前端组件测试提供完整的技术指南。
- [**React 进阶语法与特性深度学习：ProductSpecModal 组件案例解析**](./how-product-spec-modal-works.md): 通过一个真实的商品规格选择弹框组件，深入学习 React 的核心概念、TypeScript 集成、useState/useEffect Hooks、复杂状态管理、组件通信、条件渲染、函数式编程等现代前端开发的最佳实践。
- [**结算功能实现教程**](./how-checkout-functionality-works.md): 介绍结算功能的关键技术和新特性，包括 Zustand 状态管理的进阶用法、React Hook Form 表单处理、MSW Mock 扩展，以及组件状态与 UI 交互的最佳实践。
- [**GitHub Actions CI/CD 完全指南**](./how-github-actions-cicd-works.md): 深入解析 GitHub Actions 持续集成/持续部署的完整实现，覆盖工作流配置、缓存策略、测试自动化、质量保障体系以及故障排除，为项目提供自动化质量保障的最佳实践指南。

* [**如何进行单元测试**](./how-unit-testing-works.md) - 介绍了项目如何使用 Vitest 和 React Testing Library 进行单元测试，包括基本概念、关键 API 和配置。

- [**Storybook 组件开发与文档系统教程**](./how-storybook-works.md): 全面介绍 Storybook 这一现代前端组件开发利器，涵盖基础概念、配置详解、Story 编写、高级功能运用和最佳实践，助力团队构建高质量的组件库和设计系统。
- [**CHANGELOG 自动化工作指南**](./how-changelog-automation-works.md): 本项目采用 **conventional-changelog** 方案自动生成 CHANGELOG
- [**NestJS 创建步骤**](./how-nestjs-preparation-works.md): 这个预研不是要你成为 NestJS 专家，而是让你对 Week 3 的后端开发有足够的概念基础和信心。通过理解核心概念、熟悉开发流程、了解技术栈集成，你将能够更顺利地执行 Week 3 的具体开发任务！

- [**订单管理系统架构解析：从用户点击到无限滚动的完整实现指南**](./how-order-management-works.md): 全面剖析电商应用的订单管理核心功能，从用户在 Profile 页面的第一次点击到订单详情页面的完整渲染过程。深入解析路由系统、组件架构、无限滚动实现、Mock 数据设计、状态管理与筛选逻辑、事件冒泡控制、智能导航等设计模式的最佳实践。

* [**如何实现头像真实上传与解决 Vitest 配置冲突**](./how-real-avatar-upload-and-test-config-works.md) - 讲解了如何将头像上传从模拟实现升级为对接腾讯云 COS 的真实上传，并记录了解决 Vite 与 Storybook 测试配置冲突的详细过程。

- [**如何正确生成并查看 Lighthouse 性能报告**](./how-to-run-and-view-lighthouse-report.md): 详细分步教程，指导如何为项目生成 Lighthouse 性能报告，并讲解了如何通过本地服务器和在线查看器正确浏览报告，避免常见的“白屏”问题。

- [**如何使用 OpenAPI 驱动 API 开发**](./how-openapi-workflow-works.md): 详解本项目“契约先行”的 API 开发工作流，指导开发者如何通过修改 `openapi.yaml` 契约文件并运行脚本来自动同步 API 的 TypeScript 类型。
- [**NestJS 后端项目准备教程**](./how-to-prepare-a-NestJs-backend-project.md.md): 详细分步教程，指导如何从零开始初始化一个 NestJS 项目，并完成环境配置、Docker 容器化以及 Docker Compose 编排，为后续的业务开发打下坚实基础。
- [**如何使用 Prisma 为 NestJS 项目搭建数据库**](./how-database-with-prisma-works.md): 详细介绍了为后端引入并配置 Prisma ORM 和 PostgreSQL 数据库的完整流程，并记录了在 Docker 环境中遇到的关键问题（如 `node:20-slim` 镜像的选择）及其解决方案。
- [**NestJS 用户模块生成深度解析：从命令行到模块化架构的完整实现**](./how-nestjs-user-module-generation-works.md): 全面解析 NestJS 用户模块的生成过程，从 CLI 命令执行到模块化架构的建立，深入讲解模块、服务、控制器的创建流程，以及与 Prisma 数据模型的集成方案，为后续用户认证和权限管理功能奠定坚实基础。
- [**用户认证与密码加密系统工作原理**](./how-authentication-and-encryption-works.md): 详细解析项目中的用户认证系统，包括用户注册、登录验证以及bcrypt密码加密的完整实现流程。从用户提交表单到JWT令牌生成的整个认证链路，涵盖多种登录方式、安全最佳实践和API测试示例。
- [**开发环境使用说明**](./README-Development.md): 通俗易懂说明如何在本地开发环境中运行项目。

- [**AuthService 单元测试教程**](./how-auth-service-unit-testing-works.md): 深入解析 NestJS 中 AuthService 的单元测试实现，涵盖用户注册、登录验证、JWT 令牌生成等核心功能的测试策略，以及 Prisma 服务的 Mock 技巧和测试最佳实践。
- [**UserService 单元测试教程**](./how-user-service-unit-testing-works.md): 全面讲解 UserService 单元测试的设计与实现，包括用户创建、查找、密码验证、信息更新等功能的测试用例编写，以及依赖注入、Mock 管理和异常处理的测试策略。
- [**npm test 故障排除教程**](./how-npm-test-troubleshooting-works.md): 系统性介绍 NestJS 项目中测试失败的排查和解决方法，通过实际案例分析集成测试数据污染和控制器依赖注入问题的解决策略，提供完整的测试故障排除指南。
- [**商品模块 API 实现教程**](./how-product-api-module-works.md): 详细介绍商品模块 API 的完整实现过程，包括数据模型设计、服务层逻辑、控制器接口以及数据传输对象（DTO）的定义。涵盖商品列表、详情、搜索分页、查询优化、单元测试等核心功能的技术实现和最佳实践。
- [**NestJS Swagger API 文档集成教程**](./how-nestjs-swagger-api-documentation-works.md): 全面解析 NestJS 项目中 Swagger API 文档的集成实现，从基础配置到装饰器应用，从 DTO 定义到复杂类型处理。详细介绍控制器文档化、响应格式标准化、认证集成等核心技术，以及解决 DTO 显示为空等常见问题的最佳实践。
- [**购物车模块实现教程**](./how-cart-module-implementation-works.md): 全面解析电商系统购物车模块的完整实现，从数据模型设计到 API 接口开发，从业务逻辑处理到单元测试覆盖。详细介绍 DTO 数据传输、服务层架构、控制器设计、模块集成等核心技术，以及库存验证、商品规格支持、批量操作等高级功能的最佳实践。
- [**后端订单模块实现教程：从结算计算到订单管理的完整架构解析**](./how-backend-order-module-works.md): 深入解析电商系统订单模块的完整后端实现，从结算金额计算服务到订单生命周期管理。详细介绍数据模型设计、业务逻辑抽象、API 接口规范、测试策略等核心技术，以及订单号生成算法、优惠券集成、性能优化、安全防护等高级功能的最佳实践。
- [**购物车到订单 E2E 测试教程**](./how-cart-to-order-e2e-works.md)：详细讲解如何用 Playwright 编写和维护购物车到订单全流程 E2E 测试，涵盖 Mock 隔离、弹窗断言、全选功能等常见问题与最佳实践。
- [**购物车模拟微信支付功能实现教程**](./how-wechat-payment-simulation-works.md): 全面解析电商系统中购物车到微信支付的完整实现流程，包括前端支付页面组件、后端支付接口设计、模拟支付回调处理等核心技术。深入讲解React懒加载、路由导航、支付参数传递、状态管理等关键技术点，以及支付系统的安全性和用户体验优化策略。
- [**安全与日志系统教程：构建企业级 NestJS 应用的安全防护与监控体系**](./how-security-and-logging-works.md): 全面解析 NestJS 应用的安全与日志系统实现，包括 Helmet 安全中间件、RateLimit 限流机制、Winston 日志系统配置等核心功能。深入讲解从应用启动到请求处理的完整安全防护流程，以及生产环境日志分级、性能监控、安全审计等企业级最佳实践。
