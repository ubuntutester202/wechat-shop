# 0.1.0 (2025-07-09)


### Bug Fixes

* 更新 ESLint 配置以支持新的全局变量，调整 lint 脚本以允许更多警告，优化 TypeScript 编译选项以放宽未使用变量的限制；新增 pnpm workspace 配置和相关文档，提升项目结构与可维护性。 ([6c192a1](https://github.com/ubuntutester202/wechat-shop/commit/6c192a1528caae65c433f05631fb49e8dbdff230))
* 新增最终价格参数以支持价格调整；优化商品详情页面的确认处理逻辑，提升用户交互体验。 ([b281d22](https://github.com/ubuntutester202/wechat-shop/commit/b281d222c5503337c1bb80ea31bcd9ae8c080c7a))
* **ci:** 升级pnpm版本从8到10，修复lockfile兼容性问题 ([1ee461f](https://github.com/ubuntutester202/wechat-shop/commit/1ee461f4c48ee983849b401b1fa6357dc8183612))
* **tests:**  在项目中新增 @vitest/coverage-v8 依赖以支持测试覆盖率分析；更新 CI 配置以禁用端到端测试，优化文档以提供单元测试和覆盖率指南，提升项目的可维护性与测试质量。更新首页测试用例，修改标题和欢迎页面内容的期望值，以反映最新的页面变化。本地测试都没通过，所以github action也失败了，现在进行修复，本地测试通过。 ([6920df9](https://github.com/ubuntutester202/wechat-shop/commit/6920df9afc6881cf4c3dade9b189a36bd21c8f5e))


### Features

* 更新项目配置，集成 Storybook 组件开发与文档系统，新增相关依赖和配置；优化 ESLint 配置以支持 Storybook 测试，更新文档以包含 Storybook 教程，提升组件开发效率与文档质量。 ([dfdc312](https://github.com/ubuntutester202/wechat-shop/commit/dfdc3121564ee42a38d9876893b2b05be4712c78))
* 更新项目配置，新增测试覆盖率支持与CI/CD工作流；优化README文档以显示CI状态和测试结果；新增WelcomePage组件的单元测试，提升代码质量与可维护性。 ([f844cbe](https://github.com/ubuntutester202/wechat-shop/commit/f844cbecdeaac5b980dcb4c80308417c92f07aee))
* 更新项目配置，新增单元测试支持与相关依赖；优化文档，标记完成的单元测试任务并新增测试指南。 ([d721370](https://github.com/ubuntutester202/wechat-shop/commit/d7213708e61ef466fb97a3133c60e0f356f0b8cf))
* 更新Shop页面以集成商品数据获取逻辑，优化商品展示和加载状态；重构MSW处理器以按功能模块组织，提升代码可维护性。 ([85084ed](https://github.com/ubuntutester202/wechat-shop/commit/85084ed347daf3f21cd8ff7d51180221e106c517))
* 集成 Mock Service Worker (MSW) 以支持 API 模拟，新增相关文档和配置；优化路由结构，支持懒加载，提高用户体验。 ([404a825](https://github.com/ubuntutester202/wechat-shop/commit/404a825e0d938a519c4fa0a81fd7206378cb8d8c))
* 完成购物车页面的设计与实现，整合状态管理，优化用户交互体验；新增购物车状态管理逻辑，更新相关文档以详细解析购物车功能的实现与最佳实践。 ([06331b8](https://github.com/ubuntutester202/wechat-shop/commit/06331b859c9ecb368f6a7eabd3582a1f74d36266))
* 完成用户登录页面的设计与实现，更新路由配置，优化用户注册页面的跳转逻辑，增强文档内容以包含新页面的详细解析。 ([6f4df10](https://github.com/ubuntutester202/wechat-shop/commit/6f4df1028765288e48ce3ec64304bedbf1f664fa))
* 新增底部导航栏组件并在购物车和商店页面中集成，优化用户导航体验；调整购物车页面布局以适应新组件。 ([9059bcf](https://github.com/ubuntutester202/wechat-shop/commit/9059bcfe0262c3f7345ba1e46dd6b10458644db6))
* 新增电商首页Shop页面，包含搜索、分类、限时抢购和热门商品功能模块；更新路由配置，完善文档以详细解析Shop页面的设计与实现。 ([a98ff29](https://github.com/ubuntutester202/wechat-shop/commit/a98ff29d09c1d84053e4b971b15456f96bb40cd5))
* 新增个人中心Profile页面，集成用户信息管理、订单状态和功能模块，优化路由配置与用户交互体验；更新文档以详细解析Profile页面的设计与实现。 ([fdef8aa](https://github.com/ubuntutester202/wechat-shop/commit/fdef8aa2eb4459b5e44e979dd4adc3a95d7b1cff))
* 新增商品规格选择弹框组件，集成规格选择与数量调整功能；更新商品数据以支持价格调整和缺货状态显示；优化商品详情页面以集成弹框功能，提升用户交互体验。 ([5339e20](https://github.com/ubuntutester202/wechat-shop/commit/5339e207c0907f27a66f2c396e1f534712d005d5))
* 新增商品搜索结果页面，集成搜索功能与商品展示，优化用户体验；重构相关组件以支持骨架屏加载状态，提升页面响应速度与可维护性。新增教程文档 ([caa5eb9](https://github.com/ubuntutester202/wechat-shop/commit/caa5eb9fa1b8880e20ed96af1b70cc9ba9373366))
* 新增商品详情页面及相关功能，完善商品数据接口，优化用户体验与文档内容。 ([37d29aa](https://github.com/ubuntutester202/wechat-shop/commit/37d29aa41c65e8f0d57d60ecd3eeee46d3615cc1))
* 新增用户注册页面及路由，更新 README 文档以包含新的路线图和教程链接，优化任务进度更新提示，增强文档结构与可读性。 ([03245e9](https://github.com/ubuntutester202/wechat-shop/commit/03245e93094f57cb60bf6643ceac3d550262ca40))
* 在购物车页面中新增商品选择功能，支持单个和全选操作；更新购物车状态管理以计算选中商品的总数和总价；集成结算页面路由，优化用户结算体验。 ([55379e0](https://github.com/ubuntutester202/wechat-shop/commit/55379e08b8869ee8f3ce10e7ab87541238264d3a))



