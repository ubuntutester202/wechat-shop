# 如何使用 Prisma 为 NestJS 项目搭建数据库

本文档详细介绍了为我们的电商项目后端（基于 NestJS）引入并配置 Prisma ORM 和 PostgreSQL 数据库的完整流程。它不仅涵盖了标准步骤，还记录了在此过程中遇到的关键问题及其解决方案，特别是关于 Docker 环境搭建和调试的部分。

**适用场景**：本教程适合只有前端环境，需要从零开始搭建后端环境的开发者。按照本教程，你将能够成功启动后端服务并进行基本的 API 测试。

## 0. 前置条件检查

在开始之前，请确保你的开发环境满足以下条件：

### 必需软件
- **Docker Desktop**：用于运行 PostgreSQL 数据库和后端服务
- **Node.js**：版本 18+ （用于本地开发和依赖管理）
- **pnpm**：包管理器（如果没有安装，运行 `npm install -g pnpm`）

### 环境检查命令
```bash
# 检查 Docker 是否正常运行
docker --version
docker-compose --version

# 检查 Node.js 版本
node --version

# 检查 pnpm 是否安装
pnpm --version
```

### 项目结构确认
确保你的项目根目录包含以下文件：
- `docker-compose.yml`
- `backend/` 目录
- `backend/Dockerfile`
- `backend/.env.dev`
- `backend/prisma/schema.prisma`

## 1. 快速启动指南（新手必读）

如果你是第一次搭建这个后端环境，请按照以下步骤操作：

### 步骤 1：克隆项目并安装依赖
```bash
# 进入项目根目录
cd plan3-online-sales-wechat

# 安装后端依赖
cd backend
pnpm install
cd ..
```

### 步骤 2：检查环境配置文件
确保 `backend/.env.dev` 文件存在且包含正确的配置：
```bash
# 检查文件是否存在
ls backend/.env.dev

# 查看文件内容
cat backend/.env.dev
```

应该包含类似以下内容：
```env
# For backend service
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://postgres:password@postgres:5432/wechat-shop?schema=public"

# For postgres service
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=wechat-shop
```

### 步骤 3：启动 Docker 服务
```bash
# 构建并启动所有服务（数据库 + 后端）
docker-compose up -d --build

# 检查容器状态
docker-compose ps
```

### 步骤 4：执行数据库迁移
```bash
# 在后端容器中执行 Prisma 迁移
docker-compose exec backend npx prisma migrate dev --name init
```

### 步骤 5：测试 API 是否正常
```bash
# 测试基本端点
curl http://localhost:3001
# 应该返回: Hello World!

# 测试用户端点
curl http://localhost:3001/users
# 应该返回: []
```

或者在浏览器中访问：
- `http://localhost:3001` - 应该显示 "Hello World!"
- `http://localhost:3001/users` - 应该显示空数组 `[]`

### 常见问题排查

**问题 1：容器启动失败**
```bash
# 查看容器日志
docker-compose logs backend
docker-compose logs postgres
```

**问题 2：数据库连接失败**
```bash
# 重启服务
docker-compose restart backend

# 检查数据库是否健康
docker-compose exec postgres pg_isready -U postgres
```

**问题 3：端口被占用**
```bash
# 检查端口占用情况
netstat -ano | findstr :3001
netstat -ano | findstr :5432
```

---

## 2. 整体流程图

```mermaid
graph TD
    A[开始：搭建后端环境] --> B[检查前置条件];
    B --> C[安装项目依赖<br/>pnpm install];
    C --> D[检查环境配置<br/>backend/.env.dev];
    D --> E[启动 Docker 服务<br/>docker-compose up -d --build];
    E --> F[等待容器启动完成<br/>docker-compose ps];
    F --> G[执行数据库迁移<br/>docker-compose exec backend npx prisma migrate dev];
    G --> H[测试 API 端点<br/>curl http://localhost:3001];
    H --> I{API 测试成功？};
    I -->|是| J[环境搭建完成 ✅];
    I -->|否| K[排查问题];
    K --> L[检查容器日志<br/>docker-compose logs];
    L --> M[检查端口占用<br/>netstat -ano];
    M --> N[重启服务<br/>docker-compose restart];
    N --> H;
    
    style J fill:#90EE90
    style K fill:#FFB6C1
```

