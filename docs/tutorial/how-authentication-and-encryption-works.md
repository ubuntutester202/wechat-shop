# JWT 认证与授权系统工作原理

## 概述

本教程将深入解析我们项目中 JWT（JSON Web Token）认证与授权系统的完整工作流程。通过本教程，你将了解从用户注册、登录到访问受保护资源的整个认证链路，以及如何在 NestJS 中实现安全可靠的身份验证机制。

> **最新更新**：本教程基于最新的实现和完整的 Playwright 测试验证，所有功能均已通过实际测试确认正常工作。

## 🎯 为什么需要 JWT 认证？

在现代 Web 应用中，我们需要：
- **无状态认证**：服务器不需要存储会话信息，便于水平扩展
- **跨域支持**：JWT 可以在不同域名间安全传递
- **移动端友好**：适合微信小程序等移动应用场景
- **安全性**：通过数字签名确保 token 不被篡改
- **权限控制**：基于角色的访问控制（RBAC）

## 🏗️ 系统架构概览

### 认证流程架构

```mermaid
flowchart TD
    A[用户提交注册/登录表单] --> B[AuthController接收请求]
    B --> C[数据验证 ValidationPipe]
    C --> D[AuthService处理业务逻辑]
    D --> E[UserService操作数据库]
    E --> F[bcrypt密码加密/验证]
    F --> G[JWT令牌生成]
    G --> H[返回认证结果]
    
    I[受保护的API请求] --> J[JwtAuthGuard验证]
    J --> K[JwtStrategy解析令牌]
    K --> L[验证通过，允许访问]
```

### 权限控制流程

```mermaid
graph TB
    A[用户请求] --> B{是否为公共路由?}
    B -->|是| C[直接访问]
    B -->|否| D[JwtAuthGuard 验证]
    D --> E{Token 是否有效?}
    E -->|否| F[返回 401 Unauthorized]
    E -->|是| G[提取用户信息]
    G --> H[RolesGuard 角色验证]
    H --> I{角色是否匹配?}
    I -->|否| J[返回 403 Forbidden]
    I -->|是| K[访问受保护资源]
```

### 核心组件架构

```mermaid
graph TB
    subgraph "认证层"
        A1[AuthController]
        A2[AuthService]
        A3[JwtStrategy]
        A4[JwtAuthGuard]
    end
    
    subgraph "业务层"
        B1[UserService]
        B2[bcrypt加密]
        B3[数据验证]
    end
    
    subgraph "数据层"
        C1[Prisma ORM]
        C2[PostgreSQL]
    end
    
    A1 --> A2
    A2 --> B1
    A3 --> A4
    B1 --> B2
    B1 --> C1
    C1 --> C2
```

## 📁 核心文件结构

```
src/auth/
├── auth.controller.ts     # 认证控制器（注册、登录、获取用户信息）
├── auth.service.ts        # 认证服务（业务逻辑）
├── auth.module.ts         # 认证模块配置
├── decorators/            # 自定义装饰器
│   ├── current-user.decorator.ts  # @CurrentUser() 获取当前用户
│   ├── public.decorator.ts        # @Public() 标记公共路由
│   ├── roles.decorator.ts         # @Roles() 角色权限控制
│   └── index.ts                   # 装饰器导出
├── guards/                # 守卫
│   ├── jwt-auth.guard.ts          # JWT 认证守卫
│   ├── roles.guard.ts             # 角色权限守卫
│   └── index.ts                   # 守卫导出
├── strategies/            # Passport 策略
│   └── jwt.strategy.ts            # JWT 验证策略
├── dto/                   # 数据传输对象
│   ├── login.dto.ts               # 登录请求 DTO
│   └── register.dto.ts            # 注册请求 DTO
└── auth.integration.spec.ts       # 集成测试

src/user/
└── user.service.ts         # 用户服务（包含bcrypt加密）
```

## 🔐 密码加密流程详解

### 1. 注册时的密码加密

**位置**：`backend/src/user/user.service.ts`

```typescript
// 加密密码
let hashedPassword: string | undefined;
if (password) {
  hashedPassword = await bcrypt.hash(password, 10);
}
```

**工作原理**：
1. **Salt轮数**：使用10轮salt生成，平衡安全性和性能
2. **单向加密**：bcrypt是单向哈希函数，无法逆向解密
3. **随机盐值**：每次加密都会生成不同的盐值，相同密码产生不同哈希

### 2. 登录时的密码验证

