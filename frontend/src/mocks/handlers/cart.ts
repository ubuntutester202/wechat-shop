import { http, HttpResponse } from 'msw';
import { getProductById } from '../../assets/data/mock/products';

// API 基础路径
const API_BASE = '/api';

// 模拟购物车数据
let mockCartItems: Array<{
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariants: { [key: string]: string };
}> = [];

export const cartHandlers = [
  // 获取购物车列表
  http.get(`${API_BASE}/cart`, () => {
    console.log('[MSW] 获取购物车列表');
    
    return HttpResponse.json({
      data: mockCartItems,
      total: mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      itemCount: mockCartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  }),

  // 添加商品到购物车
  http.post(`${API_BASE}/cart`, async ({ request }) => {
    const body = await request.json() as {
      productId: string;
      quantity: number;
      selectedVariants: { [key: string]: string };
    };

    console.log('[MSW] 添加到购物车:', body);

    const product = getProductById(body.productId);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    // 生成购物车项ID
    const variantString = Object.entries(body.selectedVariants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    const itemId = `${body.productId}|${variantString}`;

    // 检查是否已存在
    const existingItemIndex = mockCartItems.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      // 更新数量
      mockCartItems[existingItemIndex].quantity += body.quantity;
    } else {
      // 添加新项
      mockCartItems.push({
        id: itemId,
        productId: body.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: body.quantity,
        selectedVariants: body.selectedVariants
      });
    }

    // 模拟网络延迟
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({ 
          success: true,
          data: mockCartItems[existingItemIndex >= 0 ? existingItemIndex : mockCartItems.length - 1],
          message: '成功添加到购物车'
        }));
      }, 500);
    });
  }),

  // 更新购物车商品数量
  http.put(`${API_BASE}/cart/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { quantity: number };

    console.log(`[MSW] 更新购物车商品数量 - ID: ${id}, 数量: ${body.quantity}`);

    const itemIndex = mockCartItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    if (body.quantity <= 0) {
      mockCartItems.splice(itemIndex, 1);
    } else {
      mockCartItems[itemIndex].quantity = body.quantity;
    }

    return HttpResponse.json({ 
      success: true,
      message: body.quantity <= 0 ? '商品已从购物车移除' : '购物车已更新'
    });
  }),

  // 删除购物车商品
  http.delete(`${API_BASE}/cart/:id`, ({ params }) => {
    const { id } = params;
    console.log(`[MSW] 删除购物车商品 - ID: ${id}`);
    
    const itemIndex = mockCartItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockCartItems.splice(itemIndex, 1);
    return HttpResponse.json({ 
      success: true,
      message: '商品已从购物车移除'
    });
  }),

  // 清空购物车
  http.delete(`${API_BASE}/cart`, () => {
    console.log('[MSW] 清空购物车');
    
    mockCartItems = [];
    return HttpResponse.json({ 
      success: true,
      message: '购物车已清空'
    });
  }),

  // 批量更新购物车
  http.patch(`${API_BASE}/cart/batch`, async ({ request }) => {
    const body = await request.json() as {
      updates: Array<{ id: string; quantity: number }>
    };

    console.log('[MSW] 批量更新购物车:', body);

    body.updates.forEach(update => {
      const itemIndex = mockCartItems.findIndex(item => item.id === update.id);
      if (itemIndex !== -1) {
        if (update.quantity <= 0) {
          mockCartItems.splice(itemIndex, 1);
        } else {
          mockCartItems[itemIndex].quantity = update.quantity;
        }
      }
    });

    return HttpResponse.json({ 
      success: true,
      message: '购物车批量更新成功'
    });
  })
]; 