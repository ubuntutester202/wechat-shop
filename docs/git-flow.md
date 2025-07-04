# Git 分支与发布策略

本项目基于 *Git Flow* 略微简化，以适配个人 / 小团队高频发布场景。

## 分支类型
| 分支 | 来源 | 用途 | 终点 |
|------|------|------|------|
| `main` | `develop` / `hotfix/*` | 生产环境代码 | Tag 版本
| `develop` | `feature/*` | 集成测试环境 | `main` 周期性合并
| `feature/*` | `develop` | 单一功能或任务 | `develop`
| `hotfix/*` | `main` | 紧急线上修复 | `main` & `develop`

## 工作流示例
```bash
# 新功能
git checkout develop
git pull
git checkout -b feature/cart-batch-delete
...
# 提 PR -> develop

# 紧急修复
git checkout main
git pull
git checkout -b hotfix/pay-bug
...
# 提 PR -> main, 合并后再 cherry-pick 到 develop
```

## 版本命名
- 采用 *SemVer*：`v<MAJOR>.<MINOR>.<PATCH>`。
- **BREAKING CHANGE** 合并入 `main` 时需提升 MAJOR。
- 常规功能增加：MINOR +1；补丁 / 修复：PATCH +1。

## Tag & 发布流程
1. `main` 合并后，GitHub Actions 自动生成变更日志 (`cliff`) 并打 Tag。
2. 前端自动部署至 Vercel `production`；后端镜像推至 `ghcr.io` 并由 Render 拉取。
3. Tag 会触发 `release` 工作流，生成 GitHub Release Notes。

## 回滚策略
```
# 若 v1.2.0 出现严重问题
git checkout main
git revert v1.2.0
# 自动触发 CI/CD 推送 v1.2.1-hotfix
```

## 分支删除
- 合并后的 `feature/*`、`hotfix/*` 分支可在 GitHub 上删除，避免污染命名空间。 