import { http, HttpResponse } from 'msw';
import { mockProducts, getProductById } from '../../assets/data/mock/products';

// API 基础路径
const API_BASE = '/api';

export const productHandlers = [
  // 获取商品列表
  http.get(`${API_BASE}/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    console.log(`[MSW] 获取商品列表 - 页码: ${page}, 每页: ${limit}, 分类: ${category}`);

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

    // 模拟网络延迟
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({
          data: paginatedProducts,
          pagination: {
            page,
            limit,
            total: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / limit)
          }
        }));
      }, 300);
    });
  }),

  // 获取商品详情
  http.get(`${API_BASE}/products/:id`, ({ params }) => {
    const { id } = params;
    console.log(`[MSW] 获取商品详情 - ID: ${id}`);
    
    const product = getProductById(id as string);
    
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }

    // 模拟网络延迟
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(HttpResponse.json({ data: product }));
      }, 200);
    });
  }),

  // 搜索商品
  http.get(`${API_BASE}/products/search`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const category = url.searchParams.get('category');
    
    console.log(`[MSW] 搜索商品 - 关键词: ${query}, 分类: ${category}`);

    let results = mockProducts;

    if (query) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (category && category !== 'all') {
      results = results.filter(p => p.category === category);
    }

    return HttpResponse.json({
      data: results,
      total: results.length,
      query: query
    });
  })
]; 