## 2. 关键概念解析

### 为什么数据库迁移需要单独执行？

你可能会疑惑：为什么 `docker-compose exec backend npx prisma migrate dev --name init` 这一步需要在外面单独执行，而不是直接添加到 `backend/Dockerfile` 里面，让 `docker-compose up -d --build` 阶段自动执行呢？

这是一个非常好的问题！原因如下：

#### 1. **构建时 vs 运行时的区别**
- **Docker 构建阶段**（`docker-compose up -d --build`）：此时数据库容器还没有启动
- **Prisma 迁移需要**：连接到**正在运行**的数据库，这只能在容器启动后进行
- **时序问题**：构建是静态的，迁移是动态的，需要活跃的数据库连接

#### 2. **开发环境 vs 生产环境**
- `prisma migrate dev` 是**开发专用**命令，包含交互式确认
- 生产环境应该使用 `prisma migrate deploy`，这是非交互式的
- 在 Dockerfile 中硬编码开发命令会导致生产部署问题

#### 3. **数据库状态管理**
- 迁移是**一次性操作**，不应该每次容器重启都执行
- 需要检查数据库当前状态来决定是否需要迁移
- 重复执行迁移可能导致数据丢失或结构冲突

#### 4. **最佳实践对比**

❌ **错误做法**（在 Dockerfile 中）：
```dockerfile
# 这样做是错误的
RUN npx prisma migrate dev --name init
```
问题：构建时数据库还没启动，会失败

✅ **正确做法**（分离关注点）：
```bash
# 1. 先构建和启动容器
docker-compose up -d --build

# 2. 再执行迁移（此时数据库已运行）
docker-compose exec backend npx prisma migrate dev --name init
```

#### 5. **可选的自动化方案**

如果你想要更自动化的体验，可以考虑：

**方案 A：启动脚本**
```bash
# 创建 scripts/start-dev.sh
#!/bin/bash
docker-compose up -d --build
echo "等待数据库启动..."
sleep 10
docker-compose exec backend npx prisma migrate deploy
echo "后端环境已就绪！"
```

**方案 B：健康检查 + 初始化容器**
```yaml
# docker-compose.yml 中添加
services:
  db-migrate:
    build: ./backend
    command: npx prisma migrate deploy
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/wechat-shop
```

但目前的手动方案实际上是**最佳实践**，因为它：
- 给了开发者对数据库迁移的完全控制权
- 避免了自动化脚本可能带来的隐藏问题
- 让每一步都透明可见，便于调试

---

## 3. 为什么选择 Prisma？

在现代 Web 开发中，直接操作数据库虽然灵活，但常常伴随着繁琐的 SQL 语句编写、类型安全缺失和高昂的维护成本。ORM (Object-Relational Mapping) 工具应运而生，而 Prisma 是其中的佼佼者。

我们选择 Prisma 主要基于以下几点：

- **类型安全**：Prisma Client 是完全类型安全的。这意味着你在 TypeScript 代码中访问数据库时，可以获得自动补全，并且任何不符合数据模型的操作都会在编译时被发现，极大地减少了运行时错误。
- **直观的 Schema 定义**：你可以在 `schema.prisma` 文件中使用简洁、易读的 Prisma Schema Language (PSL) 来定义数据模型，而不是直接编写 SQL `CREATE TABLE` 语句。
- **强大的查询引擎**：Prisma 提供了一套流畅、易于理解的 API 来执行常见的数据库查询，可读性远超复杂的 SQL。
- **优秀的迁移工具**：`prisma migrate` 可以根据 `schema.prisma` 的变更自动生成 SQL 迁移文件，并安全地应用到数据库，让数据库结构的版本控制变得简单可靠。

