import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../../stores/cartStore';
import StatusBar from '../../components/common/StatusBar';

// 地址表单数据类型
interface AddressForm {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
}

// 配送费和优惠券类型
interface OrderCalculation {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

/**
 * 结算页面组件
 * 包含地址选择、商品确认、价格计算和支付功能
 */
const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { getSelectedItems, selectedTotalPrice, selectedTotalItems } = useCartStore();
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // 获取选中的商品
  const selectedItems = getSelectedItems();

  // 表单管理
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<AddressForm>({
    defaultValues: {
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园南区深南大道9988号'
    }
  });

  // 订单计算 (Mock数据)
  const orderCalculation: OrderCalculation = {
    subtotal: selectedTotalPrice,
    shipping: selectedTotalPrice >= 99 ? 0 : 10, // 满99免运费
    discount: 0, // 暂无优惠
    total: selectedTotalPrice + (selectedTotalPrice >= 99 ? 0 : 10)
  };

  // 处理返回
  const handleGoBack = () => {
    navigate(-1);
  };

  // 地址表单提交
  const onAddressSubmit = (data: AddressForm) => {
    console.log('地址信息:', data);
    setIsEditingAddress(false);
  };

  // 手机号校验
  const phoneValidation = {
    required: '请输入手机号',
    pattern: {
      value: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号'
    }
  };

  // 处理支付
  const handlePayment = async () => {
    if (selectedItems.length === 0) {
      alert('请选择要结算的商品');
      return;
    }
    
    try {
      // 生成订单ID
      const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 准备支付数据
      const paymentData = {
        orderId,
        amount: Math.round(orderCalculation.total * 100), // 转换为分
        description: `商品购买-${selectedItems.length}件商品`,
        openid: 'mock_openid_' + Date.now(), // 模拟openid
      };

      console.log('创建支付订单:', paymentData);

      // 调用后端创建支付订单
      const response = await fetch('/api/pay/wxpay/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证token
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('创建支付订单失败');
      }

      const paymentParams = await response.json();
      console.log('支付参数:', paymentParams);

      // 构建支付页面URL参数
      const searchParams = new URLSearchParams();
      searchParams.set('orderId', orderId);
      searchParams.set('amount', paymentData.amount.toString());
      searchParams.set('description', paymentData.description);
      
      // 添加微信支付参数
      Object.entries(paymentParams).forEach(([key, value]) => {
        searchParams.set(key, value as string);
      });

      // 使用React Router导航到支付页面
      navigate(`/payment/process?${searchParams.toString()}`);
      
    } catch (error) {
      console.error('支付失败:', error);
      alert('支付失败，请重试');
    }
  };

  // 如果没有选中商品，跳转回购物车
  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">没有选中的商品</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            返回购物车
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-medium text-gray-900">确认订单</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pb-32">
        {/* 收货地址 */}
        <div className="bg-white mb-2 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-medium text-gray-900">收货地址</h2>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-blue-600 text-sm"
            >
              {isEditingAddress ? '取消' : '修改'}
            </button>
          </div>

          {!isEditingAddress ? (
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="font-medium">{watch('name')}</span>
                <span className="text-gray-600">{watch('phone')}</span>
              </div>
              <p className="text-gray-700 text-sm">
                {watch('province')} {watch('city')} {watch('district')} {watch('detail')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    {...register('name', { required: '请输入收货人姓名' })}
                    placeholder="收货人姓名"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    {...register('phone', phoneValidation)}
                    placeholder="手机号"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <select
                  {...register('province', { required: '请选择省份' })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="广东省">广东省</option>
                  <option value="北京市">北京市</option>
                  <option value="上海市">上海市</option>
                </select>
                <select
                  {...register('city', { required: '请选择城市' })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="深圳市">深圳市</option>
                  <option value="广州市">广州市</option>
                </select>
                <select
                  {...register('district', { required: '请选择区县' })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="南山区">南山区</option>
                  <option value="福田区">福田区</option>
                </select>
              </div>
              
              <div>
                <textarea
                  {...register('detail', { required: '请输入详细地址' })}
                  placeholder="详细地址"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.detail && <p className="text-red-500 text-xs mt-1">{errors.detail.message}</p>}
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                保存地址
              </button>
            </form>
          )}
        </div>

        {/* 商品列表 */}
        <div className="bg-white mb-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-medium text-gray-900">商品清单 ({selectedTotalItems}件)</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.entries(item.selectedVariants).map(([type, value]) => (
                      <span key={type} className="mr-2">{`${type}: ${value}`}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-red-600 font-medium">¥{item.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-sm">×{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 费用明细 */}
        <div className="bg-white mb-2 px-4 py-4">
          <h2 className="text-base font-medium text-gray-900 mb-3">费用明细</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">商品小计</span>
              <span>¥{orderCalculation.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">运费</span>
              <span>{orderCalculation.shipping === 0 ? '免运费' : `¥${orderCalculation.shipping.toFixed(2)}`}</span>
            </div>
            {orderCalculation.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>优惠券</span>
                <span>-¥{orderCalculation.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-base">
              <span>实付款</span>
              <span className="text-red-600">¥{orderCalculation.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部支付栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">实付款</p>
            <p className="font-bold text-red-600 text-lg">¥{orderCalculation.total.toFixed(2)}</p>
          </div>
          <button
            onClick={handlePayment}
            className="bg-red-500 text-white font-medium py-3 px-8 rounded-lg hover:bg-red-600 transition-colors"
          >
            去支付
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;