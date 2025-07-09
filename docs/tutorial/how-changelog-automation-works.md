# CHANGELOG 自动化完整指南

## 🎯 概述

本项目使用 **conventional-changelog** 自动生成 CHANGELOG，基于 [Conventional Commits](https://www.conventionalcommits.org/) 规范，实现版本管理和发布记录的自动化。

## 🛠️ 技术栈

- **conventional-changelog-cli**: 自动生成 CHANGELOG
- **commitizen**: 交互式规范化 commit
- **cz-conventional-changelog**: Angular 规范适配器

## 📋 Commit 规范

### 标准格式

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type 类型说明

| Type       | 说明      | 版本影响 | 示例                                |
| ---------- | --------- | -------- | ----------------------------------- |
| `feat`     | 新功能    | minor    | `feat(auth): 新增用户登录功能`      |
| `fix`      | Bug 修复  | patch    | `fix(cart): 修复购物车数量计算错误` |
| `docs`     | 文档更新  | -        | `docs(api): 更新API使用说明`        |
| `style`    | 代码格式  | -        | `style: 修复ESLint警告`             |
| `refactor` | 重构      | -        | `refactor(utils): 优化价格计算逻辑` |
| `perf`     | 性能优化  | patch    | `perf(search): 优化商品搜索性能`    |
| `test`     | 测试      | -        | `test(cart): 新增购物车单元测试`    |
| `chore`    | 构建/工具 | -        | `chore: 升级依赖版本`               |

### Scope 作用域

| Scope     | 说明     | Scope  | 说明     |
| --------- | -------- | ------ | -------- |
| `auth`    | 认证登录 | `ui`   | UI 组件  |
| `cart`    | 购物车   | `api`  | API 接口 |
| `payment` | 支付     | `ci`   | CI/CD    |
| `profile` | 个人中心 | `deps` | 依赖管理 |

## 🚀 完整操作流程

### 1. 开发完成后的提交流程

#### 推荐方式：使用 Commitizen

```bash
# 1. 暂存文件
git add .

# 2. 交互式提交（推荐）
pnpm run commit
```

Commitizen 会引导你完成规范的 commit：

```
? 选择变更类型: feat
? 变更影响的范围: profile
? 简短描述: 新增头像上传功能
? 详细描述: 支持点击上传、拖拽上传和预览
? 是否有破坏性变更: No
? 是否关闭issue: No
```

#### 手动提交方式

```bash
git add .
git commit -m "feat(profile): 新增头像上传功能"
```

### 2. 版本管理和发布

#### 场景 1：日常开发中的版本更新

```bash
# 根据改动类型选择版本升级
npm version patch   # Bug修复: 0.1.0 -> 0.1.1
npm version minor   # 新功能: 0.1.0 -> 0.2.0
npm version major   # 破坏性变更: 0.1.0 -> 1.0.0

# 自动生成CHANGELOG
pnpm run changelog

# 提交版本文件
git add CHANGELOG.md package.json package-lock.json
git commit -m "chore: 发布 v0.2.0"

# 推送到远程（包含tag）
git push origin main --tags
```

#### 场景 2：首次发布

```bash
# 生成完整CHANGELOG
pnpm run changelog:first

# 提交并推送
git add CHANGELOG.md
git commit -m "docs: 初始化CHANGELOG"
git push origin main
```

#### 场景 3：多个提交一次发布

```bash
# 1. 分别提交各个功能
git commit -m "feat(auth): 新增用户登录状态管理"
git commit -m "feat(ui): 新增头像上传组件"
git commit -m "fix(profile): 修复退出登录交互问题"

# 2. 统一发布版本
npm version minor  # 因为有新功能
pnpm run changelog
git add CHANGELOG.md package.json package-lock.json
git commit -m "chore: 发布 v0.2.0"
git push origin main --tags
```

## 📄 生成的 CHANGELOG 格式

```markdown
# [0.2.0](https://github.com/user/repo/compare/v0.1.0...v0.2.0) (2025-01-15)

### Bug Fixes

- **profile**: 修复退出登录交互问题 ([abc123](https://github.com/user/repo/commit/abc123))

### Features

- **auth**: 新增用户登录状态管理 ([def456](https://github.com/user/repo/commit/def456))
- **ui**: 新增头像上传组件 ([ghi789](https://github.com/user/repo/commit/ghi789))
```

## 💡 最佳实践

### ✅ 好的 Commit 示例

```bash
feat(cart): 新增批量删除功能
fix(auth): 修复token过期处理
docs(readme): 更新安装说明
style(profile): 修复ESLint警告
perf(search): 优化搜索算法性能
```

### ❌ 避免的 Commit 示例

```bash
fix: 修复bug                    # 太模糊
feat: 新增功能                  # 没有说明具体功能
update: 更新代码                # 不是标准type
修复购物车问题                   # 没有使用英文格式
```

### 版本升级规则

- **patch (0.1.0 → 0.1.1)**: 仅有 `fix`, `perf`, `docs` 等
- **minor (0.1.0 → 0.2.0)**: 包含 `feat` 新功能
- **major (0.1.0 → 1.0.0)**: 有 `BREAKING CHANGE`

### 提交粒度建议

```bash
# ✅ 推荐：功能单一，便于回滚
git commit -m "feat(auth): 新增登录状态管理"
git commit -m "feat(ui): 新增头像上传组件"
git commit -m "fix(profile): 修复登出响应问题"

# ❌ 避免：一次提交包含太多功能
git commit -m "feat: 新增用户系统包括登录状态头像上传和各种修复"
```

## 🔧 配置文件说明

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

## 🚨 常见问题解决

### Q1: commit 消息写错了怎么办？

```bash
# 修改最后一次commit消息
git commit --amend -m "feat(auth): 新增用户登录功能"

# 如果已经push，需要强制推送（谨慎使用）
git push --force-with-lease origin main
```

### Q2: 想要重新生成 CHANGELOG 怎么办？

```bash
# 删除现有CHANGELOG
rm CHANGELOG.md

# 重新生成完整CHANGELOG
pnpm run changelog:first
```

### Q3: 版本号打错了怎么办？

```bash
# 回退版本号
git reset --hard HEAD~1
git tag -d v0.2.0  # 删除错误的tag

# 重新设置正确版本
npm version 0.1.1
```

## 🎯 总结

1. **开发时**：规范 commit 消息，一个功能一个 commit
2. **发布前**：运行 `npm version` 更新版本号
3. **发布时**：运行 `pnpm run changelog` 生成更新日志
4. **推送时**：确保包含 tag: `git push origin main --tags`

这样就能保持清晰的版本历史和自动化的 CHANGELOG 生成！
