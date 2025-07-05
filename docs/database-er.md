# 数据库 ER 图设计

## 概述

本文档描述了微信电商系统的数据库实体关系模型，基于 MVP 功能需求设计，涵盖用户管理、商品管理、订单流程、支付系统、优惠券系统等核心业务模块。

## 实体关系图

```mermaid
erDiagram
    %% 用户相关实体
    User {
        string id PK "主键"
        string openId "微信OpenID"
        string unionId "微信UnionID"
        string nickname "微信昵称"
        string avatar "头像URL"
        string phone "手机号"
        string email "邮箱"
        enum role "用户角色：BUYER/MERCHANT/ADMIN"
        enum status "状态：ACTIVE/DISABLED"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    Address {
        string id PK "主键"
        string userId FK "用户ID"
        string receiverName "收件人姓名"
        string receiverPhone "收件人电话"
        string province "省份"
        string city "城市"
        string district "区县"
        string detail "详细地址"
        string postalCode "邮政编码"
        boolean isDefault "是否默认地址"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    %% 商品相关实体
    Product {
        string id PK "主键"
        string merchantId FK "商家ID"
        string name "商品名称"
        string description "商品描述"
        number price "价格(分)"
        number originalPrice "原价(分)"
        number stock "库存"
        json images "商品图片数组"
        string category "分类"
        json tags "标签"
        enum status "状态：DRAFT/PUBLISHED/SOLD_OUT/ARCHIVED"
        number salesCount "销量"
        number rating "评分"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    ProductSpec {
        string id PK "主键"
        string productId FK "商品ID"
        string name "规格名称"
        string value "规格值"
        number priceAdjustment "价格调整(分)"
        number stock "该规格库存"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    %% 购物车相关实体
    CartItem {
        string id PK "主键"
        string userId FK "用户ID"
        string productId FK "商品ID"
        string specId FK "规格ID"
        number quantity "数量"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    %% 订单相关实体
    Order {
        string id PK "主键"
        string orderNo "订单号"
        string userId FK "买家ID"
        string merchantId FK "商家ID"
        enum status "状态：PENDING/PAID/SHIPPED/DELIVERED/CANCELLED/REFUNDED"
        number totalAmount "总金额(分)"
        number discountAmount "折扣金额(分)"
        number shippingAmount "运费(分)"
        number paymentAmount "实付金额(分)"
        string paymentMethod "支付方式"
        enum paymentStatus "支付状态：PENDING/PAID/FAILED/REFUNDED"
        json shippingAddress "收货地址快照"
        string remark "订单备注"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    OrderItem {
        string id PK "主键"
        string orderId FK "订单ID"
        string productId FK "商品ID"
        json productSnapshot "商品快照"
        string specId FK "规格ID"
        json specSnapshot "规格快照"
        number quantity "数量"
        number unitPrice "单价(分)"
        number totalPrice "小计(分)"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    %% 支付相关实体
    Payment {
        string id PK "主键"
        string orderId FK "订单ID"
        string paymentNo "支付单号"
        string provider "支付提供方"
        string providerOrderId "第三方订单号"
        number amount "支付金额(分)"
        enum status "状态：PENDING/SUCCESS/FAILED/CANCELLED"
        datetime paidAt "支付时间"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    %% 优惠券相关实体
    Coupon {
        string id PK "主键"
        string merchantId FK "商家ID"
        string name "优惠券名称"
        enum type "类型：FIXED/PERCENTAGE"
        number value "优惠值"
        number minAmount "最小使用金额(分)"
        number maxDiscount "最大折扣金额(分)"
        number totalQuantity "总发行量"
        number usedQuantity "已使用量"
        datetime startDate "有效期开始"
        datetime endDate "有效期结束"
        enum status "状态：ACTIVE/DISABLED"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    UserCoupon {
        string id PK "主键"
        string userId FK "用户ID"
        string couponId FK "优惠券ID"
        enum status "状态：UNUSED/USED/EXPIRED"
        datetime usedAt "使用时间"
        string orderId FK "使用的订单ID"
        datetime obtainedAt "获得时间"
        datetime expiredAt "过期时间"
    }

    %% 其他功能实体
    Favorite {
        string id PK "主键"
        string userId FK "用户ID"
        string productId FK "商品ID"
        datetime createdAt "创建时间"
    }

    BrowseRecord {
        string id PK "主键"
        string userId FK "用户ID"
        string productId FK "商品ID"
        datetime createdAt "创建时间"
        datetime updatedAt "更新时间"
    }

    %% 实体关系
    User ||--o{ Address : "拥有"
    User ||--o{ Product : "商家发布"
    User ||--o{ CartItem : "购物车"
    User ||--o{ Order : "买家订单"
    User ||--o{ Order : "商家订单"
    User ||--o{ UserCoupon : "拥有优惠券"
    User ||--o{ Favorite : "收藏"
    User ||--o{ BrowseRecord : "浏览记录"

    Product ||--o{ ProductSpec : "规格"
    Product ||--o{ CartItem : "购物车商品"
    Product ||--o{ OrderItem : "订单商品"
    Product ||--o{ Favorite : "被收藏"
    Product ||--o{ BrowseRecord : "被浏览"

    ProductSpec ||--o{ CartItem : "购物车规格"
    ProductSpec ||--o{ OrderItem : "订单规格"

    Order ||--o{ OrderItem : "订单商品"
    Order ||--o{ Payment : "支付记录"
    Order ||--o{ UserCoupon : "使用优惠券"

    Coupon ||--o{ UserCoupon : "优惠券实例"
    User ||--o{ Coupon : "商家发布优惠券"
```