## 4. 核心搭建流程

整个搭建过程可以分为以下几个关键步骤。

### 步骤一：初始化 Prisma

在 `backend` 目录下，我们首先安装了 Prisma 的依赖并执行了初始化。

```bash
# 进入后端目录
cd backend

# 安装 Prisma CLI 作为开发依赖
pnpm add -D prisma

# 安装 Prisma Client
pnpm add @prisma/client

# 初始化 Prisma, 指定数据源为 PostgreSQL
npx prisma init --datasource-provider postgresql
```

这个命令会创建两个核心文件：

- `prisma/schema.prisma`：用于定义数据模型。
- `.env`：用于存放敏感信息，如数据库连接字符串。

### 步骤二：定义数据模型 (`schema.prisma`)

我们没有从零开始设计数据模型，而是参考了项目早期规划的 ER 图文档 `docs/database-er.md`。我们将文档中的实体和关系，用 Prisma Schema Language (PSL) 进行了精确的翻译。

一个简化的示例如下：

```prisma
// file: backend/prisma/schema.prisma

model User {
  id        String   @id @default(cuid())
  email     String?  @unique
  nickname  String?
  // ... 其他字段

  products Product[] // 一个用户可以发布多个商品
}

model Product {
  id          String  @id @default(cuid())
  name        String
  price       Int     // 以分为单位
  // ... 其他字段

  merchant   User   @relation(fields: [merchantId], references: [id])
  merchantId String
}
```

这一定义不仅清晰地描述了表结构，还定义了模型之间的关系。

### 步骤三：使用 Docker 搭建数据库环境 (安全实践)

为了保证所有开发者环境的一致性，我们选择使用 Docker 来运行 PostgreSQL 数据库。

**最佳实践**：为了避免将数据库密码等敏感信息硬编码并提交到 Git 仓库，我们采用 `env_file` 的方式来管理配置。

首先，在 `backend` 目录下创建一个 `.env.dev` 文件，所有敏感信息都将存放在这里。

```bash
# file: backend/.env.dev

# For backend service
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@postgres:5432/wechat-shop?schema=public"

# For postgres service
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=wechat-shop
```

> **注意**: 这个文件**必须**被添加到 `.gitignore` 中，绝对不能上传到代码仓库。

然后，修改项目根目录的 `docker-compose.yml` 文件，让服务从 `.env.dev` 文件中读取配置。

```yaml
# file: docker-compose.yml

version: "3.8"
services:
  postgres:
    image: postgres:13
    env_file: # 从文件加载环境变量
      - ./backend/.env.dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    env_file: # 也从同一个文件加载
      - ./backend/.env.dev
    depends_on:
      - postgres

volumes:
  pgdata:
```

通过这种方式，`docker-compose.yml` 文件本身不包含任何秘密，可以安全地提交到版本控制中。

### 步骤四：调试并优化 `Dockerfile` (关键学习点)

这是整个过程中最耗时但最有价值的部分。我们最初使用的 `node:20-alpine` 基础镜像在构建 `nest build` 时遇到了“静默失败”的问题——构建过程不报错，但就是不生成 `dist` 目录。

经过一系列的诊断（包括检查文件权限、尝试 `pnpm cache clean`、在 Dockerfile 中添加诊断命令 `ls` 等），我们最终定位到问题根源在于 `alpine` 镜像的兼容性。

**最终的解决方案是，将基础镜像更换为 `node:20-slim`。** `slim` 镜像是基于 Debian 的，拥有更完整的标准库和更好的兼容性。

```dockerfile
# file: backend/Dockerfile

# 使用兼容性更好的 slim 镜像
FROM node:20-slim AS development

# （可选但推荐）更新基础镜像的软件包，修复潜在安全漏洞
RUN apt-get update && apt-get install -y --no-install-recommends openssl

# ... 后续的安装和构建步骤 ...

# 生产环境也使用 slim 镜像
FROM node:20-slim AS production
# ...
```

