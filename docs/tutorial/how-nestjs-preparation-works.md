# NestJS 预研指南：Week 3 后端开发准备

## 🎯 预研目标

为 **Week 3 后端开发** 做好充分准备，确保能够顺利执行 Day 12-16 的 NestJS 开发任务。

> **时间安排**：Day 6 下午预研，Week 3 Day 12 开始实践

---

## 📚 核心预研内容

### 1. **NestJS 基础概念**

#### 什么是 NestJS？

- **渐进式 Node.js 框架**：用于构建高效、可扩展的服务端应用
- **TypeScript 优先**：天然支持 TypeScript，提供强类型安全
- **装饰器驱动**：基于装饰器的架构，类似 Angular
- **依赖注入**：内置 IoC 容器，支持依赖注入模式

#### 为什么选择 NestJS？

```typescript
// ✅ 优势对比
Angular-like 架构    → 前端开发者容易上手
TypeScript 原生支持  → 类型安全，开发效率高
模块化设计          → 代码组织清晰，便于维护
生态系统完善        → 丰富的官方模块和插件
企业级特性          → 支持微服务、GraphQL、gRPC
```

### 2. **项目初始化流程**

#### CLI 安装和使用

```bash
# 全局安装 NestJS CLI
npm i -g @nestjs/cli

# 创建新项目（Week 3 Day 12 任务）
nest new backend

# 进入项目目录
cd backend

# 启动开发服务器
npm run start:dev
```

#### 项目结构解析

```
backend/
├── src/
│   ├── app.controller.ts    # 应用控制器
│   ├── app.module.ts        # 根模块
│   ├── app.service.ts       # 应用服务
│   └── main.ts             # 应用入口文件
├── test/                    # 测试文件
├── package.json
└── tsconfig.json
```

#### 主要文件作用

```typescript
// main.ts - 应用启动文件
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 3. **核心架构概念**

#### Module（模块）- 应用的组织单元

```typescript
// 功能模块示例
@Module({
  imports: [UsersModule], // 导入其他模块
  controllers: [CatsController], // 控制器
  providers: [CatsService], // 服务提供者
  exports: [CatsService], // 导出给其他模块使用
})
export class CatsModule {}
```

#### Controller（控制器）- 处理 HTTP 请求

```typescript
@Controller("cats")
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto);
  }
}
```

#### Service（服务）- 业务逻辑处理

```typescript
@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }

  create(cat: Cat) {
    this.cats.push(cat);
  }
}
```

#### 依赖注入原理

```typescript
// 构造函数注入
@Controller("cats")
export class CatsController {
  constructor(
    private readonly catsService: CatsService, // 自动注入
    private readonly prisma: PrismaService // 数据库服务
  ) {}
}
```

### 4. **CLI 代码生成命令**

#### Week 3 将使用的关键命令

```bash
# Day 13：生成用户模块（认证相关）
nest g module user
nest g service user
nest g controller user

# Day 13：生成商品模块
nest g module product
nest g service product
nest g controller product

# Day 14：生成订单和购物车模块
nest g module order
nest g module cart

# 批量生成资源（包含 module/service/controller/dto）
nest g resource user
```

### 5. **数据库集成（Prisma）**

#### Prisma 是什么？

- **现代化 ORM**：类型安全的数据库访问层
- **Schema-first**：通过 schema 定义数据模型
- **自动生成**：自动生成 TypeScript 类型和客户端
- **迁移管理**：版本化的数据库迁移

#### 集成步骤（Day 12 下午任务）

```bash
# 1. 安装 Prisma
pnpm add -D prisma
pnpm add @prisma/client

# 2. 初始化 Prisma
npx prisma init

# 3. 定义数据模型
# 编辑 prisma/schema.prisma

# 4. 生成迁移
npx prisma migrate dev --name init

# 5. 生成客户端
npx prisma generate
```

#### PrismaService 集成

```typescript
// prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

// 在模块中使用
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 6. **开发工具链配置**

#### ESLint + Prettier 配置（Day 12 上午任务）

```json
// .eslintrc.js
{
  "extends": ["@nestjs", "prettier"],
  "rules": {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
```

#### Jest 测试配置

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

### 7. **环境配置管理**

#### 多环境配置（Day 12 上午任务）

```bash
# 环境文件结构
.env.dev        # 开发环境
.env.prod       # 生产环境
```

```typescript
// ConfigModule 使用
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || "dev"}`,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

### 8. **与前端项目集成**

