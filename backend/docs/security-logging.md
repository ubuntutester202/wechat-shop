# 安全和日志功能实现

本文档描述了在 NestJS 后端项目中实现的安全和日志功能。

## 🔒 安全功能

### 1. Helmet 中间件
- **位置**: `src/main.ts`
- **功能**: 设置各种 HTTP 头部以增强安全性
- **配置**:
  - Content Security Policy (CSP)
  - 禁用 X-Powered-By 头部
  - 为 Swagger UI 兼容性禁用 Cross-Origin-Embedder-Policy

### 2. 速率限制 (Rate Limiting)
- **位置**: `src/app.module.ts`
- **功能**: 防止 API 滥用和 DDoS 攻击
- **配置**:
  - **短期限制**: 10 次请求/分钟
  - **中期限制**: 100 次请求/10分钟
  - **长期限制**: 1000 次请求/小时

## 📝 日志功能

### 1. Winston 日志配置
- **位置**: `src/config/logger.config.ts`
- **功能**: 统一的日志管理和格式化

#### 开发环境日志
- **控制台输出**: 彩色格式，便于开发调试
- **文件输出**: JSON 格式，便于分析

#### 生产环境日志
- **日志级别**: 仅记录 error 级别日志
- **文件大小**: 最大 20MB，保留 5 个备份文件
- **格式**: JSON 格式，便于日志分析工具处理

### 2. 自定义日志服务
- **位置**: `src/common/logger.service.ts`
- **功能**: 提供统一的日志接口

#### 日志方法
- `info()`: 信息日志
- `warn()`: 警告日志
- `error()`: 错误日志
- `debug()`: 调试日志
- `verbose()`: 详细日志

#### 专用日志方法
- `logUserAction()`: 用户操作日志
- `logApiRequest()`: API 请求日志
- `logDatabaseOperation()`: 数据库操作日志
- `logSecurityEvent()`: 安全事件日志

### 3. HTTP 请求日志拦截器
- **位置**: `src/common/interceptors/logging.interceptor.ts`
- **功能**: 自动记录所有 HTTP 请求和响应
- **记录内容**:
  - 请求方法和路径
  - 响应状态码
  - 请求处理时间
  - 错误信息（如果有）

## 📁 日志文件结构

```
backend/logs/
├── combined.log      # 所有级别的日志
├── error.log         # 仅错误日志
├── debug.log         # 调试日志（开发环境）
├── exceptions.log    # 未捕获异常
└── rejections.log    # 未处理的 Promise 拒绝
```

## ⚙️ 环境变量配置

### 开发环境 (`.env.dev`)
```env
# 日志配置
LOG_LEVEL=debug
ENABLE_DEBUG_LOG=true
```

### 生产环境 (`.env.prod`)
```env
# 日志配置
LOG_LEVEL=error
ENABLE_DEBUG_LOG=false
```

## 🛡️ 安全日志事件

系统会自动记录以下安全事件：

1. **登录失败事件**:
   - `LOGIN_FAILED_EMAIL_NOT_FOUND`: 邮箱不存在
   - `LOGIN_FAILED_PHONE_NOT_FOUND`: 手机号不存在
   - `LOGIN_FAILED_WECHAT_USER_NOT_FOUND`: 微信用户不存在
   - `LOGIN_FAILED_INVALID_PASSWORD`: 密码错误

2. **速率限制事件**:
   - `RATE_LIMIT_EXCEEDED`: 超过速率限制

## 🧪 测试功能

运行测试脚本验证安全和日志功能：

```bash
cd backend
npm run build
node dist/test-security-logging.js
```

## 📊 日志监控建议

1. **生产环境监控**:
   - 监控错误日志文件大小和增长率
   - 设置关键安全事件的告警
   - 定期分析登录失败模式

2. **日志轮转**:
   - Winston 已配置自动日志轮转
   - 建议定期清理旧日志文件

3. **安全分析**:
   - 监控异常登录尝试
   - 分析 API 访问模式
   - 跟踪用户操作轨迹

## 🔧 扩展功能

可以进一步扩展的功能：

1. **日志聚合**: 集成 ELK Stack 或类似工具
2. **实时监控**: 集成 Prometheus + Grafana
3. **告警系统**: 基于日志事件的自动告警
4. **审计日志**: 更详细的用户操作审计
5. **IP 黑名单**: 基于安全事件的自动 IP 封禁