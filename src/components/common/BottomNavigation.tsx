import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

/**
 * 底部导航栏组件
 * 提供应用主要功能模块的导航
 */
const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCartStore();

  // 导航项配置
  const navItems = [
    {
      id: 'home',
      path: '/shop',
      label: 'Home',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
      )
    },
    {
      id: 'cart',
      path: '/cart',
      label: 'Cart',
      badge: totalItems,
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    },
    {
      id: 'orders',
      path: '/orders',
      label: 'Orders',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      )
    },
    {
      id: 'profile',
      path: '/profile',
      label: 'Profile',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 mb-1 ${active ? 'text-blue-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      )
    }
  ];

  // 检查当前路径是否匹配导航项
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 处理导航点击
  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_4px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center cursor-pointer relative"
            onClick={() => handleNavClick(item.path)}
          >
            {item.icon(isActive(item.path))}
            <span className={`text-xs font-medium ${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`}>
              {item.label}
            </span>
            {/* 购物车徽章 */}
            {item.badge && item.badge > 0 && (
              <div className="absolute top-0 right-0 -mt-1 -mr-2">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {item.badge}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation; 