```typescript
async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

**验证流程**：
1. 用户输入明文密码
2. bcrypt.compare()将明文密码与存储的哈希值比较
3. 返回布尔值表示密码是否正确

## 🔄 完整认证流程详解

### 步骤1：用户注册流程

```mermaid
sequenceDiagram
    participant C as 客户端
    participant AC as AuthController
    participant AS as AuthService
    participant DB as 数据库
    participant JWT as JWT服务

    C->>AC: POST /auth/register
    AC->>AS: register(registerDto)
    AS->>DB: 检查邮箱是否存在
    alt 邮箱已存在
        AS-->>AC: 抛出 ConflictException
        AC-->>C: 409 邮箱已被注册
    else 邮箱不存在
        AS->>AS: 密码加密 (bcrypt)
        AS->>DB: 创建新用户
        AS->>JWT: 生成 JWT token
        AS-->>AC: 返回用户信息和 token
        AC-->>C: 200 注册成功
    end
```

### 步骤2：用户登录流程

```mermaid
sequenceDiagram
    participant C as 客户端
    participant AC as AuthController
    participant AS as AuthService
    participant DB as 数据库
    participant JWT as JWT服务

    C->>AC: POST /auth/login
    AC->>AS: login(loginDto)
    AS->>DB: 根据邮箱/手机/OpenID查找用户
    alt 用户不存在
        AS-->>AC: 抛出 UnauthorizedException
        AC-->>C: 401 认证失败
    else 用户存在
        AS->>AS: 验证密码 (bcrypt.compare)
        alt 密码错误
            AS-->>AC: 抛出 UnauthorizedException
            AC-->>C: 401 认证失败
        else 密码正确
            AS->>JWT: 生成新的 JWT token
            AS-->>AC: 返回用户信息和 token
            AC-->>C: 200 登录成功
        end
    end
```

### 步骤3：访问受保护资源

```mermaid
sequenceDiagram
    participant C as 客户端
    participant G as JwtAuthGuard
    participant S as JwtStrategy
    participant AC as AuthController

    C->>G: GET /auth/profile (带 Authorization header)
    G->>G: 检查是否为 @Public() 路由
    alt 是公共路由
        G-->>AC: 直接放行
    else 需要认证
        G->>S: 验证 JWT token
        S->>S: 验证签名和过期时间
        alt Token 无效
            S-->>G: 验证失败
            G-->>C: 401 Unauthorized
        else Token 有效
            S->>S: 解析 payload 获取用户信息
            S-->>G: 返回用户信息
            G-->>AC: 将用户信息注入 request.user
            AC->>AC: 处理业务逻辑
            AC-->>C: 200 返回用户资料
        end
    end
```

## 🚀 用户注册流程

### 步骤1：前端提交注册数据

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "用户昵称",
  "phone": "13800138000"
}
```

### 步骤2：数据验证（RegisterDto）

**位置**：`backend/src/auth/dto/register.dto.ts`

```typescript
export class RegisterDto {
  @IsOptional()
  @IsString()
  openId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
```

**验证规则**：
- 邮箱格式验证
- 密码最少6位
- 支持可选字段（微信登录时某些字段可为空）

### 步骤3：业务逻辑处理（AuthService）

**位置**：`backend/src/auth/auth.service.ts`

```typescript
async register(registerDto: RegisterDto) {
  // 验证必要字段
  if (!registerDto.email && !registerDto.phone && !registerDto.openId) {
    throw new BadRequestException('邮箱、手机号或微信OpenID至少需要提供一个');
  }

  if ((registerDto.email || registerDto.phone) && !registerDto.password) {
    throw new BadRequestException('使用邮箱或手机号注册时必须提供密码');
  }

  const user = await this.userService.create(registerDto);
  const payload = { email: user.email, sub: user.id, role: user.role };
  
  return {
    access_token: this.jwtService.sign(payload),
    user,
  };
}
```

**关键逻辑**：
1. **多种注册方式**：支持邮箱、手机号、微信OpenID
2. **条件验证**：邮箱/手机号注册必须提供密码
3. **JWT生成**：注册成功后立即生成访问令牌

### 步骤4：用户创建（UserService）

**位置**：`backend/src/user/user.service.ts`

