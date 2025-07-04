# 贡献指南

感谢你对本项目的兴趣！即使目前由个人主导，我们仍保持专业的协作流程，方便未来扩展团队或接收外部 PR。

## 环境准备
1. 克隆仓库并安装依赖：
   ```bash
   git clone git@github.com:yourname/wechat-shop.git
   cd wechat-shop
   pnpm install
   ```
2. 复制并调整环境变量：
   ```bash
   cp .env.example .env.dev
   # 按需修改数据库、Redis 等连接串
   ```

## 分支模型
- `main`：可随时部署的稳定分支。
- `develop`：日常集成分支，合并后自动部署到测试环境。
- `feature/<topic>`：功能开发分支，派生自 `develop`。
- `hotfix/<issue>`：生产紧急修复，派生自 `main`。

详见 `docs/git-flow.md`。

## 提交规范（Conventional Commits）
示例：
```
feat(cart): 支持批量删除购物车商品
```
常用类型：`feat` `fix` `docs` `refactor` `test` `chore`。

> 每次提交会由 Husky + lint-staged 自动执行 `eslint --fix` 与单元测试。

## Pull Request 流程
1. 确保关联 Issue，并在描述中说明：
   - 做了什么？
   - 为什么这样做？
   - 如何验证？
2. 通过所有 CI 检查：lint、test、build。
3. 至少 1 次 code review 后方可 Squash & Merge。

## 代码风格与质量
- **TypeScript**：开启 `strict`；避免 `any`。
- **React**：函数式组件 + Hooks；UI 与逻辑分离。
- **TailwindCSS**：统一使用 `@apply` 提炼公共样式。
- 单元测试覆盖率门槛 ≥ 60%，核心业务 ≥ 80%。

## 文档同步
如修改或新增接口 / 架构决策，请同时更新：
- `docs/api-contract.md`
- `docs/adr/*`

## 开发命令速览
```bash
# 前端
pnpm --filter frontend dev
# 后端
pnpm --filter backend start:dev
# 运行全部测试
pnpm test
```

祝编码愉快！ 