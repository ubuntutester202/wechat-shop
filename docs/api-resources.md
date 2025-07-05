# API 资源草表

## 概述
本文档定义了微信电商系统的API资源结构，包括数据实体和RESTful端点设计。

## 数据实体 (Entity)

### 1. 用户相关

#### User (用户)
```typescript
interface User {
  id: string;
  openId: string;        // 微信OpenID
  unionId?: string;      // 微信UnionID
  nickname: string;      // 微信昵称
  avatar: string;        // 头像URL
  phone?: string;        // 手机号
  email?: string;        // 邮箱
  role: 'BUYER' | 'MERCHANT' | 'ADMIN';  // 用户角色
  status: 'ACTIVE' | 'DISABLED';
  createdAt: Date;
  updatedAt: Date;
}
```

#### Address (地址)
```typescript
interface Address {
  id: string;
  userId: string;
  receiverName: string;  // 收件人姓名
  receiverPhone: string; // 收件人电话
  province: string;      // 省份
  city: string;          // 城市
  district: string;      // 区县
  detail: string;        // 详细地址
  postalCode?: string;   // 邮政编码
  isDefault: boolean;    // 是否默认地址
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. 商品相关

#### Product (商品)
```typescript
interface Product {
  id: string;
  merchantId: string;    // 商家ID
  name: string;          // 商品名称
  description: string;   // 商品描述
  price: number;         // 价格(分)
  originalPrice?: number; // 原价(分)
  stock: number;         // 库存
  images: string[];      // 商品图片数组
  category: string;      // 分类
  tags: string[];        // 标签
  status: 'DRAFT' | 'PUBLISHED' | 'SOLD_OUT' | 'ARCHIVED';
  salesCount: number;    // 销量
  rating: number;        // 评分
  createdAt: Date;
  updatedAt: Date;
}
```

#### ProductSpec (商品规格)
```typescript
interface ProductSpec {
  id: string;
  productId: string;
  name: string;          // 规格名称 (如: 颜色、尺寸)
  value: string;         // 规格值 (如: 红色、XL)
  priceAdjustment: number; // 价格调整(分)
  stock: number;         // 该规格库存
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. 购物车相关

#### CartItem (购物车项)
```typescript
interface CartItem {
  id: string;
  userId: string;
  productId: string;
  specId?: string;       // 规格ID
  quantity: number;      // 数量
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. 订单相关

#### Order (订单)
```typescript
interface Order {
  id: string;
  orderNo: string;       // 订单号
  userId: string;        // 买家ID
  merchantId: string;    // 商家ID
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  totalAmount: number;   // 总金额(分)
  discountAmount: number; // 折扣金额(分)
  shippingAmount: number; // 运费(分)
  paymentAmount: number; // 实付金额(分)
  paymentMethod: 'WECHAT';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  shippingAddress: Address; // 收货地址快照
  remark?: string;       // 订单备注
  createdAt: Date;
  updatedAt: Date;
}
```

#### OrderItem (订单项)
```typescript
interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productSnapshot: Product; // 商品快照
  specId?: string;
  specSnapshot?: ProductSpec; // 规格快照
  quantity: number;
  unitPrice: number;     // 单价(分)
  totalPrice: number;    // 小计(分)
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. 支付相关

#### Payment (支付记录)
```typescript
interface Payment {
  id: string;
  orderId: string;
  paymentNo: string;     // 支付单号
  provider: 'WECHAT';
  providerOrderId: string; // 第三方订单号
  amount: number;        // 支付金额(分)
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paidAt?: Date;         // 支付时间
  createdAt: Date;
  updatedAt: Date;
}
```

### 6. 优惠券相关

#### Coupon (优惠券模板)
```typescript
interface Coupon {
  id: string;
  merchantId: string;
  name: string;          // 优惠券名称
  type: 'FIXED' | 'PERCENTAGE'; // 固定金额 | 百分比
  value: number;         // 优惠值
  minAmount: number;     // 最小使用金额(分)
  maxDiscount?: number;  // 最大折扣金额(分)
  totalQuantity: number; // 总发行量
  usedQuantity: number;  // 已使用量
  startDate: Date;       // 有效期开始
  endDate: Date;         // 有效期结束
  status: 'ACTIVE' | 'DISABLED';
  createdAt: Date;
  updatedAt: Date;
}
```

#### UserCoupon (用户优惠券)
```typescript
interface UserCoupon {
  id: string;
  userId: string;
  couponId: string;
  status: 'UNUSED' | 'USED' | 'EXPIRED';
  usedAt?: Date;
  orderId?: string;      // 使用的订单ID
  obtainedAt: Date;      // 获得时间
  expiredAt: Date;       // 过期时间
}
```

### 7. 其他功能

#### Favorite (收藏)
```typescript
interface Favorite {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}
```

#### BrowseRecord (浏览记录)
```typescript
interface BrowseRecord {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## RESTful API 端点设计

### 1. 用户管理 `/api/users`

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/wechat-login` | 微信授权登录 |
| GET | `/api/users/profile` | 获取用户信息 |
| PUT | `/api/users/profile` | 更新用户信息 |
| GET | `/api/users/addresses` | 获取地址列表 |
| POST | `/api/users/addresses` | 创建地址 |
| PUT | `/api/users/addresses/:id` | 更新地址 |
| DELETE | `/api/users/addresses/:id` | 删除地址 |
| PUT | `/api/users/addresses/:id/default` | 设为默认地址 |

### 2. 商品管理 `/api/products`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/products` | 获取商品列表 |
| GET | `/api/products/:id` | 获取商品详情 |
| POST | `/api/products` | 创建商品 (商家) |
| PUT | `/api/products/:id` | 更新商品 (商家) |
| DELETE | `/api/products/:id` | 删除商品 (商家) |
| GET | `/api/products/categories` | 获取分类列表 |
| GET | `/api/products/search` | 搜索商品 |

### 3. 购物车 `/api/cart`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/cart` | 获取购物车 |
| POST | `/api/cart/items` | 添加商品到购物车 |
| PUT | `/api/cart/items/:id` | 更新购物车项 |
| DELETE | `/api/cart/items/:id` | 删除购物车项 |
| DELETE | `/api/cart/clear` | 清空购物车 |

### 4. 订单管理 `/api/orders`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/orders` | 获取订单列表 |
| GET | `/api/orders/:id` | 获取订单详情 |
| POST | `/api/orders` | 创建订单 |
| PUT | `/api/orders/:id/cancel` | 取消订单 |
| PUT | `/api/orders/:id/confirm` | 确认收货 |
| POST | `/api/orders/:id/refund` | 申请退款 |

### 5. 支付 `/api/payments`

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/payments/wechat/create` | 创建微信支付 |
| POST | `/api/payments/wechat/notify` | 微信支付回调 |
| GET | `/api/payments/:id/status` | 查询支付状态 |

### 6. 优惠券 `/api/coupons`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/coupons` | 获取可领取优惠券 |
| POST | `/api/coupons/:id/claim` | 领取优惠券 |
| GET | `/api/users/coupons` | 获取我的优惠券 |
| POST | `/api/coupons/validate` | 验证优惠券可用性 |

### 7. 收藏 `/api/favorites`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/favorites` | 获取收藏列表 |
| POST | `/api/favorites` | 添加收藏 |
| DELETE | `/api/favorites/:id` | 取消收藏 |

### 8. 浏览记录 `/api/browse-records`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/browse-records` | 获取浏览记录 |
| POST | `/api/browse-records` | 记录浏览 |
| DELETE | `/api/browse-records` | 清空浏览记录 |

### 9. 商家管理 `/api/merchant` (商家权限)

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/merchant/dashboard` | 商家仪表板 |
| GET | `/api/merchant/orders` | 商家订单管理 |
| PUT | `/api/merchant/orders/:id/ship` | 发货 |
| GET | `/api/merchant/products` | 商家商品管理 |
| GET | `/api/merchant/coupons` | 商家优惠券管理 |
| POST | `/api/merchant/coupons` | 创建优惠券 |

## 查询参数规范

### 分页参数
- `page`: 页码，默认 1
- `limit`: 每页数量，默认 10，最大 100
- `sort`: 排序字段，如 `createdAt`
- `order`: 排序方向，`ASC` 或 `DESC`

### 商品列表筛选
- `category`: 分类筛选
- `minPrice`: 最低价格
- `maxPrice`: 最高价格
- `keyword`: 搜索关键词
- `status`: 商品状态

### 订单列表筛选
- `status`: 订单状态
- `startDate`: 开始日期
- `endDate`: 结束日期

## 响应格式规范

### 成功响应
```json
{
  "success": true,
  "data": {}, // 响应数据
  "message": "操作成功"
}
```

### 列表响应
```json
{
  "success": true,
  "data": {
    "items": [], // 列表数据
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "message": "获取成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "参数验证失败",
    "details": []
  }
}
```

## 状态码约定

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器错误 | 