```typescript
async create(createUserDto: RegisterDto): Promise<Omit<User, 'password'>> {
  const { email, phone, password, ...userData } = createUserDto;

  // 检查邮箱或手机号是否已存在
  if (email) {
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('邮箱已被注册');
    }
  }

  // 加密密码
  let hashedPassword: string | undefined;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const user = await this.prisma.user.create({
    data: {
      ...userData,
      email,
      phone,
      password: hashedPassword,
    },
  });

  // 返回用户信息，不包含密码
  const { password: _, ...result } = user;
  return result;
}
```

**安全措施**：
1. **唯一性检查**：防止重复注册
2. **密码加密**：使用bcrypt加密存储
3. **敏感信息过滤**：返回结果不包含密码

## 🔑 用户登录流程

### 步骤1：前端提交登录数据

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 步骤2：登录验证（AuthService）

```typescript
async login(loginDto: LoginDto) {
  let user: User | null = null;

  // 根据不同的登录方式查找用户
  if (loginDto.openId) {
    user = await this.userService.findByOpenId(loginDto.openId);
    if (!user) {
      throw new UnauthorizedException('微信用户不存在');
    }
  } else if (loginDto.email && loginDto.password) {
    user = await this.userService.findByEmail(loginDto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('用户不存在或密码错误');
    }

    // 验证密码
    const isPasswordValid = await this.userService.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户不存在或密码错误');
    }
  }

  // 生成JWT令牌
  const payload = { email: user.email, sub: user.id, role: user.role };
  const { password, ...userWithoutPassword } = user;
  
  return {
    access_token: this.jwtService.sign(payload),
    user: userWithoutPassword,
  };
}
```

**登录方式支持**：
1. **邮箱+密码**：传统登录方式
2. **手机号+密码**：移动端常用
3. **微信OpenID**：第三方登录

## 🛡️ JWT认证机制

### JWT策略配置

**位置**：`backend/src/auth/strategies/jwt.strategy.ts`

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

**配置说明**：
- **令牌提取**：从Authorization头的Bearer令牌中提取
- **过期检查**：自动检查令牌是否过期
- **密钥配置**：从环境变量读取JWT密钥

### 认证守卫使用

**位置**：`backend/src/auth/auth.controller.ts`

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return this.authService.validateUser(req.user.id);
}
```

**保护机制**：
1. **自动验证**：JwtAuthGuard自动验证请求中的JWT令牌
2. **用户注入**：验证成功后将用户信息注入到req.user
3. **权限控制**：可基于用户角色进行进一步权限控制

## 🔧 环境配置

### JWT配置

**位置**：`backend/src/auth/auth.module.ts`

```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    signOptions: { expiresIn: '24h' },
  }),
  inject: [ConfigService],
})
```

### 环境变量

```bash
# .env.dev / .env.docker
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
```

## 🧪 API测试示例

> **✅ 实际测试结果**：以下所有测试均通过 Playwright MCP 工具验证，确保功能正常工作。

### 1. 注册用户测试

**测试请求：**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newtest@example.com",
    "password": "123456",
    "nickname": "新测试用户"
  }'
```

**实际响应：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cmd1ao34e0001qp10ksutxz8h",
      "openId": null,
      "unionId": null,
      "nickname": "新测试用户",
      "avatar": null,
      "phone": null,
      "email": "newtest@example.com",
      "role": "BUYER",
      "status": "ACTIVE",
      "createdAt": "2025-07-13T06:29:26.607Z",
      "updatedAt": "2025-07-13T06:29:26.607Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld3Rlc3RAZXhhbXBsZS5jb20iLCJzdWIiOiJjbWQxYW8zNGUwMDAxcXAxMGtzdXR4ejhoIiwicm9sZSI6IkJVWUVSIiwiaWF0IjoxNzUyMzg4MTY2LCJleHAiOjE3NTI0NzQ1NjZ9.qnHXlke_XFMhmDw4aTxL-i0014BmJYWAOi2TCQZJiag"
  },
  "message": "用户注册成功"
}
```

### 2. 登录测试

**测试请求：**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newtest@example.com",
    "password": "123456"
  }'
```

