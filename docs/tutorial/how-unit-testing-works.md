# 单元测试教程

## 目录

- [概述](#概述)
- [技术栈](#技术栈)
- [测试策略](#测试策略)
- [编写指南](#编写指南)
- [最佳实践](#最佳实践)
- [覆盖率分析](#覆盖率分析)

## 概述

本项目使用 **Vitest + Testing Library** 进行单元测试，确保组件和功能的质量。

## 技术栈

- **Vitest**: 测试运行器，与 Vite 原生集成
- **@testing-library/react**: React 组件测试工具
- **@testing-library/jest-dom**: DOM 断言扩展
- **@testing-library/user-event**: 用户交互模拟

## 测试策略

### 🎯 测试金字塔原则

```
    /\     E2E测试 (少量)
   /  \    ↳ 关键业务流程
  /____\
 /      \  集成测试 (适量)
/        \ ↳ 组件间协作
/________\
单元测试 (大量)
↳ 组件、函数、工具
```

### 📊 覆盖率目标

| 类型         | 目标覆盖率 | 当前状态 |
| ------------ | ---------- | -------- |
| 组件         | 80%+       | 55.48%   |
| 工具函数     | 90%+       | 待建设   |
| Store        | 80%+       | 0%       |
| 关键业务逻辑 | 95%+       | 待建设   |

### 🔍 测试范围分工

#### ✅ 单元测试负责

- **组件渲染**：基本元素显示
- **用户交互**：点击、输入、表单提交
- **条件渲染**：不同 props 下的显示逻辑
- **错误处理**：边界情况和异常
- **纯函数**：工具函数、计算逻辑

#### ✅ E2E 测试负责

- **完整用户流程**：注册 → 登录 → 购买
- **页面跳转**：路由导航
- **API 集成**：前后端交互
- **关键业务场景**：支付、下单

## 编写指南

### 🏗️ 文件结构

```
src/
├── components/
│   └── ui/
│       ├── ProductCard.tsx
│       └── ProductCard.test.tsx  ← 测试文件
├── pages/
│   └── onboarding/
│       ├── WelcomePage.tsx
│       └── WelcomePage.test.tsx  ← 测试文件
└── utils/
    ├── helpers.ts
    └── helpers.test.ts           ← 工具函数测试
```

### 📝 测试命名规范

```typescript
describe("ComponentName", () => {
  it("应该正确渲染基本元素", () => {
    // 测试渲染
  });

  it("应该处理用户点击事件", () => {
    // 测试交互
  });

  it("应该在错误时显示fallback", () => {
    // 测试错误处理
  });
});
```

### 🎭 测试类型示例

#### 1. 组件渲染测试

```typescript
it("应该正确渲染商品基本信息", () => {
  render(<ProductCard product={mockProduct} />);

  expect(screen.getByText("测试商品")).toBeInTheDocument();
  expect(screen.getByText("$99.99")).toBeInTheDocument();
});
```

#### 2. 用户交互测试

```typescript
it("应该处理onClick事件", () => {
  const handleClick = vi.fn();
  render(<ProductCard product={mockProduct} onClick={handleClick} />);

  fireEvent.click(screen.getByRole("button"));
  expect(handleClick).toHaveBeenCalledWith("1");
});
```

#### 3. 条件渲染测试

```typescript
it("当showPrice为false时不应该显示价格", () => {
  render(<ProductCard product={mockProduct} showPrice={false} />);

  expect(screen.queryByText("$99.99")).not.toBeInTheDocument();
});
```

## 最佳实践

### ✅ 推荐做法

1. **AAA 模式**：Arrange, Act, Assert

```typescript
it("应该计算正确的折扣", () => {
  // Arrange: 准备数据
  const product = { price: 100, originalPrice: 150 };

  // Act: 执行操作
  const discount = calculateDiscount(product);

  // Assert: 验证结果
  expect(discount).toBe(33.33);
});
```

2. **Mock 外部依赖**

```typescript
// Mock API调用
vi.mock("../api/products", () => ({
  fetchProducts: vi.fn().mockResolvedValue(mockProducts),
}));

// Mock路由
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
```

3. **清理副作用**

```typescript
describe("Component", () => {
  afterEach(() => {
    cleanup(); // 清理DOM
    vi.clearAllMocks(); // 清理模拟
  });
});
```

### ❌ 避免的做法

1. **测试实现细节而非行为**

```typescript
// ❌ 不好：测试内部状态
expect(component.state.isLoading).toBe(true);

// ✅ 好：测试用户可见的行为
expect(screen.getByText("加载中...")).toBeInTheDocument();
```

2. **过度 mock**

```typescript
// ❌ 不好：mock所有依赖
vi.mock("react");
vi.mock("react-dom");

// ✅ 好：只mock必要的外部依赖
vi.mock("../api/products");
```

## 覆盖率分析

### 📈 当前覆盖情况

- **ProductCard**: 100% 覆盖（完善）
- **WelcomePage**: 100% 覆盖（完善）
- **其他组件**: 0% 覆盖（需要补充）

### 🎯 优先级建议

#### 高优先级（核心业务）

1. **cartStore.ts** - 购物车状态管理
2. **CheckoutPage** - 结账流程
3. **ProductDetailPage** - 商品详情

#### 中优先级（用户界面）

1. **ShopPage** - 商城首页
2. **CreateAccountPage** - 注册页面
3. **ProfilePage** - 用户中心

#### 低优先级（辅助功能）

1. **MessagePage** - 消息页面
2. **ProductCardSkeleton** - 骨架屏

### 📊 运行覆盖率报告

```bash
# 生成详细覆盖率报告
pnpm run test:unit:coverage

# 查看HTML报告
open coverage/index.html
```

## 常用命令

```bash
# 运行所有单元测试
pnpm run test:unit:run

# 监视模式（开发时）
pnpm run test:unit

# 覆盖率报告
pnpm run test:unit:coverage

# UI界面测试
pnpm run test:unit:ui

# 运行传统单元测试（.test.tsx 文件）
pnpm run test:unit:run

# 运行Storybook测试
pnpm run test:storybook:run

# 运行所有测试
pnpm run test:all

# 开发模式运行传统单元测试（实时监听）
pnpm run test:unit
```

## 调试技巧

### 1. 使用 debug 输出 DOM 结构

```typescript
import { render, screen } from "@testing-library/react";

it("调试测试", () => {
  render(<MyComponent />);
  screen.debug(); // 输出当前DOM结构
});
```

### 2. 查询元素的方法优先级

```typescript
// 1. 推荐：语义化查询
screen.getByRole("button", { name: "提交" });
screen.getByLabelText("用户名");

// 2. 备选：文本查询
screen.getByText("登录");

// 3. 最后：测试ID（仅在必要时）
screen.getByTestId("login-form");
```

### 3. 异步操作测试

```typescript
it("应该加载并显示数据", async () => {
  render(<AsyncComponent />);

  // 等待异步操作完成
  await waitFor(() => {
    expect(screen.getByText("数据已加载")).toBeInTheDocument();
  });
});
```