这个经验告诉我们，在追求镜像体积小的同时，绝不能牺牲构建的稳定性和兼容性。对于复杂的 Node.js 项目，`slim` 镜像是比 `alpine` 更稳妥的选择。

### 步骤五：执行数据库迁移

在 `Dockerfile` 和 `docker-compose.yml` 都配置妥当后，我们启动服务并执行迁移。

```bash
# 启动所有服务 (包括 postgres 和 backend)
docker-compose up -d --build

# 在正在运行的 backend 容器内执行 prisma migrate
docker-compose exec backend npx prisma migrate dev --name init

```

执行成功后，Prisma 会在 `backend/prisma/migrations` 目录下创建 SQL 文件，并在数据库中创建所有表。

#### docker 命令用法

```bash
# Start an interactive shell
docker-compose exec backend bash

# Inside the container, navigate to node_modules
cd node_modules

# List contents
ls

# Exit the shell when done
exit
```

```bash
# docker里面执行命令行示例
docker-compose exec backend bash -c "cd node_modules && ls"
docker-compose exec backend bash -c "pwd && ls"
```

### 步骤六：填充初始数据 (Seeding)

一个空的数据库不利于开发和测试。我们创建了 `backend/prisma/seed.ts` 文件来填充一些初始数据。

```typescript
// file: backend/prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ... 创建用户和商品的代码 ...
}

main();
// ...
```

为了运行这个脚本，我们在 `package.json` 中添加了相应的命令，并最终确定了在**本地环境**运行此脚本是最直接可靠的方式（避免了在 Docker exec 环境中复杂的 `ts-node` 路径问题）。

```json
// file: backend/package.json
{
  "scripts": {
    "prisma:seed": "prisma generate && ts-node prisma/seed.ts"
  }
}
```

**运行命令**:

```bash
# 确保本地安装了依赖
pnpm install

# 确保 Docker 容器正在运行 (因为 seed 脚本需要连接数据库)
docker-compose up -d

# 在本地执行 seed 脚本
pnpm prisma:seed
```

这里的关键是，`seed` 命令中包含了 `prisma generate`，它会确保 `PrismaClient` 客户端在运行前被正确生成，从而避免了类型导入错误。

## 5. 在 NestJS 中使用 Prisma (核心)

前面的步骤完成了数据库的“搭建”，但更关键的是如何在我们的 NestJS 应用代码中“使用”它。下面我们将演示在 NestJS 中集成并使用 Prisma 的最佳实践。

### 步骤一：创建可注入的 `PrismaService`

为了能在整个应用中方便地使用 Prisma Client，并遵循 NestJS 的依赖注入原则，我们不应该在每个服务中都去 `new PrismaClient()`。最佳实践是创建一个专门的 `PrismaService`。

我们创建 `backend/src/prisma.service.ts` 文件：

```typescript
// file: backend/src/prisma.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

这个服务继承了 `PrismaClient`，并利用 NestJS 的生命周期钩子 `onModuleInit` 来确保在应用启动时自动连接数据库。

### 步骤二：在主模块中注册 `PrismaService`

服务创建好后，需要将其注册到模块中才能被注入。我们将其注册在根模块 `AppModule` 中，使其成为一个全局可用的服务。

```typescript
// file: backend/src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma.service"; // 1. 导入

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev",
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService], // 2. 注册为 Provider
})
export class AppModule {}
```

### 步骤三：在业务逻辑中使用 `PrismaService`

现在，我们可以在任何需要操作数据库的业务服务（Service）中，通过构造函数注入 `PrismaService`。下面我们将改造默认的 `AppService`，让它实现查询所有用户的功能。

```typescript
// file: backend/src/app.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service"; // 1. 导入服务
import { User } from "@prisma/client"; // 2. 导入 Prisma 生成的类型

