// 商品数据类型定义
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[]; // 商品图片集合
  category: string;
  tags?: string[];
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
  description?: string;
  specifications?: ProductSpecification[];
  variants?: ProductVariant[];
  stock?: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  shippingInfo?: string;
  returnPolicy?: string;
  warranty?: string;
}

// 商品规格接口
export interface ProductSpecification {
  name: string;
  value: string;
}

// 商品变体接口（如颜色、尺寸）
export interface ProductVariant {
  id: string;
  type: 'color' | 'size' | 'style';
  name: string;
  value: string;
  image?: string;
  stock?: number;
  priceModifier?: number; // 价格调整（正数加价，负数减价）
}

// 商品尺寸接口
export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'inch';
}

// 商品评价接口
export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: Date;
  verified: boolean;
  likes?: number;
  variant?: string; // 购买的变体信息
}

// 商品分类数据
export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
}

// 限时抢购数据
export interface FlashSale {
  id: string;
  product: Product;
  flashPrice: number;
  discount: number;
  endTime: Date;
}

// 模拟商品数据
export const mockProducts: Product[] = [
  {
    id: '1',
    name: '时尚休闲连帽卫衣',
    price: 17.00,
    image: '/assets/images/products/product-1.png',
    images: [
      '/assets/images/products/product-1.png',
      '/assets/images/products/product-1-2.png',
      '/assets/images/products/product-1-3.png',
      '/assets/images/products/product-1-4.png'
    ],
    category: 'clothing',
    tags: ['New'],
    isNew: true,
    rating: 4.5,
    reviews: 120,
    description: '这款时尚休闲连帽卫衣采用优质纯棉面料，触感柔软舒适，透气性好。宽松版型设计，适合多种身材，是日常休闲穿搭的必备单品。前袋设计实用美观，连帽设计时尚有型。',
    specifications: [
      { name: '面料成分', value: '100%纯棉' },
      { name: '洗涤方式', value: '机洗，水温不超过30°C' },
      { name: '产地', value: '中国' },
      { name: '厚度', value: '中等厚度' }
    ],
    variants: [
      { id: 'color-black', type: 'color', name: '颜色', value: '黑色', stock: 50, priceModifier: 0 },
      { id: 'color-white', type: 'color', name: '颜色', value: '白色', stock: 30, priceModifier: 0 },
      { id: 'color-gray', type: 'color', name: '颜色', value: '灰色', stock: 25, priceModifier: 0 },
      { id: 'color-red', type: 'color', name: '颜色', value: '红色', stock: 0, priceModifier: 0 }, // 缺货测试
      { id: 'size-s', type: 'size', name: '尺寸', value: 'S', stock: 20, priceModifier: 0 },
      { id: 'size-m', type: 'size', name: '尺寸', value: 'M', stock: 35, priceModifier: 0 },
      { id: 'size-l', type: 'size', name: '尺寸', value: 'L', stock: 40, priceModifier: 0 },
      { id: 'size-xl', type: 'size', name: '尺寸', value: 'XL', stock: 30, priceModifier: 2.00 }, // XL尺寸加价2元
      { id: 'size-xxl', type: 'size', name: '尺寸', value: 'XXL', stock: 15, priceModifier: 5.00 } // XXL尺寸加价5元
    ],
    stock: 105,
    brand: '悠闲生活',
    sku: 'YX-SW-001',
    weight: 0.5,
    dimensions: { length: 65, width: 55, height: 2, unit: 'cm' },
    shippingInfo: '全国包邮，预计3-5个工作日送达',
    returnPolicy: '7天无理由退换',
    warranty: '质量问题30天内免费换货'
  },
  {
    id: '2', 
    name: '经典款牛仔外套',
    price: 17.00,
    originalPrice: 25.00,
    discount: 32,
    image: '/assets/images/products/product-2.png',
    images: [
      '/assets/images/products/product-2.png',
      '/assets/images/products/product-2-2.png',
      '/assets/images/products/product-2-3.png'
    ],
    category: 'clothing',
    tags: ['Sale'],
    isSale: true,
    rating: 4.8,
    reviews: 89,
    description: '经典款牛仔外套，采用优质水洗牛仔面料，质地厚实耐穿。复古的设计风格，搭配任何服装都能展现时尚品味。胸前双口袋设计，实用性强。',
    specifications: [
      { name: '面料成分', value: '100%棉' },
      { name: '洗涤方式', value: '冷水手洗，阴干' },
      { name: '产地', value: '中国' },
      { name: '版型', value: '修身版型' }
    ],
    variants: [
      { id: 'color-blue', type: 'color', name: '颜色', value: '浅蓝色', stock: 40, priceModifier: 0 },
      { id: 'color-darkblue', type: 'color', name: '颜色', value: '深蓝色', stock: 35, priceModifier: 3.00 }, // 深蓝色加价3元
      { id: 'color-black', type: 'color', name: '颜色', value: '黑色', stock: 25, priceModifier: 0 },
      { id: 'color-vintage', type: 'color', name: '颜色', value: '复古蓝', stock: 12, priceModifier: 8.00 }, // 复古蓝加价8元
      { id: 'size-s', type: 'size', name: '尺寸', value: 'S', stock: 15, priceModifier: 0 },
      { id: 'size-m', type: 'size', name: '尺寸', value: 'M', stock: 30, priceModifier: 0 },
      { id: 'size-l', type: 'size', name: '尺寸', value: 'L', stock: 20, priceModifier: 0 },
      { id: 'size-xl', type: 'size', name: '尺寸', value: 'XL', stock: 8, priceModifier: 2.00 }, // XL尺寸加价2元
      { id: 'style-slim', type: 'style', name: '版型', value: '修身版', stock: 45, priceModifier: 0 },
      { id: 'style-regular', type: 'style', name: '版型', value: '标准版', stock: 30, priceModifier: 0 },
      { id: 'style-oversized', type: 'style', name: '版型', value: '宽松版', stock: 22, priceModifier: 4.00 } // 宽松版加价4元
    ],
    stock: 65,
    brand: '经典牛仔',
    sku: 'JD-JK-002',
    weight: 0.8,
    dimensions: { length: 70, width: 58, height: 3, unit: 'cm' },
    shippingInfo: '全国包邮，预计3-5个工作日送达',
    returnPolicy: '7天无理由退换',
    warranty: '质量问题30天内免费换货'
  },
  {
    id: '3',
    name: '运动休闲T恤',
    price: 17.00,
    image: '/assets/images/products/product-3.png',
    images: [
      '/assets/images/products/product-3.png',
      '/assets/images/products/product-3-2.png'
    ],
    category: 'clothing',
    tags: ['Hot'],
    isHot: true,
    rating: 4.3,
    reviews: 156,
    description: '透气舒适的运动休闲T恤，采用吸汗快干面料，适合运动和日常穿着。简约的设计风格，百搭实用。',
    specifications: [
      { name: '面料成分', value: '95%棉+5%氨纶' },
      { name: '洗涤方式', value: '机洗，水温不超过40°C' },
      { name: '产地', value: '中国' }
    ],
    variants: [
      { id: 'color-white', type: 'color', name: '颜色', value: '白色', stock: 35, priceModifier: 0 },
      { id: 'color-black', type: 'color', name: '颜色', value: '黑色', stock: 30, priceModifier: 0 },
      { id: 'color-navy', type: 'color', name: '颜色', value: '海军蓝', stock: 18, priceModifier: 2.00 }, // 海军蓝加价2元
      { id: 'color-gray', type: 'color', name: '颜色', value: '灰色', stock: 22, priceModifier: 0 },
      { id: 'size-s', type: 'size', name: '尺寸', value: 'S', stock: 25, priceModifier: 0 },
      { id: 'size-m', type: 'size', name: '尺寸', value: 'M', stock: 40, priceModifier: 0 },
      { id: 'size-l', type: 'size', name: '尺寸', value: 'L', stock: 30, priceModifier: 0 },
      { id: 'size-xl', type: 'size', name: '尺寸', value: 'XL', stock: 12, priceModifier: 1.50 } // XL尺寸加价1.5元
    ],
    stock: 65,
    brand: '运动时尚',
    sku: 'YD-TS-003'
  },
  {
    id: '4',
    name: '时尚针织毛衣',
    price: 17.00,
    image: '/assets/images/products/product-4.png',
    category: 'clothing',
    tags: ['Hot'],
    isHot: true,
    rating: 4.6,
    reviews: 234,
    description: '温暖舒适的针织毛衣，适合秋冬季节穿着。精致的针织工艺，保暖性好。',
    stock: 80,
    brand: '温暖针织'
  },
  {
    id: '5',
    name: '简约风格衬衫',
    price: 17.00,
    image: '/assets/images/products/product-5.png',
    category: 'new-items',
    isNew: true,
    rating: 4.2,
    reviews: 67,
    description: '简约风格的衬衫，适合商务和休闲场合。优质面料，舒适透气。',
    stock: 45,
    brand: '简约时尚'
  },
  {
    id: '6',
    name: '经典款风衣',
    price: 32.00,
    image: '/assets/images/products/product-6.png',
    category: 'new-items',
    isNew: true,
    rating: 4.7,
    reviews: 98,
    description: '经典款风衣，防风防雨，适合春秋季节穿着。时尚的设计，提升整体造型。',
    stock: 25,
    brand: '经典时尚'
  },
  {
    id: '7',
    name: '休闲运动裤',
    price: 21.00,
    image: '/assets/images/products/product-7.png',
    category: 'new-items',
    isNew: true,
    rating: 4.4,
    reviews: 145,
    description: '舒适的休闲运动裤，适合运动和日常穿着。弹性面料，活动自如。',
    stock: 60,
    brand: '休闲运动'
  }
];

