import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Product } from '../../assets/data/mock/products';
import ProductCard from '../../components/ui/ProductCard';
import ProductCardSkeleton from '../../components/ui/ProductCardSkeleton';
import StatusBar from '../../components/common/StatusBar';

/**
 * 搜索结果页面组件
 * 显示基于搜索关键词的商品搜索结果
 */
const SearchResultPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 状态管理
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  // 从 URL 参数获取搜索词
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  // 获取搜索结果
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, category);
    }
  }, [query, category]);

  // 执行搜索
  const performSearch = async (searchQuery: string, categoryFilter?: string) => {
    try {
      setLoading(true);
      
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('q', searchQuery);
      if (categoryFilter) {
        queryParams.append('category', categoryFilter);
      }
      
      console.log(`[搜索] 关键词: ${searchQuery}, 分类: ${categoryFilter}`);
      
      // 调用搜索 API
      const response = await fetch(`/api/products/search?${queryParams.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.data || []);
        setTotalResults(data.total || 0);
      } else {
        console.error('搜索失败:', data);
        setProducts([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('搜索出错:', error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // 处理返回
  const handleGoBack = () => {
    navigate(-1);
  };

  // 处理商品点击
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // 处理新搜索
  const handleNewSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    }
  };

  // 处理搜索框变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNewSearch(searchQuery.trim());
    }
  };

  // 渲染搜索结果网格
  const renderProductGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 gap-4 px-4">
          {[...Array(8)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关商品</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            抱歉，没有找到与 "{query}" 相关的商品
          </p>
          <button
            onClick={() => handleNewSearch('')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
          >
            浏览所有商品
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 px-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={handleProductClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <StatusBar />
      
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center px-4 py-3">
          {/* 返回按钮 */}
          <button
            onClick={handleGoBack}
            className="mr-3 p-1"
            aria-label="返回"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* 搜索框 */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索商品"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-gray-100 rounded-full px-4 py-2 pr-10 text-sm outline-none focus:bg-gray-50 transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="搜索"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 搜索结果信息 */}
      {!loading && (
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {totalResults > 0 ? (
              <>找到 <span className="font-medium text-gray-900">{totalResults}</span> 个相关商品</>
            ) : (
              <>搜索 "{query}" 的结果</>
            )}
          </p>
        </div>
      )}

      {/* 商品列表 */}
      <div className="py-4">
        {renderProductGrid()}
      </div>

      {/* 加载更多（如果需要分页） */}
      {!loading && products.length > 0 && products.length < totalResults && (
        <div className="flex justify-center py-6">
          <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            加载更多
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultPage; 