# npm test 故障排除教程

## 概述

本教程详细介绍了在 NestJS 项目中遇到 `npm test` 失败时的系统性排查和解决方法。通过实际案例分析，帮助开发者理解测试失败的常见原因和解决策略。

## 问题背景

在完成了 AuthService 和 UserService 的单元测试后，运行 `npm test` 时出现了多个测试套件失败的情况：
- 4个失败的测试套件
- 6个失败的测试用例
- 主要涉及集成测试和控制器单元测试

## 故障排查流程

### 第一步：识别测试类型和失败模式

```bash
npm test
```

通过运行完整测试套件，我们发现：
1. **单元测试通过**：AuthService 和 UserService 的单元测试正常
2. **集成测试失败**：auth.integration.spec.ts 中的测试返回 401 状态码
3. **控制器测试失败**：依赖注入相关错误

### 第二步：隔离问题范围

```bash
# 只运行单元测试
npm test -- --testPathPattern=".*\.service\.spec\.ts$"
```

确认单元测试正常后，重点关注集成测试和控制器测试的问题。

## 问题分析与解决

### 问题一：集成测试数据污染

#### 问题现象
```
expected 200 "OK", got 401 "Unauthorized"
```

#### 根本原因
集成测试中的用户登录失败，因为：
1. 测试用例之间缺乏数据隔离
2. 登录测试依赖注册测试创建的用户
3. 数据库状态不一致导致用户不存在

#### 解决方案

**1. 添加数据清理机制**
```typescript
beforeEach(async () => {
  // 清理测试数据
  await prisma.user.deleteMany({
    where: {
      email: 'test@example.com',
    },
  });
});
```

**2. 确保测试独立性**
```typescript
it('should login with valid credentials', async () => {
  // 先注册用户
  await request(app.getHttpServer())
    .post('/auth/register')
    .send(testUser);
    
  // 再进行登录测试
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      email: testUser.email,
      password: testUser.password,
    });

  expect(response.status).toBe(200);
});
```

### 问题二：控制器测试依赖注入失败

#### 问题现象
```
Nest can't resolve dependencies of the AppController (?). 
Please make sure that the argument dependency at index [0] is available
```

#### 根本原因
控制器测试模块中缺少必要的服务依赖mock配置：
1. AppController 依赖 AppService，AppService 依赖 PrismaService
2. UserController 依赖 UserService
3. AuthController 依赖 AuthService

#### 解决方案

**1. AppController 测试修复**
```typescript
beforeEach(async () => {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [AppController],
    providers: [
      AppService,
      {
        provide: PrismaService,
        useValue: {
          user: {
            findMany: jest.fn().mockResolvedValue([]),
          },
        },
      },
    ],
  }).compile();

  appController = app.get<AppController>(AppController);
  prismaService = app.get<PrismaService>(PrismaService);
});
```

**2. UserController 测试修复**
```typescript
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [UserController],
    providers: [
      {
        provide: UserService,
        useValue: {
          findById: jest.fn(),
          updateUser: jest.fn(),
        },
      },
    ],
  }).compile();

  controller = module.get<UserController>(UserController);
  userService = module.get<UserService>(UserService);
});
```

**3. AuthController 测试修复**
```typescript
beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [AuthController],
    providers: [
      {
        provide: AuthService,
        useValue: {
          register: jest.fn(),
          login: jest.fn(),
          validateUser: jest.fn(),
        },
      },
    ],
  }).compile();

  controller = module.get<AuthController>(AuthController);
  authService = module.get<AuthService>(AuthService);
});
```

## 测试策略最佳实践

### 1. 测试隔离原则
- **数据隔离**：每个测试用例都应该有独立的数据环境
- **状态隔离**：测试之间不应该有状态依赖
- **时间隔离**：避免测试执行顺序对结果的影响

### 2. 依赖管理策略
- **Mock外部依赖**：数据库、第三方服务等
- **注入必要服务**：确保控制器能正确实例化
- **模拟真实场景**：Mock的返回值应该符合实际业务逻辑

### 3. 调试技巧
- **分层测试**：先确保单元测试通过，再处理集成测试
- **日志调试**：临时添加console.log查看响应状态和数据
- **错误分析**：仔细阅读错误信息，定位具体失败原因

## 验证结果

修复完成后，运行完整测试套件：

```bash
npm test
```

**最终结果**：
- ✅ 6个测试套件全部通过
- ✅ 41个测试用例全部通过
- ✅ 测试执行时间：11.81秒

## 总结

通过系统性的故障排查，我们解决了两类主要问题：

1. **集成测试数据污染**：通过添加数据清理机制和确保测试独立性解决
2. **控制器依赖注入**：通过正确配置服务mock解决

这个过程展示了测试驱动开发中故障排查的重要性，以及如何通过分层分析快速定位和解决问题。良好的测试基础设施是项目可持续发展的重要保障。

## 相关文档

- [AuthService 单元测试教程](./how-auth-service-unit-testing-works.md)
- [UserService 单元测试教程](./how-user-service-unit-testing-works.md)
- [单元测试最佳实践](./how-unit-testing-works.md)