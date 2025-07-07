import { http, HttpResponse } from 'msw';
import { mockProducts, getProductById } from '../assets/data/mock/products';

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

export const handlers = [
  // 获取商品列表
  http.get(`${API_BASE}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    let filteredProducts = mockProducts;

    // 按分类过滤
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // 按搜索关键词过滤
    if (search) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit)
      }
    });
  }),

  // 获取商品详情
  http.get(`${API_BASE}/products/:id`, ({ params }) => {
    const { id } = params;
    const product = getProductById(id as string);
    
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ data: product });
  }),

  // 获取购物车列表
  http.get(`${API_BASE}/cart`, () => {
    return HttpResponse.json({
      data: mockCartItems,
      total: mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  }),

  // 添加商品到购物车
  http.post(`${API_BASE}/cart`, async ({ request }) => {
    const body = await request.json() as {
      productId: string;
      quantity: number;
      selectedVariants: { [key: string]: string };
    };

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

    return HttpResponse.json({ 
      success: true,
      data: mockCartItems[existingItemIndex >= 0 ? existingItemIndex : mockCartItems.length - 1]
    });
  }),

  // 更新购物车商品数量
  http.put(`${API_BASE}/cart/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { quantity: number };

    const itemIndex = mockCartItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    if (body.quantity <= 0) {
      mockCartItems.splice(itemIndex, 1);
    } else {
      mockCartItems[itemIndex].quantity = body.quantity;
    }

    return HttpResponse.json({ success: true });
  }),

  // 删除购物车商品
  http.delete(`${API_BASE}/cart/:id`, ({ params }) => {
    const { id } = params;
    const itemIndex = mockCartItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    mockCartItems.splice(itemIndex, 1);
    return HttpResponse.json({ success: true });
  }),

  // 清空购物车
  http.delete(`${API_BASE}/cart`, () => {
    mockCartItems = [];
    return HttpResponse.json({ success: true });
  })
]; 