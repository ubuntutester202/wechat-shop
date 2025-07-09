# CHANGELOG 自动化工作指南

## 概述

本项目采用 **conventional-changelog** 方案自动生成 CHANGELOG，基于 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 🛠️ 技术栈

- **conventional-changelog-cli**: 自动生成 CHANGELOG
- **commitizen**: 规范化 commit 流程
- **cz-conventional-changelog**: Conventional Commits 适配器

## 📋 Commit 规范

### 基本格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type       | 说明      | 示例                         |
| ---------- | --------- | ---------------------------- |
| `feat`     | 新功能    | `feat: 添加用户登录功能`     |
| `fix`      | Bug 修复  | `fix: 修复购物车计算错误`    |
| `docs`     | 文档更新  | `docs: 更新API文档`          |
| `style`    | 代码格式  | `style: 修复ESLint警告`      |
| `refactor` | 重构      | `refactor: 优化商品查询逻辑` |
| `test`     | 测试相关  | `test: 添加购物车单元测试`   |
| `chore`    | 构建/工具 | `chore: 升级依赖版本`        |
| `perf`     | 性能优化  | `perf: 优化商品列表加载速度` |

### Scope 范围（可选）

| Scope     | 说明     |
| --------- | -------- |
| `api`     | API 相关 |
| `ui`      | 用户界面 |
| `auth`    | 认证相关 |
| `cart`    | 购物车   |
| `payment` | 支付     |
| `ci`      | CI/CD    |
| `deps`    | 依赖管理 |

## 🚀 使用方法

### 1. 标准提交流程

#### 传统方式

```bash
git add .
git commit -m "feat(cart): 添加购物车批量删除功能"
```

#### Commitizen 方式（推荐）

```bash
git add .
pnpm run commit
```

Commitizen 会提供交互式界面帮助你规范化 commit：

```
? 选择此次提交的更改类型: feat
? 此次更改的影响范围: cart
? 简短描述此次更改: 添加购物车批量删除功能
? 详细描述此次更改: 用户可以选择多个商品进行批量删除
? 是否有破坏性更改: No
? 此次更改是否影响任何开放的issue: No
```

### 2. 生成 CHANGELOG

#### 增量更新（推荐）

```bash
pnpm run changelog
```

#### 完整重新生成

```bash
pnpm run changelog:first
```

### 3. 自动化流程

每次发布新版本时：

```bash
# 1. 更新版本号
npm version patch  # 或 minor/major

# 2. 生成CHANGELOG
pnpm run changelog

# 3. 提交更改
git add CHANGELOG.md package.json
git commit -m "chore: 发布 v0.1.1"

# 4. 推送到远程
git push origin main --tags
```

## 📝 CHANGELOG 格式示例

生成的 CHANGELOG 格式如下：

```markdown
# 0.1.0 (2025-01-15)

### Bug Fixes

- **cart**: 修复购物车计算错误 ([abc123](https://github.com/user/repo/commit/abc123))
- **auth**: 修复登录状态丢失问题 ([def456](https://github.com/user/repo/commit/def456))

### Features

- **payment**: 集成微信支付功能 ([ghi789](https://github.com/user/repo/commit/ghi789))
- **ui**: 添加商品详情页面 ([jkl012](https://github.com/user/repo/commit/jkl012))

### Performance Improvements

- **api**: 优化商品查询性能 ([mno345](https://github.com/user/repo/commit/mno345))
```

## 🎯 最佳实践

### 1. Commit 消息质量

- ✅ **清晰简洁**: `feat: 添加商品搜索功能`
- ❌ **模糊不清**: `fix: 修复bug`

### 2. 合理使用 Scope

- ✅ **有意义**: `fix(cart): 修复数量计算错误`
- ❌ **过于宽泛**: `fix(frontend): 修复一些问题`

### 3. Breaking Changes

对于破坏性更改，在 footer 中说明：

```
feat(api): 重构用户API

BREAKING CHANGE: 用户API端点从 /user 改为 /api/users
```

### 4. 关联 Issue

```
fix(cart): 修复购物车数量显示错误

Closes #123
```

## 🔧 配置说明

### package.json scripts

```json
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "changelog:first": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0",
    "commit": "cz"
  }
}
```

### commitizen 配置

```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

## 📊 CI/CD 集成

### GitHub Actions 自动生成 CHANGELOG

```yaml
name: Release
on:
  push:
    tags: ["v*"]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Generate CHANGELOG
        run: |
          npm run changelog
          git add CHANGELOG.md
          git commit -m "docs: 更新CHANGELOG" || exit 0
```

## 🎮 实际例子

### Week 1 开发日志

当前项目的 CHANGELOG 已经包含了 Week 1 的所有功能开发：

- ✅ **Features**: 15 个新功能（Shop 页面、Profile 页面、商品详情等）
- ✅ **Bug Fixes**: 4 个问题修复（CI 配置、测试修复等）
- ✅ **自动分类**: 按功能和修复分类，便于查阅

### 团队协作优势

1. **规范化**: 所有人都遵循相同的 commit 格式
2. **自动化**: CHANGELOG 自动生成，无需手动维护
3. **可追溯**: 每个改动都有明确的类型和影响范围
4. **发布友好**: 版本发布时可以清楚地看到改动内容

## 🚨 注意事项

1. **commit 格式**: 不规范的 commit 不会出现在 CHANGELOG 中
2. **范围控制**: scope 要有意义，避免过于细碎或宽泛
3. **描述质量**: subject 要能让其他开发者快速理解改动内容
4. **破坏性更改**: 一定要在 commit 中明确标注
5. **定期更新**: 建议每个 Sprint 或版本发布前更新 CHANGELOG

## 🔗 相关链接

- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [conventional-changelog 文档](https://github.com/conventional-changelog/conventional-changelog)
- [commitizen 使用指南](https://github.com/commitizen/cz-cli)
