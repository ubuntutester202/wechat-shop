import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../../components/common/StatusBar";
import BottomNavigation from "../../components/common/BottomNavigation";
import { useCartStore } from "../../stores/cartStore";
import {
  mockProducts,
  mockCategories,
  mockFlashSaleProducts,
  mockPopularProducts,
  topProductCategories,
  Product,
  Category
} from "../../assets/data/mock/products";

/**
 * Shop页面组件 - 对应Figma设计稿："15 Shop"页面
 * 电商首页，包含搜索、分类、限时抢购、热门商品等功能模块
 */
const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 36, seconds: 58 });

  // 倒计时逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 处理搜索输入
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 处理搜索提交
  const handleSearchSubmit = () => {
    console.log("Search for:", searchQuery);
    // TODO: 实现搜索功能
  };

  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    console.log("Navigate to category:", categoryId);
    // TODO: 导航到分类页面
  };

  // 处理商品点击
  const handleProductClick = (productId: string) => {
    console.log("Navigate to product:", productId);
    // 导航到商品详情页面
    navigate(`/product/${productId}`);
  };

  // 渲染产品卡片
  const renderProductCard = (product: Product, showPrice = true) => (
    <div
      key={product.id}
      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
      onClick={() => handleProductClick(product.id)}
    >
      {/* 商品图片 */}
      <div className="w-full h-32 bg-gray-200 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 图片加载失败时显示占位符
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling;
            if (fallback) {
              fallback.classList.remove('hidden');
              fallback.classList.add('flex');
            }
          }}
        />
        {/* 图片加载失败时的占位符 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center hidden">
          <div className="w-16 h-16 bg-primary/20 rounded-full"></div>
        </div>
        {/* 标签 */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
              product.tags[0] === 'New' ? 'bg-blue-500' :
              product.tags[0] === 'Sale' ? 'bg-red-500' :
              product.tags[0] === 'Hot' ? 'bg-orange-500' : 'bg-gray-500'
            }`}>
              {product.tags[0]}
            </span>
          </div>
        )}
      </div>
      {/* 商品信息 */}
      {showPrice && (
        <div className="p-3">
          <p className="text-sm text-gray-600 mb-1 line-clamp-2">{product.name}</p>
          <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
        </div>
      )}
    </div>
  );

  // 渲染热门产品卡片
  const renderPopularCard = (item: any) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden relative">
      {/* 商品图片 */}
      <div className="w-24 h-32 bg-gray-200 relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling;
            if (fallback) {
              fallback.classList.remove('hidden');
              fallback.classList.add('flex');
            }
          }}
        />
        {/* 图片加载失败时的占位符 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center hidden">
          <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
        </div>
        {/* 爱心图标 */}
        <div className="absolute top-2 left-2">
          <svg width="11" height="10" viewBox="0 0 11 10" fill="none" className="text-primary">
            <path
              d="M5.5 9L4.975 8.525C2.55 6.34 1 5.02 1 3.4C1 2.15 1.975 1.2 3.25 1.2C3.925 1.2 4.575 1.525 5 2.025C5.425 1.525 6.075 1.2 6.75 1.2C8.025 1.2 9 2.15 9 3.4C9 5.02 7.45 6.34 5.025 8.525L5.5 9Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      {/* 评分和标签 */}
      <div className="absolute bottom-2 left-1 right-1">
        <div className="text-xs font-bold text-gray-900 mb-1">{item.rating}</div>
        <div className={`text-xs font-medium ${
          item.tag === 'New' ? 'text-blue-600' :
          item.tag === 'Sale' ? 'text-red-600' :
          item.tag === 'Hot' ? 'text-orange-600' : 'text-gray-600'
        }`}>
          {item.tag}
        </div>
      </div>
    </div>
  );

  // 渲染分类卡片
  const renderCategoryCard = (category: Category) => (
    <div
      key={category.id}
      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer"
      onClick={() => handleCategoryClick(category.id)}
    >
      {/* 分类图片 */}
      <div className="w-16 h-16 bg-gray-200 rounded mb-3 mx-auto">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover rounded"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling;
            if (fallback) {
              fallback.classList.remove('hidden');
              fallback.classList.add('flex');
            }
          }}
        />
        {/* 图片加载失败时的占位符 */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded items-center justify-center hidden">
          <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
        </div>
      </div>
      <h3 className="font-bold text-sm text-gray-900 mb-1">{category.name}</h3>
      <div className="bg-blue-50 rounded px-2 py-1 inline-block">
        <span className="text-xs font-bold text-gray-900">{category.count}</span>
      </div>
    </div>
  );

  // 渲染顶级产品分类
  const renderTopCategory = (category: any) => (
    <div key={category.id} className="flex flex-col items-center cursor-pointer">
      {/* 圆形图标 */}
      <div className="w-15 h-15 bg-white rounded-full shadow-md mb-2 overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.parentElement?.querySelector('.fallback');
            if (fallback) {
              fallback.classList.remove('hidden');
              fallback.classList.add('flex');
            }
          }}
        />
        {/* 图片加载失败时的占位符 */}
        <div className="fallback w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-full items-center justify-center hidden">
          <div className="w-6 h-6 bg-primary/20 rounded-full"></div>
        </div>
      </div>
      <span className="text-xs font-medium text-gray-900 text-center">{category.name}</span>
    </div>
  );



  return (
    <div className="bg-gray-50 min-h-screen">
      <StatusBar />
      {/* 主要内容区域 */}
      <div className="relative z-10">
        {/* 头部标题 */}
        <div className="px-5 pt-4 pb-2">
          <h1 className="font-raleway font-bold text-3xl text-gray-900">Shop</h1>
        </div>

        {/* 搜索框 */}
        <div className="px-5 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-100 rounded-2xl px-4 py-2.5 pr-12 text-sm outline-none focus:bg-gray-50 transition-colors"
              aria-label="搜索商品"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="搜索"
            >
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="text-primary">
                <path
                  d="M19 15L13 9M15 7C15 10.866 11.866 14 8 14C4.134 14 1 10.866 1 7C1 3.134 4.134 0 8 0C11.866 0 15 3.134 15 7Z"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 大促销横幅 */}
        <div className="px-5 mb-6">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 relative overflow-hidden">
            {/* 装饰背景 */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-yellow-300 rounded-full opacity-70"></div>
            <div className="absolute top-4 right-12 w-24 h-24 bg-yellow-400 rounded-full opacity-60"></div>
            <div className="absolute -bottom-4 right-8 w-20 h-20 bg-yellow-300 rounded-full opacity-70"></div>
            
            <div className="relative z-10">
              <h2 className="font-raleway font-bold text-2xl text-gray-900 mb-1">Big Sale</h2>
              <p className="font-raleway font-bold text-sm text-gray-900 mb-1">
                Happening<br />Now
              </p>
              <p className="font-nunito font-bold text-xs text-gray-900 mb-3">Up to 50%</p>
              
              {/* 指示器 */}
              <div className="flex space-x-2">
                <div className="w-10 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 商品分类 */}
        <div className="px-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-raleway font-bold text-xl text-gray-900">Categories</h2>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-900 mr-2">See All</span>
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" className="text-white">
                  <path
                    d="M8.5 1L13 5.5L8.5 10M13 5.5H1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mockCategories.slice(0, 6).map(renderCategoryCard)}
          </div>
        </div>

        {/* 限时抢购 */}
        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="font-raleway font-bold text-xl text-gray-900 mr-3">Flash Sale</h2>
              <svg width="17" height="20" viewBox="0 0 17 20" fill="none" className="text-primary">
                <path
                  d="M8.5 0C13.194 0 17 3.806 17 8.5C17 13.194 13.194 17 8.5 17C3.806 17 0 13.194 0 8.5C0 3.806 3.806 0 8.5 0ZM8.5 2C4.91 2 2 4.91 2 8.5C2 12.09 4.91 15 8.5 15C12.09 15 15 12.09 15 8.5C15 4.91 12.09 2 8.5 2ZM8.5 4C8.776 4 9 4.224 9 4.5V8.5C9 8.776 8.776 9 8.5 9H6.5C6.224 9 6 8.776 6 8.5C6 8.224 6.224 8 6.5 8H8V4.5C8 4.224 8.224 4 8.5 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {/* 倒计时 */}
            <div className="flex space-x-1">
              {[
                { value: timeLeft.hours.toString().padStart(2, '0'), label: '时' },
                { value: timeLeft.minutes.toString().padStart(2, '0'), label: '分' },
                { value: timeLeft.seconds.toString().padStart(2, '0'), label: '秒' }
              ].map((time, index) => (
                <div key={index} className="bg-gray-200 rounded px-2 py-1">
                  <span className="text-sm font-bold text-gray-900">{time.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {mockFlashSaleProducts.map((flashSale) => (
              <div key={flashSale.id} className="flex-shrink-0 w-28">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
                  {/* 商品图片 */}
                  <div className="w-full h-28 bg-gray-200 relative">
                    <img 
                      src={flashSale.product.image} 
                      alt={flashSale.product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling;
                        if (fallback) {
                          fallback.classList.remove('hidden');
                          fallback.classList.add('flex');
                        }
                      }}
                    />
                    {/* 图片加载失败时的占位符 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 items-center justify-center hidden">
                      <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
                    </div>
                    {/* 折扣标签 */}
                    <div className="absolute top-1 left-1">
                      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-tr rounded-bl">
                        -20%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 热门产品 */}
        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-raleway font-bold text-xl text-gray-900">Most Popular</h2>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-900 mr-2">See All</span>
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" className="text-white">
                  <path
                    d="M8.5 1L13 5.5L8.5 10M13 5.5H1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {mockPopularProducts.map(renderPopularCard)}
          </div>
        </div>

        {/* 新品推荐 */}
        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-raleway font-bold text-xl text-gray-900">New Items</h2>
            <div className="flex items-center">
              <span className="text-sm font-bold text-gray-900 mr-2">See All</span>
              <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                <svg width="14" height="11" viewBox="0 0 14 11" fill="none" className="text-white">
                  <path
                    d="M8.5 1L13 5.5L8.5 10M13 5.5H1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {mockProducts.filter(p => p.category === 'new-items').map((product) => (
              <div key={product.id} className="flex-shrink-0 w-36">
                {renderProductCard(product)}
              </div>
            ))}
          </div>
        </div>

        {/* 顶级产品分类 */}
        <div className="px-5 mb-6">
          <h2 className="font-raleway font-bold text-xl text-gray-900 mb-4">Top Products</h2>
          <div className="flex justify-between">
            {topProductCategories.map(renderTopCategory)}
          </div>
        </div>

        {/* 为你推荐 */}
        <div className="px-5 mb-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-raleway font-bold text-xl text-gray-900">Just For You</h2>
            <div className="flex items-center">
              <svg width="14" height="13" viewBox="0 0 14 13" fill="none" className="text-primary mr-1">
                <path
                  d="M7 0L8.854 4.708L14 4.708L9.573 7.584L11.427 12.292L7 9.416L2.573 12.292L4.427 7.584L0 4.708L5.146 4.708L7 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {mockProducts.filter(p => p.category === 'clothing').map(product => renderProductCard(product))}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ShopPage; 