@Injectable()
export class AppService {
  // 3. 通过构造函数注入
  constructor(private readonly prisma: PrismaService) {}

  // 4. 编写业务方法
  async getUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
```

`@prisma/client` 生成的 `User` 类型为我们的代码提供了端到端的类型安全。

### 步骤四：在控制器中暴露 API

最后，我们修改 `AppController`，添加一个 `/users` 的 API 端点，调用 `AppService` 中的方法，并将结果返回给客户端。

```typescript
// file: backend/src/app.controller.ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { User } from "@prisma/client";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("users")
  async getUsers(): Promise<User[]> {
    return this.appService.getUsers();
  }
}
```

至此，我们完成了一个完整的从 API 请求到数据库查询的链路。

## 6. 如何测试 API (数据流转解析)

我们已经成功创建了 `/users` API，但由于后端服务运行在 Docker 容器中，我们该如何从本地的 Windows 系统访问并测试它呢？答案是利用 Docker 的 **端口映射 (Port Mapping)**。

### 端口映射原理

在项目根目录的 `docker-compose.yml` 文件中，我们为 `backend` 服务配置了端口映射：

```yaml
# file: docker-compose.yml
services:
  # ...
  backend:
    # ...
    ports:
      - "3001:3001" # 将主机的 3001 端口映射到容器的 3001 端口
    # ...
```

这意味着，任何发送到你 Windows 主机 `localhost:3001` 的请求，都会被 Docker 自动转发到 `backend` 容器内部的 3001 端口，而我们的 NestJS 应用正在那里监听请求。

### 数据持久化机制

关于数据存储的位置，这是一个重要的架构细节：

1. **数据库文件存储**：

   ```yaml
   # file: docker-compose.yml
   services:
     postgres:
       volumes:
         - pgdata:/var/lib/postgresql/data # 关键配置

   volumes:
     pgdata: # Docker volume 的定义
   ```

   - 数据库文件实际上存储在 Docker Volume 中，这是 Docker 管理的一个特殊存储区域
   - 在 Windows 上，这个 volume 位于 Docker Desktop 的 WSL（Windows Subsystem for Linux）环境中
   - 即使容器被删除，只要不删除这个 volume，数据就会被保留
   - 可以通过 `docker volume ls` 查看所有 volumes
   - 可以通过 `docker volume inspect pgdata` 查看 volume 详情

2. **数据持久性**：

   - 容器重启：✅ 数据保留
   - Docker Desktop 重启：✅ 数据保留
   - Windows 重启：✅ 数据保留
   - 删除容器：✅ 数据保留
   - 删除 volume：❌ 数据丢失

3. **开发建议**：
   - 在开发过程中，保持 Docker volume 不被删除，这样你的测试数据会一直保留
   - 如果需要清理数据重新开始，可以使用 `docker-compose down -v` 命令（这会删除 volumes）
   - 建议定期备份重要的测试数据（可以使用 `pg_dump` 工具）

这种设计确保了数据的持久性和可移植性，你不需要在 Windows 本地安装 PostgreSQL，所有的数据管理都由 Docker 负责。

### 数据库迁移管理

在 `backend/prisma/migrations` 目录下，你会看到类似 `20250711145155_init` 这样的文件夹，这些是 Prisma 的数据库迁移文件，它们扮演着数据库版本控制的角色。

1. **迁移文件的组成**：

   ```
   backend/prisma/migrations/
   ├── 20250711145155_init/      # 迁移版本目录
   │   └── migration.sql         # 具体的 SQL 迁移脚本
   └── migration_lock.toml       # 迁移锁定文件
   ```

2. **命名规则解析**：

   - `20250711145155`: 时间戳（年月日时分秒）
   - `init`: 迁移的描述性名称

3. **迁移文件的作用**：

   - 记录数据库结构的变更历史
   - 确保所有开发环境的数据库结构一致
   - 支持数据库的版本回滚
   - 作为数据库结构的文档

4. **如何生成迁移文件**：

   ```bash
   # 当你修改了 schema.prisma 文件后
   npx prisma migrate dev --name init
   ```

   这个命令会：

   - 分析 `schema.prisma` 的变更
   - 生成新的迁移文件
   - 自动应用迁移到数据库

5. **迁移文件内容示例**：

   ```sql
   -- CreateEnum
   CREATE TYPE "UserRole" AS ENUM ('BUYER', 'MERCHANT', 'ADMIN');

   -- CreateTable
   CREATE TABLE "User" (
     "id" TEXT NOT NULL,
     "nickname" TEXT,
     -- ... 其他字段
     CONSTRAINT "User_pkey" PRIMARY KEY ("id")
   );
   ```

   这些 SQL 语句定义了数据库的具体结构，包括：

   - 枚举类型的创建
   - 表的创建
   - 字段定义
   - 约束设置
   - 索引创建

6. **最佳实践**：

   - 将迁移文件提交到版本控制系统
   - 每次修改数据模型后及时创建迁移
   - 在应用新迁移前备份数据库
   - 在开发环境充分测试迁移脚本

7. **注意事项**：
   - 生产环境使用 `prisma migrate deploy` 而不是 `migrate dev`
   - 避免手动修改迁移文件
   - 如果迁移出错，可以使用 `prisma migrate reset` 重置数据库（⚠️ 会清空数据）

### 测试方法

基于此原理，你可以通过以下任一方式进行测试：

1.  **使用浏览器**：直接在浏览器地址栏输入 `http://localhost:3001/users` 并访问。
2.  **使用 cURL**：在终端中执行命令 `curl http://localhost:3001/users`。

