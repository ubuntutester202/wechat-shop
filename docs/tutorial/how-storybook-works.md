# Storybook 组件开发与文档系统教程

## 📋 目录

1. [什么是 Storybook？](#什么是-storybook)
2. [为什么要使用 Storybook？](#为什么要使用-storybook)
3. [项目中的 Storybook 配置](#项目中的-storybook-配置)
4. [如何运行 Storybook](#如何运行-storybook)
5. [如何为组件编写 Story](#如何为组件编写-story)
6. [实战：为 ProductCard 创建 Story](#实战为-productcard-创建-story)
7. [高级功能介绍](#高级功能介绍)
8. [常见问题与解决方案](#常见问题与解决方案)

---

## 什么是 Storybook？

**Storybook** 是一个开源的前端工具，专门用于**独立开发和展示 UI 组件**。它为你的组件创建了一个"展示厅"，让你可以：

- 🧩 **独立开发组件**：脱离完整应用环境，专注于单个组件的开发
- 📚 **组件文档化**：自动生成组件的使用文档和 API 说明  
- 🎭 **展示组件状态**：展示组件在不同参数下的各种表现形态
- 🧪 **可视化测试**：直观地测试组件在各种情况下的表现

### 形象比喻

想象 Storybook 就像是一个"组件博物馆"：
- 每个组件都有自己的"展示柜"（Story）
- 访客可以调整"参数"来观察组件的不同形态  
- 每个展示柜都有详细的"说明牌"（文档）
- 策展人可以轻松添加新的展品（新组件）

---

## 为什么要使用 Storybook？

### 🚀 开发效率提升

**传统开发方式的痛点：**
```
修改按钮样式 → 启动整个应用 → 导航到使用按钮的页面 → 查看效果 → 重复...
```

**使用 Storybook：**
```
修改按钮样式 → 直接在 Storybook 中查看 → 实时反馈 → 完成！
```

### 📖 团队协作优化

- **设计师**：可以直接查看组件库，无需等待完整页面开发
- **前端开发**：可以专注于组件逻辑，而不被页面复杂性干扰
- **产品经理**：可以直观了解可用组件，避免重复设计
- **测试人员**：可以快速验证组件在各种状态下的表现

### 🔧 代码质量保障

- **强制组件解耦**：组件必须独立工作，促进更好的设计
- **边界情况测试**：轻松测试空数据、错误状态等边界情况
- **回归测试**：修改代码后可以快速验证是否影响了其他组件

---

## 项目中的 Storybook 配置

初始化完成后，你的项目中新增了以下重要文件：

```
your-project/
├── .storybook/              # Storybook 配置目录
│   ├── main.ts             # 主配置文件
│   ├── preview.ts          # 预览配置（全局样式、参数等）
│   └── vitest.setup.ts     # 测试配置
├── src/
│   └── stories/            # 示例 Story 文件
└── package.json            # 新增了 storybook 相关脚本
```

### 配置文件详解

#### `.storybook/main.ts` - 主配置文件
```typescript
const config: StorybookConfig = {
  // 告诉 Storybook 在哪里找 Story 文件
  "stories": [
    "../src/**/*.mdx",                          // MDX 格式的文档
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"  // Story 文件
  ],
  
  // 插件配置
  "addons": [
    "@chromatic-com/storybook",    // 视觉测试
    "@storybook/addon-docs",       // 自动文档生成
    "@storybook/addon-onboarding", // 新手引导
    "@storybook/addon-a11y",       // 无障碍性检查
    "@storybook/addon-vitest"      // 测试集成
  ],
  
  // 框架配置（使用 React + Vite）
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  }
};
```

#### `.storybook/preview.ts` - 预览配置
```typescript
const preview: Preview = {
  parameters: {
    // 控件配置（用于 Storybook 的交互面板）
    controls: {
      matchers: {
        color: /(background|color)$/i,  // 颜色选择器
        date: /Date$/i,                 // 日期选择器
      },
    },
    
    // 无障碍性检查配置
    a11y: {
      test: 'todo'  // 在 UI 中显示 a11y 问题，但不使 CI 失败
    }
  },
};
```

---

## 如何运行 Storybook

### 启动开发服务器

```bash
# 启动 Storybook 开发服务器（默认端口 6006）
pnpm run storybook

# 或者使用 npm
npm run storybook
```

成功启动后，访问 `http://localhost:6006` 就能看到 Storybook 界面。

### 构建静态版本

```bash
# 构建 Storybook 静态文件（用于部署）
pnpm run build-storybook

# 构建后的文件在 storybook-static/ 目录
```

### Storybook 界面导览

```
┌─────────────────────────────────────────────────────────────────┐
│ 🏠 Storybook                                          [ 🔧 ⚙️ ] │
├─────────────────┬───────────────────────────────────────────────┤
│ 📁 Stories      │ 🎭 Component Preview                          │
│   📄 Example    │                                               │
│     📄 Button   │     [Your Component Here]                     │
│       ▶️ Primary │                                               │
│       ▶️ Large   │                                               │
│   📄 UI         │                                               │
│     📄 ProductCard│                                              │
├─────────────────┼───────────────────────────────────────────────┤
│                 │ 🎛️ Controls Panel                             │
│                 │   variant: [primary v]                       │
│                 │   size: [medium v]                           │
│                 │   disabled: [ ] checkbox                     │
└─────────────────┴───────────────────────────────────────────────┘
```

---

## 如何为组件编写 Story

### Story 文件的基本结构

一个 Story 文件通常包含以下部分：

```typescript
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

// 1. Meta 配置 - 组件的基本信息
const meta = {
  title: 'UI/Button',          // 在 Storybook 中的路径
  component: Button,           // 要展示的组件
  parameters: {
    layout: 'centered',        // 布局方式
  },
  tags: ['autodocs'],          // 自动生成文档
  argTypes: {                  // 参数类型配置
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline']
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 2. Story 定义 - 组件的不同状态
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary', 
    children: 'Secondary Button',
  },
};
```

### 命名规范

- **文件命名**：`ComponentName.stories.ts`
- **Story 命名**：使用 PascalCase，描述组件的状态或用途
  - ✅ `Primary`, `Secondary`, `Large`, `WithIcon`
  - ❌ `story1`, `test`, `demo`

---

## 实战：为 ProductCard 创建 Story

现在让我们为项目中的 `ProductCard` 组件创建一个完整的 Story 文件。

### 第一步：创建 Story 文件

创建 `src/components/ui/ProductCard.stories.ts`：

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import ProductCard from './ProductCard';
import { Product } from '../../assets/data/mock/products';

// 模拟数据
const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15 Pro Max 256GB 深空黑色',
  price: 999.99,
  originalPrice: 1199.99,
  image: 'https://picsum.photos/300/200?random=1',
  category: 'Electronics',
  tags: ['New'],
  rating: 4.8,
  reviews: 1234,
  description: '最新 iPhone 15 Pro Max，搭载 A17 Pro 芯片'
};

const meta = {
  title: 'UI/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '商品卡片组件，用于展示商品基本信息，支持点击交互和价格显示控制。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    showPrice: {
      control: { type: 'boolean' },
      description: '是否显示价格信息',
    },
    onClick: { 
      action: 'clicked',
      description: '点击时的回调函数' 
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础展示
export const Default: Story = {
  args: {
    product: mockProduct,
    showPrice: true,
  },
};

// 隐藏价格
export const WithoutPrice: Story = {
  args: {
    product: mockProduct,
    showPrice: false,
  },
};

// 促销商品（有原价）
export const OnSale: Story = {
  args: {
    product: {
      ...mockProduct,
      price: 799.99,
      originalPrice: 999.99,
      tags: ['Sale']
    },
  },
};

// 新品
export const NewProduct: Story = {
  args: {
    product: {
      ...mockProduct,
      tags: ['New'],
      reviews: 0,
    },
  },
};

// 热门商品
export const HotProduct: Story = {
  args: {
    product: {
      ...mockProduct,
      tags: ['Hot'],
      rating: 4.9,
      reviews: 5678,
    },
  },
};

// 图片加载失败的情况
export const ImageError: Story = {
  args: {
    product: {
      ...mockProduct,
      image: 'https://broken-image-url.jpg',
    },
  },
};

// 长标题测试
export const LongTitle: Story = {
  args: {
    product: {
      ...mockProduct,
      name: '这是一个非常非常长的商品标题，用来测试文本截断和布局是否正常工作，看看会不会影响卡片的整体美观性',
    },
  },
};
```

### 第二步：实际创建 ProductCard.stories.ts

让我们真正为你的项目创建这个文件。运行以下命令：

```bash
# 在 src/components/ui/ 目录下创建 ProductCard.stories.ts
```

### 第三步：验证 Story 效果

1. 启动 Storybook：`pnpm run storybook`
2. 在侧边栏中找到 `UI > ProductCard`
3. 点击不同的 Story 查看效果：
   - `Default` - 基础显示
   - `OnSale` - 促销商品
   - `ImageError` - 图片失败时的占位符
   - `LongTitle` - 长标题的文本截断

### 第四步：使用 Controls 面板

在 Storybook 底部的 Controls 面板中，你可以：
- 切换 `showPrice` 的开关
- 修改 `product.name` 来测试不同标题
- 观察 `onClick` 的触发（在 Actions 面板中）

---

## 高级功能介绍

### 1. 自动文档生成

Storybook 会根据你的组件和 Story 自动生成文档：

```typescript
// 在 meta 配置中添加文档描述
const meta = {
  title: 'UI/ProductCard',
  component: ProductCard,
  parameters: {
    docs: {
      description: {
        component: `
          # ProductCard 组件
          
          用于展示商品信息的卡片组件，包含以下特性：
          - 🖼️ 图片显示与错误处理
          - 💰 价格展示（支持原价/现价）
          - ⭐ 评分显示
          - 🏷️ 标签分类（New/Sale/Hot）
          - 📱 响应式设计
        `
      }
    }
  },
  tags: ['autodocs'],
}
```

### 2. 无障碍性检查

项目已配置 `@storybook/addon-a11y`，它会自动检查：
- 颜色对比度
- 键盘导航
- 屏幕阅读器兼容性
- ARIA 标签

在 Storybook 中查看 `Accessibility` 面板获取检查结果。

### 3. 视觉回归测试

使用 `@storybook/addon-vitest` 进行组件测试：

```bash
# 运行 Storybook 测试
npx vitest --project=storybook

# 或者使用项目配置的脚本
pnpm run test:unit
```

### 4. 多个 Story 组合

创建复杂的展示场景：

```typescript
// 在一个 Story 中展示多个组件状态
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <ProductCard product={mockProduct} />
      <ProductCard product={{...mockProduct, tags: ['Sale']}} />
      <ProductCard product={{...mockProduct, tags: ['Hot']}} />
      <ProductCard product={{...mockProduct, showPrice: false}} />
    </div>
  ),
};
```

### 5. 交互测试

测试用户交互行为：

```typescript
import { expect, userEvent, within } from '@storybook/test';

export const ClickInteraction: Story = {
  args: {
    product: mockProduct,
    onClick: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('button'); // 假设卡片是可点击的
    
    await userEvent.click(card);
    await expect(canvas.getByText(mockProduct.name)).toBeInTheDocument();
  },
};
```

---

## 常见问题与解决方案

### Q1: Storybook 启动失败怎么办？

**问题现象：**
```
Error: Cannot resolve dependency 'xyz'
```

**解决方案：**
1. 检查依赖是否正确安装：`pnpm install`
2. 清除缓存：`rm -rf node_modules/.cache`
3. 重新安装 Storybook：`pnpm dlx storybook@latest init`

### Q2: 组件在 Storybook 中显示异常

**问题现象：**
- 样式丢失
- 功能无法正常工作

**解决方案：**
在 `.storybook/preview.ts` 中导入必要的样式：

```typescript
import '../src/index.css';  // 导入主样式文件

const preview: Preview = {
  parameters: {
    // ... 其他配置
  },
};
```

### Q3: TypeScript 类型错误

**问题现象：**
```
Type 'Product' is not assignable to parameter
```

**解决方案：**
确保在 Story 文件中正确导入类型：

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import ProductCard from './ProductCard';
import { Product } from '../../assets/data/mock/products';  // 正确导入类型
```

### Q4: 如何在 Storybook 中使用路由？

**解决方案：**
在 `.storybook/preview.ts` 中配置 Router：

```typescript
import { BrowserRouter } from 'react-router-dom';

const preview: Preview = {
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};
```

### Q5: 如何部署 Storybook？

**方案一：GitHub Pages**
```bash
# 构建静态文件
pnpm run build-storybook

# 推送到 gh-pages 分支
npx storybook-to-ghpages
```

**方案二：Vercel/Netlify**
1. 连接 Git 仓库
2. 设置构建命令：`pnpm run build-storybook`
3. 设置输出目录：`storybook-static`

---

## 最佳实践总结

### ✅ 推荐做法

1. **为每个可复用组件创建 Story**
2. **覆盖组件的所有主要变体和状态**
3. **使用描述性的 Story 名称**
4. **添加适当的文档说明**
5. **利用 Controls 让非技术人员也能调试组件**
6. **定期运行无障碍性检查**

### ❌ 避免的做法

1. **不要为页面级组件创建 Story**（太复杂，依赖太多）
2. **不要在 Story 中包含真实的 API 调用**
3. **不要忽视边界情况的测试**
4. **不要让 Story 文件过于复杂**

### 🎯 开发工作流建议

```
开发新组件的理想流程：
1. 设计组件 API（props 接口）
2. 创建基础 Story
3. 在 Storybook 中开发组件
4. 添加各种状态的 Story
5. 运行无障碍性检查
6. 集成到实际页面中
```

---

## 结语

Storybook 是现代前端开发中不可或缺的工具，它不仅提升了开发效率，更重要的是促进了组件化思维和团队协作。

通过这个教程，你应该已经掌握了：
- ✅ Storybook 的核心概念和价值
- ✅ 如何在项目中运行和使用 Storybook  
- ✅ 如何为组件编写完整的 Story
- ✅ 高级功能的使用方法
- ✅ 常见问题的解决方案

现在就开始为你的组件创建 Story 吧！从 `ProductCard` 开始，逐步建立起完整的组件库文档。

---

## 相关资源

- 📖 [Storybook 官方文档](https://storybook.js.org/)
- 🎬 [Storybook 最佳实践](https://storybook.js.org/docs/writing-stories/best-practices)
- 🧪 [测试集成指南](https://storybook.js.org/docs/writing-tests)
- 🎨 [设计系统案例](https://github.com/storybookjs/design-system) 