#### CORS 配置

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置 CORS，允许前端访问
  app.enableCors({
    origin: "http://localhost:5173", // Vite 前端地址
    credentials: true,
  });

  await app.listen(3000);
}
```

#### API 路径设计

```typescript
// 全局路径前缀
app.setGlobalPrefix("api");

// 结果：http://localhost:3000/api/products
@Controller("products")
export class ProductsController {}
```

### 9. **认证和授权（Day 13 重点）**

#### JWT 集成准备

```bash
# 安装依赖
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm add -D @types/passport-jwt @types/bcrypt
```

#### 基本认证流程

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### 10. **微信支付集成准备（Day 14 下午）**

#### 支付 SDK 准备

```bash
# 微信支付 Node.js SDK
pnpm add @wechat-pay/node
```

#### 支付控制器结构

```typescript
@Controller("payments")
export class PaymentsController {
  @Post("wechat/create")
  async createWechatPayment(@Body() orderData: any) {
    // 创建微信支付订单
  }

  @Post("wechat/notify")
  async wechatPaymentNotify(@Body() notifyData: any) {
    // 处理微信支付回调
  }
}
```

---

## 🗓️ Week 3 具体任务映射

### Day 12：项目基础搭建

```bash
# 上午任务准备
✅ 了解 NestJS CLI 使用
✅ 理解项目结构
✅ 掌握基础配置（ESLint/Prettier/Jest）
✅ 了解环境配置管理

# 下午任务准备
✅ 理解 Prisma 基本概念
✅ 掌握数据模型定义
✅ 了解迁移管理
✅ 熟悉 PrismaService 集成
```

### Day 13：核心模块开发

```bash
# 上午任务准备
✅ 掌握 Module/Service/Controller 关系
✅ 了解依赖注入原理
✅ 理解 JWT 认证流程
✅ 熟悉测试编写

# 下午任务准备
✅ 理解 Swagger 文档集成
✅ 掌握 DTO 验证管道
✅ 了解 Prisma 查询优化
```

### Day 14：业务逻辑实现

```bash
# 核心概念准备
✅ 理解购物车状态管理
✅ 掌握订单号生成策略
✅ 了解微信支付集成流程
✅ 熟悉 E2E 测试编写
```

---

## 🔧 预研实践建议

### 1. **动手实践**

```bash
# 创建练习项目
nest new nestjs-practice
cd nestjs-practice

# 生成一个完整的资源
nest g resource cats

# 启动项目体验
npm run start:dev
```

### 2. **官方文档重点**

- [First Steps](https://docs.nestjs.com/first-steps) - 入门必读
- [Controllers](https://docs.nestjs.com/controllers) - 控制器详解
- [Providers](https://docs.nestjs.com/providers) - 服务和依赖注入
- [Modules](https://docs.nestjs.com/modules) - 模块化架构

### 3. **视频学习资源**

- NestJS 官方 YouTube 频道
- 《NestJS 零基础到实战》系列教程

---

## ✅ 预研检查清单

完成预研后，你应该能够回答：

### 基础概念

- [ ] NestJS 与 Express 的区别是什么？
- [ ] 什么是装饰器，如何使用？
- [ ] Module/Controller/Service 各自的职责？
- [ ] 依赖注入是如何工作的？

### 实践操作

- [ ] 如何创建新的 NestJS 项目？
- [ ] 如何生成 module/service/controller？
- [ ] 如何配置数据库连接？
- [ ] 如何编写简单的 API 端点？

### 高级特性

- [ ] 如何实现 JWT 认证？
- [ ] 如何集成 Swagger 文档？
- [ ] 如何编写单元测试和 E2E 测试？
- [ ] 如何处理错误和异常？

---

## 🚀 开始 Week 3 的信心指标

完成此预研后，你对 Week 3 的信心应该是：

- **😤 充满信心**：掌握了 80% 以上的概念
- **😊 基本准备**：了解了主要概念，能够按文档操作
- **😐 需要加强**：建议延长预研时间，多实践练习

**目标**：达到"基本准备"级别即可开始 Week 3 开发！

---

> **💡 预研提示**
>
> 1. **不需要深入**：预研阶段重点是概念理解，不需要完全掌握
> 2. **边做边学**：Week 3 开始后会有大量实践机会
> 3. **参考现有项目**：可以看看 GitHub 上的 NestJS 项目案例
> 4. **保持文档**：把遇到的问题和解决方案记录下来

祝你 Week 3 后端开发顺利！🎉
