import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

interface PaymentParams {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
  prepayId: string;
}

const PaymentProcessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentParams, setPaymentParams] = useState<PaymentParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // 从URL参数获取支付参数
    const params = {
      appId: searchParams.get('appId') || '',
      timeStamp: searchParams.get('timeStamp') || '',
      nonceStr: searchParams.get('nonceStr') || '',
      package: searchParams.get('package') || '',
      signType: searchParams.get('signType') || '',
      paySign: searchParams.get('paySign') || '',
      prepayId: searchParams.get('prepayId') || '',
    };

    if (params.appId && params.prepayId) {
      setPaymentParams(params);
    }
    setLoading(false);
  }, [searchParams]);

  const handleMockPayment = async () => {
    if (!paymentParams) return;

    setProcessing(true);

    try {
      // 模拟支付处理时间
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟支付成功（90%成功率）
      const isSuccess = Math.random() > 0.1;
      
      const orderId = searchParams.get('orderId') || 'unknown';
      const amount = parseInt(searchParams.get('amount') || '0');

      if (isSuccess) {
        // 触发后端模拟回调
        try {
          const response = await fetch(`/api/pay/wxpay/mock-callback/${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            console.log('模拟支付回调触发成功');
          }
        } catch (error) {
          console.error('触发模拟回调失败:', error);
        }

        // 跳转到支付成功页面
        navigate(`/payment/result?success=true&orderId=${orderId}&amount=${amount}&transactionId=wx_mock_${Date.now()}&message=支付成功！`);
      } else {
        // 跳转到支付失败页面
        navigate(`/payment/result?success=false&orderId=${orderId}&amount=${amount}&message=支付失败，请重试`);
      }
    } catch (error) {
      console.error('支付处理失败:', error);
      navigate(`/payment/result?success=false&orderId=${searchParams.get('orderId')}&amount=${searchParams.get('amount')}&message=支付处理异常`);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // 返回上一页
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!paymentParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">支付参数不完整</p>
          <button
            onClick={handleCancel}
            className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* 支付图标 */}
        <div className="text-center mb-6">
          <CreditCard className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">微信支付</h1>
          <p className="text-gray-600 mt-2">请确认支付信息</p>
        </div>

        {/* 支付信息 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">订单号：</span>
              <span className="font-medium">{searchParams.get('orderId')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">支付金额：</span>
              <span className="font-bold text-red-600 text-lg">
                ¥{((parseInt(searchParams.get('amount') || '0')) / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">商品描述：</span>
              <span className="font-medium">{searchParams.get('description') || '商品购买'}</span>
            </div>
          </div>
        </div>

        {/* 支付参数信息（开发模式显示） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">支付参数（开发模式）</h3>
            <div className="text-xs text-blue-600 space-y-1">
              <div>AppID: {paymentParams.appId}</div>
              <div>PrepayID: {paymentParams.prepayId}</div>
              <div>TimeStamp: {paymentParams.timeStamp}</div>
              <div>NonceStr: {paymentParams.nonceStr}</div>
              <div>SignType: {paymentParams.signType}</div>
            </div>
          </div>
        )}

        {/* 模拟支付说明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>模拟支付模式</strong><br />
            这是模拟支付环境，点击"确认支付"将模拟支付流程。
            实际不会产生真实扣费。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={handleMockPayment}
            disabled={processing}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              processing
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                处理中...
              </div>
            ) : (
              '确认支付'
            )}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={processing}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            取消支付
          </button>
        </div>

        {/* 安全提示 */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            支付过程受SSL加密保护，您的信息安全有保障
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessPage;