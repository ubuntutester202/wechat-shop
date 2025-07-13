# JWT 认证模块

本模块实现了完整的 JWT 认证功能，包括用户注册、登录、权限验证等。

## 功能特性

- ✅ JWT Token 签发和验证
- ✅ 用户注册和登录
- ✅ 密码加密存储 (bcrypt)
- ✅ 支持微信 OpenID 登录
- ✅ 全局认证守卫
- ✅ 公共接口标记 (@Public)
- ✅ 角色权限控制 (@Roles)
- ✅ 当前用户信息获取 (@CurrentUser)

## 使用方法

### 1. 注册用户

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "用户昵称"
}
```

### 2. 用户登录

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 3. 获取用户信息

```bash
GET /auth/profile
Authorization: Bearer <your-jwt-token>
```

## 装饰器使用

### @Public() - 公共接口

标记接口为公开访问，不需要 JWT 认证：

```typescript
@Public()
@Get('public-data')
getPublicData() {
  return { message: '这是公开数据' };
}
```

### @CurrentUser() - 获取当前用户

在控制器方法中获取当前登录用户信息：

```typescript
@Get('profile')
getProfile(@CurrentUser() user: any) {
  return { userId: user.id, email: user.email };
}
```

### @Roles() - 角色权限控制

限制接口只能被特定角色访问：

```typescript
@Roles(Role.ADMIN, Role.MERCHANT)
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin-data')
getAdminData() {
  return { message: '管理员数据' };
}
```

## 环境配置

在 `.env.docker` 文件中配置 JWT 相关参数：

```env
JWT_SECRET=dev-jwt-secret-key
JWT_EXPIRES_IN=24h
```

## 全局认证

项目已配置全局 JWT 认证守卫，所有接口默认需要认证。如需跳过认证，请使用 `@Public()` 装饰器。

## 支持的登录方式

1. **邮箱 + 密码**
2. **手机号 + 密码**
3. **微信 OpenID**（无需密码）

## 测试

运行集成测试：

```bash
npm run test:e2e
```

测试文件位置：`src/auth/auth.integration.spec.ts`