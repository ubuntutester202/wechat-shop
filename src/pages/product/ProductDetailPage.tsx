import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getProductById, 
  getProductReviews, 
  Product, 
  ProductVariant, 
  ProductReview 
} from '../../assets/data/mock/products';
import { useCartStore } from '../../stores/cartStore';
import StatusBar from '../../components/common/StatusBar';
import ProductSpecModal from '../../components/ui/ProductSpecModal';

/**
 * 商品详情页面组件
 * 参考淘宝商品详情页面设计，包含：
 * - 商品图片轮播
 * - 商品基本信息（标题、价格、评分）
 * - 规格选择（颜色、尺寸等）
 * - 库存信息
 * - 商品描述
 * - 用户评价
 * - 操作按钮（收藏、加购物车、立即购买）
 */
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  // 状态管理
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [isLoading, setIsLoading] = useState(true);
  
  // 弹框状态
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'cart' | 'buy'>('cart');

  // 获取商品数据
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      
      // 模拟API调用
      setTimeout(() => {
        const productData = getProductById(id);
        const reviewData = getProductReviews(id);
        
        if (productData) {
          setProduct(productData);
          setReviews(reviewData);
        }
        
        setIsLoading(false);
      }, 300);
    }
  }, [id]);

  // 处理返回按钮
  const handleGoBack = () => {
    navigate(-1);
  };

  // 处理图片切换
  const handleImageChange = (index: number) => {
    setSelectedImageIndex(index);
  };

  // 处理收藏
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: 调用收藏API
  };

  // 处理加入购物车按钮点击
  const handleAddToCartClick = () => {
    if (!product) return;
    setModalMode('cart');
    setIsSpecModalOpen(true);
  };

  // 处理立即购买按钮点击
  const handleBuyNowClick = () => {
    if (!product) return;
    setModalMode('buy');
    setIsSpecModalOpen(true);
  };

  // 处理规格选择确认
  const handleSpecConfirm = (selectedVariants: { [key: string]: string }, quantity: number) => {
    if (!product) return;

    // 添加到购物车
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      selectedVariants,
      stock: product.stock || 0
    });

    if (modalMode === 'cart') {
      alert('已添加到购物车');
    } else {
      // 立即购买：跳转到结算页面
      alert('跳转到结算页面'); // TODO: 实际实现
      // navigate('/checkout');
    }
  };

  // 渲染星级评分
  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ⭐
        </span>
      );
    }
    return stars;
  };



  // 渲染评价项
  const renderReviewItem = (review: ProductReview) => (
    <div key={review.id} className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3">
          {review.userAvatar && (
            <img 
              src={review.userAvatar} 
              alt={review.userName}
              className="w-full h-full rounded-full object-cover"
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{review.userName}</span>
            {review.verified && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">已购买</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex">
              {renderStarRating(review.rating)}
            </div>
            <span>{review.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
      <p className="text-gray-600 mb-2">{review.content}</p>
      {review.variant && (
        <span className="text-sm text-gray-500">已购买：{review.variant}</span>
      )}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-2">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`评价图片${index + 1}`}
              className="w-20 h-20 rounded-md object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StatusBar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StatusBar />
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-4">商品不存在</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  const currentImages = product.images || [product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />
      
      {/* 头部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            title="返回上一页"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">商品详情</h1>
          <button
            onClick={() => {/* TODO: 分享功能 */}}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            title="分享商品"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="pb-20">
        {/* 商品图片轮播 */}
        <div className="bg-white mb-2">
          <div className="aspect-square relative">
            <img
              src={currentImages[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.tags && product.tags.length > 0 && (
              <div className="absolute top-4 left-4">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs font-medium text-white mr-2 ${
                      tag === 'New' ? 'bg-blue-500' :
                      tag === 'Sale' ? 'bg-red-500' :
                      tag === 'Hot' ? 'bg-orange-500' : 'bg-gray-500'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* 图片导航 */}
          {currentImages.length > 1 && (
            <div className="flex justify-center py-3 gap-2">
              {currentImages.map((_, index) => (
                               <button
                 key={index}
                 onClick={() => handleImageChange(index)}
                 className={`w-3 h-3 rounded-full transition-colors ${
                   index === selectedImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                 }`}
                 title={`查看第${index + 1}张图片`}
               />
              ))}
            </div>
          )}
        </div>

        {/* 商品基本信息 */}
        <div className="bg-white px-4 py-6 mb-2">
          <h1 className="text-xl font-medium text-gray-900 mb-3">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">¥{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">¥{product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            {product.discount && (
              <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              {renderStarRating(product.rating || 0)}
              <span className="text-sm text-gray-600 ml-1">
                {product.rating?.toFixed(1)} ({product.reviews}条评价)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>库存: {product.stock || 0}件</span>
            <span>品牌: {product.brand || '暂无'}</span>
          </div>
        </div>



        {/* 标签页 */}
        <div className="bg-white">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-4 px-4 text-center font-medium ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              商品详情
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 px-4 text-center font-medium ${
                activeTab === 'reviews'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500'
              }`}
            >
              用户评价 ({reviews.length})
            </button>
          </div>

          <div className="px-4 py-6">
            {activeTab === 'details' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">商品描述</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description || '暂无商品描述'}
                  </p>
                </div>

                {product.specifications && product.specifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">商品规格</h3>
                    <div className="space-y-2">
                      {product.specifications.map((spec, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{spec.name}</span>
                          <span className="text-gray-900">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(product.shippingInfo || product.returnPolicy || product.warranty) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">服务保障</h3>
                    <div className="space-y-2">
                      {product.shippingInfo && (
                        <div className="flex gap-2">
                          <span className="text-green-600">🚚</span>
                          <span className="text-gray-600">{product.shippingInfo}</span>
                        </div>
                      )}
                      {product.returnPolicy && (
                        <div className="flex gap-2">
                          <span className="text-blue-600">🔄</span>
                          <span className="text-gray-600">{product.returnPolicy}</span>
                        </div>
                      )}
                      {product.warranty && (
                        <div className="flex gap-2">
                          <span className="text-yellow-600">🛡️</span>
                          <span className="text-gray-600">{product.warranty}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div>
                    {reviews.map(renderReviewItem)}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无用户评价
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
                 <button
           onClick={handleToggleFavorite}
           className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg ${
             isFavorite ? 'text-red-500' : 'text-gray-400'
           }`}
           title={isFavorite ? "取消收藏" : "收藏商品"}
         >
           <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>
         </button>
        
        <button
          onClick={handleAddToCartClick}
          className="flex-1 bg-yellow-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          加入购物车
        </button>
        
        <button
          onClick={handleBuyNowClick}
          className="flex-1 bg-red-500 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          立即购买
        </button>
      </div>

      {/* 规格选择弹框 */}
      {product && (
        <ProductSpecModal
          product={product}
          isOpen={isSpecModalOpen}
          onClose={() => setIsSpecModalOpen(false)}
          onConfirm={handleSpecConfirm}
          confirmText={modalMode === 'cart' ? '加入购物车' : '立即购买'}
        />
      )}
    </div>
  );
};

export default ProductDetailPage; 