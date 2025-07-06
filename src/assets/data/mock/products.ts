// 商品数据类型定义
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  tags?: string[];
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
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
    name: 'Lorem ipsum dolor sit amet consectetur',
    price: 17.00,
    image: '/assets/images/products/product-1.png',
    category: 'clothing',
    tags: ['New'],
    isNew: true,
    rating: 4.5,
    reviews: 120
  },
  {
    id: '2', 
    name: 'Lorem ipsum dolor sit amet consectetur',
    price: 17.00,
    image: '/assets/images/products/product-2.png',
    category: 'clothing',
    tags: ['Sale'],
    isSale: true,
    originalPrice: 25.00,
    discount: 32,
    rating: 4.8,
    reviews: 89
  },
  {
    id: '3',
    name: 'Lorem ipsum dolor sit amet consectetur',
    price: 17.00,
    image: '/assets/images/products/product-3.png',
    category: 'clothing',
    tags: ['Hot'],
    isHot: true,
    rating: 4.3,
    reviews: 156
  },
  {
    id: '4',
    name: 'Lorem ipsum dolor sit amet consectetur',
    price: 17.00,
    image: '/assets/images/products/product-4.png',
    category: 'clothing',
    tags: ['Hot'],
    isHot: true,
    rating: 4.6,
    reviews: 234
  },
  {
    id: '5',
    name: 'Lorem ipsum dolor sit amet consectetur.',
    price: 17.00,
    image: '/assets/images/products/product-5.png',
    category: 'new-items',
    isNew: true,
    rating: 4.2,
    reviews: 67
  },
  {
    id: '6',
    name: 'Lorem ipsum dolor sit amet consectetur.',
    price: 32.00,
    image: '/assets/images/products/product-6.png',
    category: 'new-items',
    isNew: true,
    rating: 4.7,
    reviews: 98
  },
  {
    id: '7',
    name: 'Lorem ipsum dolor sit amet consectetur.',
    price: 21.00,
    image: '/assets/images/products/product-7.png',
    category: 'new-items',
    isNew: true,
    rating: 4.4,
    reviews: 145
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