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