如果一切正常，你应该能看到一个包含用户数据的 JSON 数组或一个空数组 `[]`。

### 数据流全景图

为了让你更直观地理解整个请求的生命周期，下面这张图清晰地展示了从你在 Windows 上发起请求，到 Docker 容器内部处理，再到数据库交互，最后返回响应的全过程。

```mermaid
graph TD
    subgraph "你的 Windows 电脑"
        Client["浏览器 或 cURL 终端"]
    end

    subgraph "Docker 环境"
        DockerNetwork["Docker 网络 (localhost)"]

        subgraph "Backend 容器"
            NestApp["NestJS 应用<br>监听 3001 端口"]
            Controller["AppController<br>@Get('/users')"]
            Service["AppService<br>getUsers()"]
            PrismaService["PrismaService"]
        end

        subgraph "Postgres 容器"
            Database["PostgreSQL 数据库"]
        end
    end

    Client -- "1 HTTP GET 请求<br>http://localhost:3001/users" --> DockerNetwork
    DockerNetwork -- "2 端口映射<br>Host(3001) -> Container(3001)" --> NestApp
    NestApp --> Controller
    Controller -- "3 调用 appService.getUsers()" --> Service
    Service -- "4 调用 prisma.user.findMany()" --> PrismaService
    PrismaService -- "5 生成 SQL 查询<br>SELECT * FROM User" --> Database
    Database -- "6 返回查询结果" --> PrismaService
    PrismaService -- "7 返回用户数据" --> Service
    Service -- "8 返回用户数据" --> Controller
    Controller -- "9 封装成 HTTP 响应" --> NestApp
    NestApp --> DockerNetwork
    DockerNetwork -- "10 返回 JSON 响应给客户端" --> Client
```

## 7. 总结

通过以上步骤，我们为后端项目成功搭建了一个健壮、类型安全且易于维护的数据库环境，并演示了如何在 NestJS 应用中以最佳实践的方式使用它。整个过程虽然充满挑战，但也让我们对 Docker 构建、Prisma 工作流以及 NestJS 依赖注入有了更深刻的理解。这些经验将成为我们项目宝贵的知识财富。
