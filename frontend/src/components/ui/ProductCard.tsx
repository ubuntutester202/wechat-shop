import React from 'react';
import { Product } from '../../assets/data/mock/products';

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
  onClick?: (productId: string) => void;
  className?: string;
}

/**
 * 商品卡片组件
 * 用于展示商品的基本信息，包括图片、标题、价格等
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showPrice = true, 
  onClick,
  className = ""
}) => {
  // 处理商品点击
  const handleClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  // 处理图片加载错误
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const fallback = target.nextElementSibling;
    if (fallback) {
      (fallback as HTMLElement).classList.remove('hidden');
      (fallback as HTMLElement).classList.add('flex');
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* 商品图片 */}
      <div className="w-full h-32 bg-gray-200 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
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
          <div className="flex items-center justify-between">
            <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {/* 评分信息 */}
          {product.rating && (
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviews || 0})
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard; 