# 开发环境配置指南

## 🎯 环境选择建议

### 开发阶段推荐：混合模式（Docker数据库 + 本地应用）

**为什么推荐混合模式？**

- ✅ **启动速度快**：本地应用启动比Docker容器快
- ✅ **热重载迅速**：文件修改立即生效，无需重建镜像
- ✅ **调试方便**：可直接使用IDE断点调试
- ✅ **资源占用少**：只运行必要的Docker服务
- ✅ **环境一致**：数据库环境与生产环境一致

## 🚀 快速启动

### 方式一：混合模式（推荐日常开发）

```bash
# 1. 启动数据库容器
docker-compose up -d postgres

# 2. 启动后端（本地）
cd backend
npm install
npm run start:dev

# 3. 启动前端（新终端）
cd frontend
npm install
npm run dev
```

### 方式二：完整Docker环境（推荐集成测试）

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看后端日志
docker-compose logs -f backend
```

### 方式三：纯本地环境

```bash
# 需要本地安装PostgreSQL数据库
# 修改 .env.dev 中的 DATABASE_URL 为本地数据库地址
cd backend
npm run start:dev
```

## 📁 环境配置文件

| 文件          | 用途       | DATABASE_URL主机 |
| ------------- | ---------- | ---------------- |
| `.env.dev`    | 本地开发   | `localhost`      |
| `.env.docker` | Docker环境 | `postgres`       |
| `.env.prod`   | 生产环境   | 生产数据库地址   |

## 🔧 常用命令

### Docker相关

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs backend
docker-compose logs postgres

# 重建服务
docker-compose build backend

# 停止所有服务
docker-compose down


# 重建服务
docker-compose build backend
# 清理数据卷（谨慎使用）
docker-compose down -v
docker-compose up -d
```

### 数据库相关

```bash
# 生成Prisma客户端
npm run prisma:generate

# 运行数据库迁移
npx prisma migrate dev

# 查看数据库
npx prisma studio

# 连接Docker中的数据库
docker-compose exec postgres psql -U user201 -d wechat_shop

# 在容器内运行迁移（如果需要）
docker-compose exec backend npx prisma migrate dev
```

## 🐛 常见问题

### 1. 端口冲突

```bash
# 检查端口占用
netstat -ano | findstr :3001
netstat -ano | findstr :5432

# 停止冲突的Docker容器
docker-compose down
```

### 2. 数据库连接失败

```bash
# 确保数据库容器正在运行
docker-compose ps

# 检查数据库健康状态
docker-compose logs postgres

# 重启数据库容器
docker-compose restart postgres
```

### 3. Prisma相关错误

```bash
# 重新生成Prisma客户端
npm run prisma:generate

# 重置数据库（谨慎使用）
npx prisma migrate reset
```

## 🧪 API测试

### 测试端点

- 注册：`POST http://localhost:3001/auth/register`
- 登录：`POST http://localhost:3001/auth/login`
- 用户信息：`GET http://localhost:3001/auth/profile`

### 示例请求

```bash
# 注册用户
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","nickname":"测试用户","phone":"13800138000"}'

# 登录
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📊 性能对比

| 环境       | 启动时间   | 热重载     | 调试便利性 | 环境一致性 |
| ---------- | ---------- | ---------- | ---------- | ---------- |
| 混合模式   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐   |
| 完整Docker | ⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐     | ⭐⭐⭐⭐⭐ |
| 纯本地     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐       |

## 🎯 最佳实践

1. **日常开发**：使用混合模式
2. **功能测试**：使用完整Docker环境
3. **部署前验证**：使用Docker环境
4. **团队协作**：统一使用Docker配置
5. **CI/CD**：使用Docker环境确保一致性

## 🔄 环境切换

```bash
# 从本地切换到Docker
docker-compose down  # 停止可能的冲突服务
docker-compose up -d  # 启动Docker环境

# 从Docker切换到本地
docker-compose stop backend  # 只停止后端容器
cd backend && npm run start:dev  # 启动本地后端
```
