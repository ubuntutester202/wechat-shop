import React from 'react';

interface ProductCardSkeletonProps {
  className?: string;
}

/**
 * 商品卡片骨架屏组件
 * 用于在商品数据加载时显示加载状态
 */
const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* 图片骨架 */}
      <div className="w-full h-32 bg-gray-200 animate-pulse"></div>
      
      {/* 内容骨架 */}
      <div className="p-3">
        {/* 标题骨架 */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
        
        {/* 价格骨架 */}
        <div className="flex items-center justify-between mb-1">
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        
        {/* 评分骨架 */}
        <div className="flex items-center">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-8 ml-1 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton; 