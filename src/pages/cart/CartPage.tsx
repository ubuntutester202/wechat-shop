import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, CartItem } from '../../stores/cartStore';
import StatusBar from '../../components/common/StatusBar';
import BottomNavigation from '../../components/common/BottomNavigation';

/**
 * 购物车页面组件
 * 显示购物车中的商品列表、总价，并提供管理购物车的操作
 */
const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    selectedTotalItems,
    selectedTotalPrice,
    updateQuantity, 
    removeItem, 
    clearCart,
    toggleItemSelection,
    toggleAllSelection,
    getSelectedItems
  } = useCartStore();

  // 处理返回
  const handleGoBack = () => {
    navigate(-1);
  };

  // 处理数量变化
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };

  // 处理移除商品
  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  // 跳转到商品详情
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // 处理商品勾选
  const handleItemSelection = (itemId: string) => {
    toggleItemSelection(itemId);
  };

  // 处理全选
  const handleSelectAll = () => {
    toggleAllSelection();
  };

  // 跳转到结算页面
  const handleCheckout = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      alert('请选择要结算的商品');
      return;
    }
    navigate('/checkout');
  };

  // 检查是否全选
  const isAllSelected = items.length > 0 && items.every(item => item.selected);
  const hasSelectedItems = items.some(item => item.selected);

  // 渲染购物车项目
  const renderCartItem = (item: CartItem) => (
    <div key={item.id} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow-sm mb-3">
      {/* 选择框 */}
      <div className="flex items-center pt-2">
        <button
          onClick={() => handleItemSelection(item.id)}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            item.selected 
              ? 'border-red-500 bg-red-500' 
              : 'border-gray-300'
          }`}
          title={item.selected ? '取消选择' : '选择商品'}
        >
          {item.selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* 商品图片 */}
      <div 
        className="w-24 h-24 rounded-md bg-gray-200 cursor-pointer"
        onClick={() => handleProductClick(item.productId)}
      >
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      {/* 商品信息 */}
      <div className="flex-1">
        <p 
          className="font-medium text-gray-900 mb-1 line-clamp-2 cursor-pointer"
          onClick={() => handleProductClick(item.productId)}
        >
          {item.name}
        </p>
        <div className="text-sm text-gray-500 mb-2">
          {Object.entries(item.selectedVariants).map(([type, value]) => (
            <span key={type} className="mr-2">{`${type}: ${value}`}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-red-600">¥{item.price.toFixed(2)}</span>
          
          {/* 数量调整 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              title="减少数量"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
            </button>
            <span className="text-md font-medium w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              title="增加数量"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移除按钮 */}
      <button 
        onClick={() => handleRemoveItem(item.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
        title="移除商品"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />
      
      {/* 头部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            title="返回"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">购物车 ({totalItems})</h1>
          <button
            onClick={clearCart}
            className="text-sm font-medium text-gray-600 hover:text-red-600"
          >
            清空
          </button>
        </div>
        
        {/* 全选栏 */}
        {items.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isAllSelected 
                    ? 'border-red-500 bg-red-500' 
                    : 'border-gray-300'
                }`}
                title={isAllSelected ? '取消全选' : '全选'}
              >
                {isAllSelected && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <span className="text-sm text-gray-900">全选</span>
            </div>
            <div className="text-sm text-gray-500">
              已选择 {selectedTotalItems} 件商品
            </div>
          </div>
        )}
      </div>
      
      {/* 主要内容 */}
      <div className="p-4 pb-40">
        {items.length > 0 ? (
          items.map(renderCartItem)
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 mb-6">购物车是空的</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              去逛逛
            </button>
          </div>
        )}
      </div>
      
      {/* 底部结算栏 */}
      {items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">
                合计 ({selectedTotalItems} 件):
              </div>
              <div className="text-right">
                <span className="font-bold text-red-600 text-xl">¥{selectedTotalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className={`w-full font-medium py-3 px-8 rounded-lg transition-colors ${
                hasSelectedItems
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasSelectedItems}
            >
              结算 ({selectedTotalItems})
            </button>
          </div>
        </div>
      )}
      <BottomNavigation />
    </div>
  );
};

export default CartPage; 