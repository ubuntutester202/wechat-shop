import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentResult {
  success: boolean;
  orderId: string;
  amount: number;
  transactionId?: string;
  message: string;
}

const PaymentResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从URL参数获取支付结果
    const success = searchParams.get('success') === 'true';
    const orderId = searchParams.get('orderId') || '';
    const amount = parseInt(searchParams.get('amount') || '0');
    const transactionId = searchParams.get('transactionId') || undefined;
    const message = searchParams.get('message') || '';

    setPaymentResult({
      success,
      orderId,
      amount,
      transactionId,
      message: message || (success ? '支付成功！' : '支付失败'),
    });
    setLoading(false);
  }, [searchParams]);

  const handleViewOrder = () => {
    if (paymentResult?.orderId) {
      navigate(`/order/${paymentResult.orderId}`);
    }
  };

  const handleBackToShop = () => {
    navigate('/shop');
  };

  const handleRetryPayment = () => {
    if (paymentResult?.orderId) {
      navigate(`/checkout?orderId=${paymentResult.orderId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">支付结果信息不完整</p>
          <button
            onClick={handleBackToShop}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            返回商城
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 支付结果图标 */}
        <div className="mb-6">
          {paymentResult.success ? (
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          ) : (
            <XCircle className="h-20 w-20 text-red-500 mx-auto" />
          )}
        </div>

        {/* 支付结果标题 */}
        <h1 className={`text-2xl font-bold mb-4 ${
          paymentResult.success ? 'text-green-600' : 'text-red-600'
        }`}>
          {paymentResult.success ? '支付成功' : '支付失败'}
        </h1>

        {/* 支付详情 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">订单号：</span>
              <span className="font-medium">{paymentResult.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">支付金额：</span>
              <span className="font-medium text-red-600">
                ¥{(paymentResult.amount / 100).toFixed(2)}
              </span>
            </div>
            {paymentResult.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">交易号：</span>
                <span className="font-medium text-sm">{paymentResult.transactionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">支付时间：</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 消息提示 */}
        <p className="text-gray-600 mb-6">{paymentResult.message}</p>

        {/* 操作按钮 */}
        <div className="space-y-3">
          {paymentResult.success ? (
            <>
              <button
                onClick={handleViewOrder}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看订单详情
              </button>
              <button
                onClick={handleBackToShop}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                继续购物
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                重新支付
              </button>
              <button
                onClick={handleBackToShop}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                返回商城
              </button>
            </>
          )}
        </div>

        {/* 客服联系 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            如有疑问，请联系客服：
            <a href="tel:400-123-4567" className="text-blue-600 hover:underline ml-1">
              400-123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;