## 核心实体说明

### 1. 用户模块

#### User（用户表）
- **作用**：存储用户基本信息，支持买家、商家、管理员三种角色
- **特点**：
  - 使用微信 OpenID 作为唯一标识
  - 支持角色升级（买家→商家）
  - 包含用户状态管理

#### Address（地址表）
- **作用**：存储用户收货地址信息
- **特点**：
  - 支持多地址管理
  - 支持默认地址设置
  - 包含完整的地址层级结构

### 2. 商品模块

#### Product（商品表）
- **作用**：存储商品基本信息
- **特点**：
  - 支持商品状态管理（草稿、发布、缺货、归档）
  - 价格以分为单位，避免浮点精度问题
  - 支持多图片存储
  - 包含销量和评分统计

#### ProductSpec（商品规格表）
- **作用**：存储商品规格信息（如颜色、尺寸等）
- **特点**：
  - 支持规格价格调整
  - 独立的规格库存管理
  - 灵活的规格名称和值设计

### 3. 购物车模块

#### CartItem（购物车项表）
- **作用**：存储用户购物车中的商品
- **特点**：
  - 支持规格选择
  - 数量管理
  - 与商品和用户关联

### 4. 订单模块

#### Order（订单表）
- **作用**：存储订单主要信息
- **特点**：
  - 完整的订单状态流转
  - 支付状态独立管理
  - 地址信息快照存储
  - 支持跨店铺订单（通过 merchantId）

#### OrderItem（订单项表）
- **作用**：存储订单中的具体商品信息
- **特点**：
  - 商品信息快照存储，避免商品变更影响历史订单
  - 支持规格信息快照
  - 独立的价格计算

### 5. 支付模块

#### Payment（支付记录表）
- **作用**：存储支付相关信息
- **特点**：
  - 支持多种支付方式扩展
  - 第三方支付订单号关联
  - 完整的支付状态追踪

### 6. 优惠券模块

#### Coupon（优惠券模板表）
- **作用**：存储优惠券模板定义
- **特点**：
  - 支持固定金额和百分比折扣
  - 使用条件设置（最小金额、最大折扣）
  - 发行量控制

#### UserCoupon（用户优惠券表）
- **作用**：存储用户拥有的优惠券实例
- **特点**：
  - 优惠券状态管理
  - 使用记录追踪
  - 过期时间管理

### 7. 其他功能模块

#### Favorite（收藏表）
- **作用**：存储用户收藏的商品
- **特点**：
  - 简单的用户-商品关联
  - 支持收藏时间记录

#### BrowseRecord（浏览记录表）
- **作用**：存储用户浏览商品的历史记录
- **特点**：
  - 支持浏览时间更新
  - 便于推荐系统数据源

## 设计原则

1. **数据一致性**：使用外键约束确保数据关联的完整性
2. **历史数据保护**：订单相关数据使用快照模式，避免商品变更影响历史记录
3. **扩展性**：预留足够的扩展字段，支持未来功能迭代
4. **性能优化**：合理设计索引，支持常用查询场景
5. **数据精度**：金额相关字段使用整数存储（以分为单位）

## 索引建议

### 主要索引
- `User.openId` - 唯一索引，微信登录查询
- `Product.merchantId` - 商家商品查询
- `Product.category` - 分类查询
- `Product.status` - 状态查询
- `Order.userId` - 用户订单查询
- `Order.merchantId` - 商家订单查询
- `Order.orderNo` - 订单号查询
- `CartItem.userId` - 购物车查询
- `UserCoupon.userId` - 用户优惠券查询
- `BrowseRecord.userId` - 浏览记录查询

### 复合索引
- `(Product.status, Product.createdAt)` - 商品列表查询
- `(Order.userId, Order.status)` - 用户订单状态查询
- `(UserCoupon.userId, UserCoupon.status)` - 用户可用优惠券查询

## 数据迁移策略

1. **初始化脚本**：提供完整的数据库初始化 SQL
2. **种子数据**：提供测试用的种子数据脚本
3. **版本控制**：使用 Prisma 迁移管理数据库版本
4. **备份策略**：定期备份生产数据，支持数据恢复

## 相关文档

- [项目概述](./overview.md)
- [API 资源设计](./api-resources.md)
- [行动计划](./action-plan.md) 