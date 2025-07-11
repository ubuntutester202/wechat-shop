import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * 订单状态映射
 */
const statusMap = {
  pending: { label: "待付款", color: "text-orange-600 bg-orange-50" },
  paid: { label: "待发货", color: "text-blue-600 bg-blue-50" },
  shipped: { label: "待收货", color: "text-green-600 bg-green-50" },
  delivered: { label: "已完成", color: "text-gray-600 bg-gray-50" },
  cancelled: { label: "已取消", color: "text-red-600 bg-red-50" },
};

/**
 * 订单数据类型定义
 */
export interface Order {
  id: string;
  orderNumber: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    selectedVariants: { [key: string]: string };
  }>;
  address: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  payment: {
    method: string;
    amount: number;
    paidAt?: string;
  };
  shipping: {
    method: string;
    fee: number;
    trackingNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void;
}

/**
 * 订单卡片组件
 * 显示订单基本信息和第一个商品，支持点击跳转详情
 */
const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const navigate = useNavigate();

  // 处理卡片点击
  const handleCardClick = () => {
    if (onClick) {
      onClick(order);
    } else {
      navigate(`/orders/${order.id}`);
    }
  };

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

  // 获取第一个商品用于显示
  const firstItem = order.items[0];
  const hasMoreItems = order.items.length > 1;

  // 获取状态显示信息
  const statusInfo = statusMap[order.status];

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      {/* 订单头部信息 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">订单号:</span>
          <span className="text-sm font-medium text-gray-900">
            {order.orderNumber}
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* 商品信息 */}
      {firstItem && (
        <div className="flex items-start space-x-3 mb-3">
          <img
            src={firstItem.image}
            alt={firstItem.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 transition-colors">
              {firstItem.name}
            </h3>
            {/* 商品规格 */}
            {firstItem.selectedVariants &&
              Object.keys(firstItem.selectedVariants).length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  {Object.entries(firstItem.selectedVariants).map(
                    ([key, value]) => (
                      <span key={key} className="mr-2">
                        {key}: {value}
                      </span>
                    )
                  )}
                </div>
              )}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-500">
                x{firstItem.quantity}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {formatPrice(firstItem.price)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 更多商品提示 */}
      {hasMoreItems && (
        <div className="text-xs text-gray-500 mb-3 pl-19">
          还有 {order.items.length - 1} 件其他商品
        </div>
      )}

      {/* 订单底部信息 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {formatDate(order.createdAt)}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-600">
            共{order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品
          </span>
          <div className="text-right">
            <span className="text-xs text-gray-500">实付款: </span>
            <span className="text-sm font-semibold text-red-600">
              {formatPrice(order.payment.amount)}
            </span>
          </div>
        </div>
      </div>

      {/* 快速操作按钮（根据状态显示） */}
      <div className="flex justify-end space-x-2 mt-3">
        {(order.status === "pending" || order.status === "paid") && (
          <button
            className="text-xs px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 实现取消订单逻辑
              console.log("取消订单:", order.id);
            }}
          >
            取消订单
          </button>
        )}
        {order.status === "shipped" && (
          <button
            className="text-xs px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 实现查看物流逻辑
              console.log("查看物流:", order.shipping.trackingNumber);
            }}
          >
            查看物流
          </button>
        )}
        {order.status === "delivered" && (
          <button
            className="text-xs px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 实现评价逻辑
              console.log("评价订单:", order.id);
            }}
          >
            评价
          </button>
        )}
        <button
          className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          查看详情
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
