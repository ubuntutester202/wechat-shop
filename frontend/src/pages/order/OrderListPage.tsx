import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StatusBar from "../../components/common/StatusBar";
import OrderCard, { Order } from "../../components/ui/OrderCard";

/**
 * 订单状态选项
 */
const statusOptions = [
  { value: "", label: "全部" },
  { value: "pending", label: "待付款" },
  { value: "paid", label: "待发货" },
  { value: "shipped", label: "待收货" },
  { value: "delivered", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

/**
 * 分页响应接口
 */
interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 订单列表页面组件
 * 支持无限滚动、状态筛选
 */
const OrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 从URL参数获取状态筛选
  const urlParams = new URLSearchParams(location.search);
  const initialStatus = urlParams.get("status") || "";

  // 状态管理
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);

  // 处理返回
  const handleGoBack = () => {
    navigate("/profile");
  };

  // 获取订单列表
  const fetchOrders = useCallback(
    async (pageNum: number, status: string = "", reset: boolean = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "10",
        });

        if (status) {
          params.append("status", status);
        }

        const response = await fetch(`/api/orders?${params}`);

        if (!response.ok) {
          throw new Error("获取订单列表失败");
        }

        const data: OrderListResponse = await response.json();

        setOrders((prev) => (reset ? data.orders : [...prev, ...data.orders]));
        setHasMore(pageNum < data.pagination.totalPages);
        setPage(pageNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : "未知错误");
        console.error("获取订单列表失败:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  // 处理状态筛选变化
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setOrders([]);
    setPage(1);
    setHasMore(true);
    fetchOrders(1, status, true);

    // 更新URL参数
    const newParams = new URLSearchParams();
    if (status) {
      newParams.set("status", status);
    }
    navigate(`/orders?${newParams.toString()}`, { replace: true });
  };

  // 无限滚动处理
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 当滚动到底部100px时加载更多
    if (scrollTop + windowHeight >= documentHeight - 100) {
      fetchOrders(page + 1, selectedStatus);
    }
  }, [loading, hasMore, page, selectedStatus, fetchOrders]);

  // 初始化加载和滚动监听
  useEffect(() => {
    fetchOrders(1, selectedStatus, true);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 处理订单卡片点击
  const handleOrderClick = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  // 刷新订单列表
  const handleRefresh = () => {
    setOrders([]);
    setPage(1);
    setHasMore(true);
    fetchOrders(1, selectedStatus, true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />

      {/* 页面头部 */}
      <div className="bg-white shadow-sm pt-12">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
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
            <h1 className="text-lg font-semibold text-gray-900">我的订单</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900"
            disabled={loading}
            title="刷新订单列表"
            aria-label="刷新订单列表"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>
        </div>

        {/* 状态筛选标签 */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                  selectedStatus === option.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 订单列表内容 */}
      <div className="px-4 py-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="text-red-700">{error}</span>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              重试
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && orders.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">暂无订单</p>
            <p className="text-gray-400 text-sm mb-6">快去挑选心仪的商品吧</p>
            <button
              onClick={() => navigate("/shop")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              去购物
            </button>
          </div>
        )}

        {/* 订单列表 */}
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onClick={handleOrderClick} />
        ))}

        {/* 加载更多状态 */}
        {loading && orders.length > 0 && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>加载中...</span>
            </div>
          </div>
        )}

        {/* 首次加载状态 */}
        {loading && orders.length === 0 && !error && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 没有更多数据提示 */}
        {!loading && !hasMore && orders.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">没有更多订单了</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListPage;