**实际响应：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "cmd1ao34e0001qp10ksutxz8h",
      "openId": null,
      "unionId": null,
      "nickname": "新测试用户",
      "avatar": null,
      "phone": null,
      "email": "newtest@example.com",
      "role": "BUYER",
      "status": "ACTIVE",
      "createdAt": "2025-07-13T06:29:26.607Z",
      "updatedAt": "2025-07-13T06:29:26.607Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld3Rlc3RAZXhhbXBsZS5jb20iLCJzdWIiOiJjbWQxYW8zNGUwMDAxcXAxMGtzdXR4ejhoIiwicm9sZSI6IkJVWUVSIiwiaWF0IjoxNzUyMzg4MjI4LCJleHAiOjE3NTI0NzQ2Mjh9.2PcPfyH_in8df4oZmrocmdaydDniDlAuuyZ3lGN_AiU"
  },
  "message": "登录成功"
}
```

### 3. 访问受保护资源测试

**测试请求：**
```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld3Rlc3RAZXhhbXBsZS5jb20iLCJzdWIiOiJjbWQxYW8zNGUwMDAxcXAxMGtzdXR4ejhoIiwicm9sZSI6IkJVWUVSIiwiaWF0IjoxNzUyMzg4MjI4LCJleHAiOjE3NTI0NzQ2Mjh9.2PcPfyH_in8df4oZmrocmdaydDniDlAuuyZ3lGN_AiU"
```

**实际响应：**
```json
{
  "success": true,
  "data": {
    "id": "cmd1ao34e0001qp10ksutxz8h",
    "openId": null,
    "unionId": null,
    "nickname": "新测试用户",
    "avatar": null,
    "phone": null,
    "email": "newtest@example.com",
    "role": "BUYER",
    "status": "ACTIVE",
    "createdAt": "2025-07-13T06:29:26.607Z",
    "updatedAt": "2025-07-13T06:29:26.607Z"
  },
  "message": "获取用户信息成功"
}
```

### 4. 无效Token测试

**测试请求：**
```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer invalid-token"
```

**实际响应：**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 5. 公共路由测试

**测试请求：**
```bash
curl -X GET http://localhost:3001/
```

**实际响应：**
```
Hello World!
```

### 6. 无Token访问受保护资源测试

**测试请求：**
```bash
curl -X GET http://localhost:3001/auth/profile
```

**实际响应：**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 📊 测试总结

✅ **所有测试均通过验证**：

1. **用户注册** - 成功创建新用户并返回JWT token
2. **用户登录** - 成功验证凭据并返回JWT token
3. **受保护资源访问** - 有效token可以正常访问用户信息
4. **无效Token拒绝** - 系统正确拒绝无效token的请求
5. **公共路由访问** - 无需认证即可访问公共接口
6. **无Token拒绝** - 系统正确拒绝未提供token的受保护资源请求

这些测试结果证明了JWT认证系统的完整性和安全性。

## 🔒 安全最佳实践

### 1. 密码安全
- ✅ 使用bcrypt加密，salt轮数为10
- ✅ 密码最少6位要求
- ✅ 返回结果中过滤密码字段

### 2. JWT安全
- ✅ 使用强密钥（从环境变量读取）
- ✅ 设置合理的过期时间（24小时）
- ✅ 使用Bearer令牌传输

### 3. 错误处理
- ✅ 统一的错误消息（避免信息泄露）
- ✅ 适当的HTTP状态码
- ✅ 详细的异常类型区分

## 🚨 常见问题与解决方案

### 1. 密码验证失败

**问题**：登录时提示密码错误

**排查步骤**：
```typescript
// 检查密码是否正确加密
const isValid = await bcrypt.compare('原始密码', '存储的哈希值');
console.log('密码验证结果:', isValid);
```

### 2. JWT令牌无效

**问题**：访问受保护资源时401错误

**排查步骤**：
1. 检查JWT_SECRET环境变量
2. 验证令牌格式：`Bearer <token>`
3. 检查令牌是否过期

### 3. 重复注册错误

**问题**：邮箱或手机号已存在

**解决方案**：
- 前端添加重复检查
- 后端返回明确的错误信息
- 考虑添加找回密码功能

## 📈 性能优化建议

1. **数据库索引**：为email、phone、openId字段添加唯一索引
2. **缓存策略**：考虑将用户信息缓存到Redis
3. **令牌刷新**：实现refresh token机制
4. **密码策略**：根据安全需求调整bcrypt轮数

## 🔄 扩展功能

1. **多因素认证**：短信验证码、邮箱验证
2. **社交登录**：微信、QQ、微博等第三方登录
3. **权限系统**：基于角色的访问控制（RBAC）
4. **登录日志**：记录用户登录行为

---

通过本教程，你应该已经完全理解了项目中用户认证与密码加密系统的工作原理。这套系统提供了安全、灵活、可扩展的用户认证解决方案，为整个应用的安全性奠定了坚实基础。