// 模拟商品分类数据
export const mockCategories: Category[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    image: '/assets/images/categories/category-clothing.png',
    count: 109
  },
  {
    id: 'bags',
    name: 'Bags',
    image: '/assets/images/categories/category-bags.png',
    count: 87
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: '/assets/images/categories/category-shoes.png',
    count: 530
  },
  {
    id: 'lingerie',
    name: 'Lingerie',
    image: '/assets/images/categories/category-lingerie.png',
    count: 218
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    image: '/assets/images/categories/category-hoodies.png',
    count: 218
  },
  {
    id: 'watch',
    name: 'Watch',
    image: '/assets/images/categories/category-watch.png',
    count: 218
  }
];

// 顶级产品分类
export const topProductCategories = [
  {
    id: 'dresses',
    name: 'Dresses',
    image: '/assets/images/top-products/top-dresses.png'
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    image: '/assets/images/top-products/top-tshirts.png'
  },
  {
    id: 'skirts',
    name: 'Skirts',
    image: '/assets/images/top-products/top-skirts.png'
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: '/assets/images/top-products/top-shoes.png'
  },
  {
    id: 'bags',
    name: 'Bags',
    image: '/assets/images/top-products/top-bags.png'
  }
];

// 限时抢购模拟数据
export const mockFlashSaleProducts: FlashSale[] = [
  {
    id: 'flash-1',
    product: {
      id: 'flash-p1',
      name: 'Flash Sale Product 1',
      price: 15.99,
      originalPrice: 19.99,
      image: '/assets/images/flash-sale/flash-1.png',
      category: 'flash',
      isSale: true
    },
    flashPrice: 15.99,
    discount: 20,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后
  },
  {
    id: 'flash-2',
    product: {
      id: 'flash-p2',
      name: 'Flash Sale Product 2',
      price: 12.79,
      originalPrice: 15.99,
      image: '/assets/images/flash-sale/flash-2.png',
      category: 'flash',
      isSale: true
    },
    flashPrice: 12.79,
    discount: 20,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: 'flash-3',
    product: {
      id: 'flash-p3',
      name: 'Flash Sale Product 3',
      price: 13.60,
      originalPrice: 17.00,
      image: '/assets/images/flash-sale/flash-3.png',
      category: 'flash',
      isSale: true
    },
    flashPrice: 13.60,
    discount: 20,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: 'flash-4',
    product: {
      id: 'flash-p4',
      name: 'Flash Sale Product 4',
      price: 13.60,
      originalPrice: 17.00,
      image: '/assets/images/flash-sale/flash-4.png',
      category: 'flash',
      isSale: true
    },
    flashPrice: 13.60,
    discount: 20,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: 'flash-5',
    product: {
      id: 'flash-p5',
      name: 'Flash Sale Product 5',
      price: 13.60,
      originalPrice: 17.00,
      image: '/assets/images/flash-sale/flash-5.png',
      category: 'flash',
      isSale: true
    },
    flashPrice: 13.60,
    discount: 20,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: 'flash-6',
    product: {
      id: 'flash-p6',
      name: 'Flash Sale Product 6',
      price: 13.60,
      originalPrice: 17.00,
      image: '/assets/images/flash-sale/flash-6.png',
      category: 'flash',
      isSale: true
    },
    flashPrice: 13.60,
    discount: 20,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
];

// 热门产品评分数据
export const mockPopularProducts = [
  {
    id: 'pop-1',
    rating: '1780',
    tag: 'New',
    image: '/assets/images/products/product-1.png'
  },
  {
    id: 'pop-2', 
    rating: '1780',
    tag: 'Sale',
    image: '/assets/images/products/product-2.png'
  },
  {
    id: 'pop-3',
    rating: '1780',
    tag: 'Hot',
    image: '/assets/images/products/product-3.png'
  },
  {
    id: 'pop-4',
    rating: '1780', 
    tag: 'Hot',
    image: '/assets/images/products/product-4.png'
  }
];

// 商品评价mock数据
export const mockProductReviews: Record<string, ProductReview[]> = {
  '1': [
    {
      id: 'review-1-1',
      userId: 'user-1',
      userName: '小明',
      userAvatar: '/assets/images/avatars/user-1.png',
      rating: 5,
      title: '质量很好，非常满意！',
      content: '衣服质量非常好，面料很舒服，版型也很合适。发货速度很快，包装也很好。非常满意的一次购物体验，会推荐给朋友的。',
      images: ['/assets/images/reviews/review-1-1.jpg', '/assets/images/reviews/review-1-2.jpg'],
      createdAt: new Date('2024-01-15'),
      verified: true,
      likes: 12,
      variant: '黑色 M码'
    },
    {
      id: 'review-1-2',
      userId: 'user-2',
      userName: '张小花',
      userAvatar: '/assets/images/avatars/user-2.png',
      rating: 4,
      title: '穿着舒适，值得购买',
      content: '面料很柔软，穿着很舒服。颜色也很正，和图片基本一致。唯一不足是尺码偏大，下次建议选小一号。',
      createdAt: new Date('2024-01-10'),
      verified: true,
      likes: 8,
      variant: '白色 L码'
    },
    {
      id: 'review-1-3',
      userId: 'user-3',
      userName: '李大力',
      userAvatar: '/assets/images/avatars/user-3.png',
      rating: 5,
      title: '超值购买，强烈推荐',
      content: '这个价格能买到这么好的质量，真的很划算。做工精细，没有线头，洗后也不变形。已经推荐给同事了。',
      createdAt: new Date('2024-01-05'),
      verified: true,
      likes: 15,
      variant: '灰色 M码'
    }
  ],
  '2': [
    {
      id: 'review-2-1',
      userId: 'user-4',
      userName: '王小美',
      userAvatar: '/assets/images/avatars/user-4.png',
      rating: 5,
      title: '经典款式，非常喜欢',
      content: '牛仔外套质量非常好，面料厚实，做工精细。版型很好看，搭配什么都很好看。值得购买！',
      createdAt: new Date('2024-01-12'),
      verified: true,
      likes: 20,
      variant: '蓝色 M码'
    },
    {
      id: 'review-2-2',
      userId: 'user-5',
      userName: '赵小强',
      userAvatar: '/assets/images/avatars/user-5.png',
      rating: 4,
      title: '质量不错，性价比高',
      content: '外套质量很好，面料很有质感。颜色很正，尺码也很合适。发货速度很快，包装也很好。',
      createdAt: new Date('2024-01-08'),
      verified: true,
      likes: 10,
      variant: '黑色 L码'
    }
  ]
};

// 根据商品ID获取评价数据的工具函数
export const getProductReviews = (productId: string): ProductReview[] => {
  return mockProductReviews[productId] || [];
};

// 根据商品ID获取商品详情的工具函数
export const getProductById = (productId: string): Product | undefined => {
  return mockProducts.find(product => product.id === productId);
}; 