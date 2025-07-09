import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusBar from "../../components/common/StatusBar";
import { Order } from "../../components/ui/OrderCard";

/**
 * 订单状态映射
 */
const statusMap = {
  pending: {
    label: "待付款",
    color: "text-orange-600 bg-orange-50",
    description: "请尽快完成支付，订单将为您保留30分钟",
  },
  paid: {
    label: "待发货",
    color: "text-blue-600 bg-blue-50",
    description: "商家正在为您准备商品，请耐心等待",
  },
  shipped: {
    label: "待收货",
    color: "text-green-600 bg-green-50",
    description: "商品已发货，请注意查收快递",
  },
  delivered: {
    label: "已完成",
    color: "text-gray-600 bg-gray-50",
    description: "订单已完成，感谢您的购买",
  },
  cancelled: {
    label: "已取消",
    color: "text-red-600 bg-red-50",
    description: "订单已取消",
  },
};

/**
 * 订单详情页面组件
 * 显示订单的完整信息，包括商品快照、地址、支付信息等
 */
const OrderDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 状态管理
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 处理返回
  const handleGoBack = () => {
    // 如果有订单信息，根据订单状态智能返回到对应的筛选页面
    if (order) {
      navigate(`/orders?status=${order.status}`);
    } else {
      // 如果没有订单信息，使用浏览器返回
      navigate(-1);
    }
  };

  // 获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/orders/${id}`);

        if (!response.ok) {
          throw new Error("获取订单详情失败");
        }

        const orderData: Order = await response.json();
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误");
        console.error("获取订单详情失败:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 格式化价格
  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  // 处理订单操作
  const handleOrderAction = (action: string) => {
    console.log(`执行订单操作: ${action}`, order?.id);
    // TODO: 实现具体的订单操作逻辑
  };

  // 处理商品点击 - 跳转到商品详情页
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StatusBar />
        <div className="pt-12 px-4 py-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="bg-white rounded-lg p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="flex space-x-3">
                <div className="w-16 h-16 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StatusBar />
        <div className="pt-12 px-4 py-4">
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 mb-4 text-red-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">订单不存在</p>
            <p className="text-gray-400 text-sm mb-6">
              {error || "找不到指定的订单信息"}
            </p>
            <button
              onClick={handleGoBack}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusMap[order.status];
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />

      {/* 页面头部 */}
      <div className="bg-white shadow-sm pt-12">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={handleGoBack}
            className="mr-3 p-2 -ml-2 text-gray-600 hover:text-gray-900"
            title="返回上一页"
            aria-label="返回上一页"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">订单详情</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 订单状态卡片 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3">{statusInfo.description}</p>

          <div className="text-sm text-gray-500 space-y-1">
            <div>订单号: {order.orderNumber}</div>
            {order.shipping.trackingNumber && (
              <div>快递单号: {order.shipping.trackingNumber}</div>
            )}
          </div>
        </div>

        {/* 商品信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">商品信息</h3>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-3 -mx-3 transition-colors"
                onClick={() => handleProductClick(item.productId)}
                title="点击查看商品详情"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                    {item.name}
                  </h4>

                  {/* 商品规格 */}
                  {item.selectedVariants &&
                    Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-xs text-gray-500 mb-2">
                        {Object.entries(item.selectedVariants).map(
                          ([key, value]) => (
                            <span key={key} className="mr-3">
                              {key}: {value}
                            </span>
                          )
                        )}
                      </div>
                    )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      x{item.quantity}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 价格汇总 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>商品总价</span>
              <span>
                {formatPrice(
                  order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )
                )}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
              <span>运费</span>
              <span>{formatPrice(order.shipping.fee)}</span>
            </div>
            <div className="flex justify-between items-center text-base font-semibold text-gray-900">
              <span>实付款</span>
              <span className="text-red-600">
                {formatPrice(order.payment.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* 收货地址卡片 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">收货地址</h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-900">
                {order.address.name}
              </span>
              <span className="text-gray-600">{order.address.phone}</span>
            </div>
            <div className="text-gray-600 leading-relaxed">
              {order.address.province} {order.address.city}{" "}
              {order.address.district}
              <br />
              {order.address.detail}
            </div>
          </div>
        </div>

        {/* 支付信息卡片 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">支付信息</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">支付方式</span>
              <span className="text-gray-900">微信支付</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">商品总数</span>
              <span className="text-gray-900">{totalItems} 件</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">配送方式</span>
              <span className="text-gray-900">{order.shipping.method}</span>
            </div>
            {order.payment.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">支付时间</span>
                <span className="text-gray-900">
                  {formatDate(order.payment.paidAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 订单操作按钮 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex space-x-3">
            {order.status === "pending" && (
              <>
                <button
                  onClick={() => handleOrderAction("cancel")}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消订单
                </button>
                <button
                  onClick={() => handleOrderAction("pay")}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  立即付款
                </button>
              </>
            )}

            {order.status === "shipped" && (
              <>
                <button
                  onClick={() => handleOrderAction("logistics")}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  查看物流
                </button>
                <button
                  onClick={() => handleOrderAction("confirm")}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  确认收货
                </button>
              </>
            )}

            {order.status === "delivered" && (
              <>
                <button
                  onClick={() => handleOrderAction("review")}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  评价商品
                </button>
                <button
                  onClick={() => handleOrderAction("rebuy")}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  再次购买
                </button>
              </>
            )}

            {(order.status === "delivered" || order.status === "paid") && (
              <button
                onClick={() => handleOrderAction("contact")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                联系客服
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
