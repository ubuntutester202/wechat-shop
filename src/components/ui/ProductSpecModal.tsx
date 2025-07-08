import React, { useState, useEffect } from 'react';
import { Product, ProductVariant } from '../../assets/data/mock/products';

interface ProductSpecModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedVariants: { [key: string]: string }, quantity: number) => void;
  confirmText: string; // "加入购物车" 或 "立即购买"
  initialVariants?: { [key: string]: string };
  initialQuantity?: number;
}

const ProductSpecModal: React.FC<ProductSpecModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  confirmText,
  initialVariants = {},
  initialQuantity = 1
}) => {
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(product.price);

  // 当弹框打开时重置状态
  useEffect(() => {
    if (isOpen) {
      // 重新计算默认变体
      let variants: { [key: string]: string } = {};
      if (product.variants) {
        const variantTypes = Array.from(new Set(product.variants.map(v => v.type)));
        variantTypes.forEach(type => {
          const firstVariant = product.variants?.find(v => v.type === type);
          if (firstVariant) {
            variants[type] = firstVariant.value;
          }
        });
      }
      
      setSelectedVariants(variants);
      setQuantity(1);
    }
  }, [isOpen]);

  // 计算当前选中规格的价格
  useEffect(() => {
    let price = product.price;
    if (product.variants) {
      // 计算价格调整
      Object.entries(selectedVariants).forEach(([type, value]) => {
        const variant = product.variants?.find(v => v.type === type && v.value === value);
        if (variant && variant.priceModifier) {
          price += variant.priceModifier;
        }
      });
    }
    setCurrentPrice(price);
  }, [selectedVariants, product]);

  // 获取当前选中规格的库存
  const getCurrentStock = () => {
    if (!product.variants) return product.stock || 0;
    
    // 简化处理：返回选中规格中库存最少的
    const selectedVariantItems = Object.entries(selectedVariants).map(([type, value]) => 
      product.variants?.find(v => v.type === type && v.value === value)
    ).filter(Boolean);
    
    if (selectedVariantItems.length === 0) return product.stock || 0;
    
    const minStock = Math.min(
      ...selectedVariantItems.map(v => v?.stock || product.stock || 0)
    );
    
    return Math.min(minStock, product.stock || 0);
  };

  const handleVariantSelect = (type: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxStock = getCurrentStock();
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = () => {
    // 检查是否已选择所有必需的变体
    if (product.variants) {
      const requiredVariants = Array.from(new Set(product.variants.map(v => v.type)));
      const missingVariants = requiredVariants.filter(type => !selectedVariants[type]);
      
      if (missingVariants.length > 0) {
        alert(`请选择${missingVariants.join('、')}`);
        return;
      }
    }

    onConfirm(selectedVariants, quantity);
    onClose();
  };

  // 渲染变体选择器
  const renderVariantSelector = (type: string, variants: ProductVariant[]) => {
    const typeVariants = variants.filter(v => v.type === type);
    const displayName = type === 'color' ? '颜色' : type === 'size' ? '尺寸' : '选项';
    
    return (
      <div key={type} className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">{displayName}</h3>
        <div className="flex flex-wrap gap-2">
          {typeVariants.map(variant => {
            const isSelected = selectedVariants[type] === variant.value;
            const isOutOfStock = (variant.stock || 0) <= 0;
            
            return (
              <button
                key={variant.id}
                onClick={() => !isOutOfStock && handleVariantSelect(type, variant.value)}
                disabled={isOutOfStock}
                className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                  isOutOfStock
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {variant.value}
                {isOutOfStock && <span className="ml-1 text-xs">(缺货)</span>}
                {variant.priceModifier && variant.priceModifier !== 0 && (
                  <span className="ml-1 text-xs">
                    {variant.priceModifier > 0 ? '+' : ''}¥{variant.priceModifier.toFixed(2)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const currentStock = getCurrentStock();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 弹框内容 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">选择规格</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            title="关闭"
            aria-label="关闭规格选择弹框"
          >
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 滚动内容区域 */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* 商品信息 */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 rounded-md object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-red-600">¥{currentPrice.toFixed(2)}</span>
                  {currentPrice !== product.price && (
                    <span className="text-sm text-gray-500 line-through">¥{product.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  库存：{currentStock}件
                </div>
              </div>
            </div>
          </div>

          {/* 规格选择 */}
          <div className="p-4">
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                {Array.from(new Set(product.variants.map(v => v.type))).map(type => 
                  renderVariantSelector(type, product.variants!)
                )}
              </div>
            )}

            {/* 数量选择 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">数量</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="减少数量"
                  aria-label="减少数量"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= currentStock}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  title="增加数量"
                  aria-label="增加数量"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                总价：¥{(currentPrice * quantity).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            disabled={currentStock <= 0}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              currentStock <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : confirmText === '立即购买'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {currentStock <= 0 ? '暂无库存' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecModal; 