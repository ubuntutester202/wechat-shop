import { http, HttpResponse } from 'msw';

// 订单计算参数类型
interface OrderCalculationRequest {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  couponCode?: string;
  addressId?: string;
}

// 订单计算返回类型
interface OrderCalculationResponse {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponDiscount?: number;
  shippingMethod: string;
}

// 创建订单请求类型
interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    selectedVariants: { [key: string]: string };
  }>;
  address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  couponCode?: string;
}

// 订单返回类型
interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    selectedVariants: { [key: string]: string };
  }>;
  address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  payment: {
    method: string;
    amount: number;
    paidAt?: string;
  };
  shipping: {
    method: string;
    fee: number;
    trackingNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const orderHandlers = [
  // 计算订单金额
  http.post('/api/orders/calculate', async ({ request }) => {
    const body = await request.json() as OrderCalculationRequest;
    
    // 计算商品小计
    const subtotal = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 计算运费（满99免运费）
    const shipping = subtotal >= 99 ? 0 : 10;
    
    // 计算优惠券折扣
    let couponDiscount = 0;
    if (body.couponCode) {
      switch (body.couponCode) {
        case 'SAVE10':
          couponDiscount = Math.min(subtotal * 0.1, 50); // 10%折扣，最多50元
          break;
        case 'SAVE20':
          couponDiscount = Math.min(subtotal * 0.2, 100); // 20%折扣，最多100元
          break;
        case 'FREESHIP':
          couponDiscount = shipping; // 免运费券
          break;
        default:
          couponDiscount = 0;
      }
    }
    
    const discount = couponDiscount;
    const total = subtotal + shipping - discount;
    
    const response: OrderCalculationResponse = {
      subtotal,
      shipping,
      discount,
      total: Math.max(total, 0), // 确保总金额不为负数
      couponDiscount,
      shippingMethod: shipping === 0 ? '免运费配送' : '标准配送'
    };
    
    return HttpResponse.json(response);
  }),

  // 创建订单
  http.post('/api/orders', async ({ request }) => {
    const body = await request.json() as CreateOrderRequest;
    
    // 模拟生成订单号
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber,
      status: 'pending',
      items: body.items.map(item => ({
        ...item,
        name: `商品 ${item.productId}`, // 实际应该从商品数据库获取
        image: `https://picsum.photos/200/200?random=${item.productId}`
      })),
      address: body.address,
      payment: {
        method: 'wechat_pay',
        amount: body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 10 // 简化计算
      },
      shipping: {
        method: '标准配送',
        fee: 10
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(order, { status: 201 });
  }),

  // 获取订单列表
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Mock 订单数据
    const mockOrders: Order[] = Array.from({ length: 20 }, (_, index) => ({
      id: `order_${index + 1}`,
      orderNumber: `ORD${Date.now() - index * 86400000}${Math.floor(Math.random() * 1000)}`,
      status: ['pending', 'paid', 'shipped', 'delivered'][Math.floor(Math.random() * 4)] as Order['status'],
      items: [{
        productId: `product_${index + 1}`,
        name: `商品 ${index + 1}`,
        image: `https://picsum.photos/200/200?random=${index}`,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(Math.random() * 500) + 50,
        selectedVariants: { color: '黑色', size: 'M' }
      }],
      address: {
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区深南大道9988号'
      },
      payment: {
        method: 'wechat_pay',
        amount: Math.floor(Math.random() * 500) + 50,
        paidAt: index < 10 ? new Date(Date.now() - index * 86400000).toISOString() : undefined
      },
      shipping: {
        method: '标准配送',
        fee: 10,
        trackingNumber: index < 5 ? `SF${Math.random().toString().substr(2, 12)}` : undefined
      },
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - index * 86400000).toISOString()
    }));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = mockOrders.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: mockOrders.length,
        totalPages: Math.ceil(mockOrders.length / limit)
      }
    });
  }),

  // 获取单个订单详情
  http.get('/api/orders/:id', ({ params }) => {
    const { id } = params;
    
    const mockOrder: Order = {
      id: id as string,
      orderNumber: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      status: 'paid',
      items: [{
        productId: 'product_1',
        name: 'iPhone 15 Pro',
        image: 'https://picsum.photos/200/200?random=1',
        quantity: 1,
        price: 7999,
        selectedVariants: { color: '深空黑色', storage: '256GB' }
      }],
      address: {
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南区深南大道9988号'
      },
      payment: {
        method: 'wechat_pay',
        amount: 7999,
        paidAt: new Date().toISOString()
      },
      shipping: {
        method: '标准配送',
        fee: 0,
        trackingNumber: `SF${Math.random().toString().substr(2, 12)}`
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(mockOrder);
  }),

  // 取消订单
  http.patch('/api/orders/:id/cancel', ({ params }) => {
    const { id } = params;
    
    return HttpResponse.json({
      id,
      status: 'cancelled',
      message: '订单已取消'
    });
  })
]; 