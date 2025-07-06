# 商品详情页面功能文档

## 概述
商品详情页面是电商应用的核心页面之一，参考淘宝的设计风格，提供完整的商品信息展示和购买功能。

## 页面路由
- **路径**: `/product/:id`
- **参数**: `id` - 商品的唯一标识符

## 主要功能特性

### 1. 商品图片展示
- 支持多图片轮播展示
- 点击下方圆点可切换图片
- 响应式设计，适配各种屏幕尺寸

### 2. 商品基本信息
- 商品名称
- 价格显示（支持原价、现价、折扣标识）
- 星级评分和评价数量
- 库存数量
- 品牌信息
- 商品标签（New、Sale、Hot）

### 3. 规格选择
- 支持多种规格类型（颜色、尺寸等）
- 动态展示可选规格选项
- 规格选择状态管理

### 4. 数量选择
- 数量增减按钮
- 库存限制检查
- 输入验证

### 5. 商品详情标签页
- **商品详情**：描述、规格参数、服务保障
- **用户评价**：用户评价列表、评分展示

### 6. 用户评价展示
- 用户头像、姓名、购买验证标识
- 评价标题、内容、图片
- 评价时间、已购买的变体信息
- 评价点赞数

### 7. 底部操作栏
- 收藏按钮（点击切换收藏状态）
- 加入购物车按钮
- 立即购买按钮

## 技术实现

### 状态管理
- 使用 React Hooks 管理组件状态
- 使用 Zustand 管理购物车状态
- 支持状态持久化（localStorage）

### 响应式设计
- 采用 Mobile-First 设计理念
- 使用 TailwindCSS 响应式工具类
- 适配移动端和桌面端

### 数据获取
- 模拟 API 调用（支持 loading 状态）
- 错误处理和边界情况处理
- 商品不存在时的友好提示

### 用户体验
- 平滑的过渡动画
- 加载状态指示器
- 操作反馈（添加到购物车提示）
- 辅助功能支持（按钮title属性）

## 数据结构

### 商品数据接口
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
  description?: string;
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  stock?: number;
  brand?: string;
  // ... 其他属性
}
```

### 购物车数据接口
```typescript
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants: { [key: string]: string };
  stock: number;
}
```

## 使用方法

### 从商品列表页面跳转
```typescript
// 在商品列表页面点击商品卡片
const handleProductClick = (productId: string) => {
  navigate(`/product/${productId}`);
};
```

### 添加到购物车
```typescript
// 调用购物车store的addItem方法
const { addItem } = useCartStore();
addItem({
  productId: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  quantity,
  selectedVariants,
  stock: product.stock || 0
});
```

## 后续扩展计划

1. **商品图片缩放功能**
   - 支持手势放大图片
   - 图片预览模式

2. **商品推荐**
   - 相关商品推荐
   - 看了又看功能

3. **社交分享**
   - 分享到社交平台
   - 生成分享海报

4. **实时库存**
   - 与后端实时同步库存
   - 库存不足提醒

5. **商品咨询**
   - 在线客服功能
   - 商品问答

## 测试用例

### 基本功能测试
- [ ] 页面正常加载
- [ ] 商品信息正确显示
- [ ] 图片轮播功能正常
- [ ] 规格选择功能正常
- [ ] 数量调整功能正常
- [ ] 加入购物车功能正常

### 边界情况测试
- [ ] 商品ID不存在时的处理
- [ ] 库存为0时的处理
- [ ] 网络错误时的处理
- [ ] 必选规格未选择时的提示

### 响应式测试
- [ ] 移动端布局正常
- [ ] 桌面端布局正常
- [ ] 不同屏幕尺寸适配正常

## 文件结构
```
src/
├── pages/
│   └── product/
│       └── ProductDetailPage.tsx     # 商品详情页面主组件
├── stores/
│   └── cartStore.ts                  # 购物车状态管理
├── assets/
│   └── data/
│       └── mock/
│           └── products.ts           # 商品和评价mock数据
└── App.tsx                           # 路由配置
```

## 相关文档
- [项目概述](./overview.md)
- [API资源设计](./api-resources.md)
- [用户流程](./user-flow.md) 