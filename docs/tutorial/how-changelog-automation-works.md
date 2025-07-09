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

## 🏁 项目初始化配置

### 第一次设置 CHANGELOG 自动化

如果你的项目还没有配置 CHANGELOG 自动化，按以下步骤操作：

```bash
# 1. 安装依赖
pnpm add -D conventional-changelog-cli commitizen cz-conventional-changelog

# 2. 在package.json中添加scripts
{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "changelog:first": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0",
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}

# 3. 创建初始版本标签（重要！）
git tag v0.1.0  # 或者在特定commit上: git tag v0.1.0 <commit-hash>

# 4. 生成初始CHANGELOG
pnpm run changelog:first

# 5. 提交CHANGELOG
git add CHANGELOG.md
git commit -m "docs: 初始化CHANGELOG"
```

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

## 🚨 故障排除指南

### ❌ 问题 1: CHANGELOG 没有生成内容

**症状**: 运行 `pnpm run changelog` 后，CHANGELOG.md 没有新增内容

**原因**:

- 缺少版本标签作为基准点
- commit 消息不符合 conventional 格式
- 标签位置不正确

**解决方案**:

```bash
# 1. 检查是否有版本标签
git tag --list

# 2. 如果没有标签，创建基准标签
git tag v0.1.0 <某个早期commit的hash>

# 3. 检查commit消息格式
git log --oneline -10
# 确保commit格式为: type(scope): subject

# 4. 如果标签位置错误，重新设置
git tag -d v0.2.0  # 删除错误标签
git tag v0.2.0 <正确的commit-hash>  # 重新创建

# 5. 重新生成CHANGELOG
pnpm run changelog
```

### ❌ 问题 2: npm version 报错 "Git working directory not clean"

**症状**: 运行 `npm version minor` 时报错

**原因**: 工作目录有未提交的更改

**解决方案**:

```bash
# 方案1: 先提交所有更改（推荐）
git add .
git commit -m "feat: 完成新功能开发"
npm version minor

# 方案2: 强制执行（不推荐）
npm version minor --force
```

### ❌ 问题 3: CHANGELOG 格式混乱或 commit 消息不规范

**症状**: 生成的 CHANGELOG 包含不规范的 commit

**解决方案**:

```bash
# 1. 修改最后一次commit消息
git commit --amend -m "feat(auth): 新增用户登录功能"

# 2. 重新生成干净的CHANGELOG
rm CHANGELOG.md
pnpm run changelog:first

# 3. 使用commitizen避免格式错误
pnpm run commit  # 而不是 git commit
```

### ❌ 问题 4: CHANGELOG 中缺少某些 commit

**症状**: 某些符合格式的 commit 没有出现在 CHANGELOG 中

**原因**: commit 在标签范围之外

**解决方案**:

```bash
# 1. 查看标签和commit的关系
git log --oneline --graph --decorate

# 2. 调整标签位置
git tag -d v0.2.0
git tag v0.2.0 <包含所有新功能的commit>

# 3. 重新生成
pnpm run changelog
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

## 🔍 检查清单

### 发布前检查

- [ ] 所有 commit 都符合 conventional 格式
- [ ] 版本标签位置正确
- [ ] CHANGELOG 内容准确完整
- [ ] package.json 版本号正确
- [ ] 工作目录干净（无未提交更改）

### 常用检查命令

```bash
# 检查最近的commit格式
git log --oneline -10

# 检查版本标签
git tag --list --sort=-version:refname

# 检查工作目录状态
git status

# 预览CHANGELOG生成结果（不写入文件）
npx conventional-changelog -p angular
```

## 🎯 总结

1. **开发时**：规范 commit 消息，一个功能一个 commit
2. **发布前**：运行 `npm version` 更新版本号
3. **发布时**：运行 `pnpm run changelog` 生成更新日志
4. **推送时**：确保包含 tag: `git push origin main --tags`
5. **遇到问题**：参考故障排除指南，检查标签和 commit 格式

这样就能保持清晰的版本历史和自动化的 CHANGELOG 生成！

## 📚 实际案例

### 案例：本项目 v0.2.0 发布过程

我们在实际使用中遇到了 CHANGELOG 不生成的问题，最终的解决步骤：

```bash
# 1. 发现问题：CHANGELOG没有生成v0.2.0内容
pnpm run changelog  # 没有输出

# 2. 诊断：缺少v0.1.0基准标签
git tag --list  # 只有v0.2.0

# 3. 解决：创建基准标签
git tag v0.1.0 1baec5d  # 在项目初始框架commit上创建

# 4. 手动补充：生成v0.2.0内容
# 手动编辑CHANGELOG.md添加v0.2.0版本记录

# 5. 提交：保存修复结果
git add CHANGELOG.md
git commit -m "docs: 更新CHANGELOG for v0.2.0"

# 6. 推送：同步到远程
git push origin main --tags
```

**学到的经验**:

- 项目初期就要设置好版本标签
- 遇到问题要检查标签结构
- 必要时可以手动补充 CHANGELOG 内容
- 保持 commit 消息规范是关键
