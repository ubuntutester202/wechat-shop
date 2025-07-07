import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../../components/common/StatusBar";
import BottomNavigation from "../../components/common/BottomNavigation";

/**
 * Profile页面组件 - 个人中心页面
 * 提供用户信息管理和各种功能入口
 */
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // 主要功能菜单项
  const mainFeatures = [
    {
      id: "favorites",
      icon: (
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>
      ),
      label: "收藏",
      color: "text-red-500",
    },
    {
      id: "history",
      icon: (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
      label: "足迹",
      color: "text-green-500",
    },
    {
      id: "wallet",
      icon: (
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          ></path>
        </svg>
      ),
      label: "钱包",
      color: "text-purple-500",
    },
  ];

  // 订单状态项
  const orderStatuses = [
    {
      id: "pending_payment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      ),
      label: "待付款",
      color: "text-orange-500",
    },
    {
      id: "pending_shipment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      ),
      label: "待发货",
      color: "text-blue-500",
    },
    {
      id: "pending_delivery",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      label: "待收货",
      color: "text-green-500",
    },
    {
      id: "pending_review",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      label: "待评价",
      color: "text-yellow-500",
    },
    {
      id: "refund_service",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      label: "退款/售后",
      color: "text-red-500",
    },
  ];

  // 设置菜单项
  const settingsItems = [
    {
      id: "account",
      icon: (
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      ),
      label: "账户管理",
      description: "个人信息、密码设置",
    },
    {
      id: "address",
      icon: (
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      ),
      label: "收货地址",
      description: "管理您的收货地址",
    },
    {
      id: "notifications",
      icon: (
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
            d="M15 17h5l-5 5v-5zM10.6 14.4a9 9 0 01-5.2-5.2m5.2 5.2L15 20m-4.4-5.6c-1.1-1.1-1.6-2.7-1.6-4.4C9 7.8 10.8 6 13 6s4 1.8 4 4c0 1.7-.5 3.3-1.6 4.4"
          ></path>
        </svg>
      ),
      label: "消息通知",
      description: "推送和通知设置",
    },
    {
      id: "privacy",
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          ></path>
        </svg>
      ),
      label: "隐私设置",
      description: "数据和隐私保护",
    },
    {
      id: "help",
      icon: (
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
      label: "帮助中心",
      description: "常见问题和客服支持",
    },
  ];

  // 处理功能点击
  const handleFeatureClick = (featureId: string) => {
    console.log("点击功能:", featureId);
    switch (featureId) {
      case "favorites":
        // TODO: 导航到收藏页面
        break;
      case "history":
        // TODO: 导航到足迹页面
        break;
      case "wallet":
        // TODO: 导航到钱包页面
        break;
      default:
        break;
    }
  };

  // 处理订单状态点击
  const handleOrderStatusClick = (statusId: string) => {
    console.log("点击订单状态:", statusId);
    switch (statusId) {
      case "pending_payment":
        navigate("/orders?status=pending_payment");
        break;
      case "pending_shipment":
        navigate("/orders?status=pending_shipment");
        break;
      case "pending_delivery":
        navigate("/orders?status=pending_delivery");
        break;
      case "pending_review":
        navigate("/orders?status=pending_review");
        break;
      case "refund_service":
        navigate("/orders?status=refund_service");
        break;
      default:
        break;
    }
  };

  // 处理查看全部订单
  const handleViewAllOrders = () => {
    navigate("/orders");
  };

  // 处理设置项点击
  const handleSettingClick = (settingId: string) => {
    console.log("点击设置:", settingId);
    // TODO: 导航到相应设置页面
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StatusBar />

      {/* 主要内容区域 */}
      <div className="pb-20 pt-12">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            {/* 用户头像 */}
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>

            {/* 用户信息 */}
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">用户昵称</h2>
              <p className="text-blue-100 text-sm">点击查看和编辑个人资料</p>
            </div>
          </div>
        </div>

        {/* 订单卡片区域 */}
        <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          {/* 订单标题栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">我的订单</h3>
            <button
              onClick={handleViewAllOrders}
              className="flex items-center text-sm text-gray-500 hover:text-blue-600"
            >
              <span>全部</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          {/* 订单状态列表 */}
          <div className="grid grid-cols-5 gap-2 p-6">
            {orderStatuses.map((status) => (
              <div
                key={status.id}
                className="flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => handleOrderStatusClick(status.id)}
              >
                <div className={`p-3 rounded-full bg-gray-50 ${status.color}`}>
                  {status.icon}
                </div>
                <span className="text-xs text-gray-600 font-medium text-center">
                  {status.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 主要功能区域 */}
        <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-3 gap-4 p-6">
            {mainFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col items-center space-y-2 cursor-pointer"
                onClick={() => handleFeatureClick(feature.id)}
              >
                <div className={`p-3 rounded-full bg-gray-50 ${feature.color}`}>
                  {feature.icon}
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 设置菜单 */}
        <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
          {settingsItems.map((item, index) => (
            <div
              key={item.id}
              className={`px-6 py-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 ${
                index !== settingsItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              onClick={() => handleSettingClick(item.id)}
            >
              <div className="text-gray-400">{item.icon}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </div>
          ))}
        </div>

        {/* 退出登录按钮 */}
        <div className="mx-4 mt-6">
          <button className="w-full bg-white text-red-500 border border-red-200 rounded-lg py-3 px-4 font-medium hover:bg-red-50 transition-colors">
            退出登录
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
