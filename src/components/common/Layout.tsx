import React from "react";
import { Outlet } from "react-router-dom";
import StatusBar from "./StatusBar";
import BottomNavigation from "./BottomNavigation";

/**
 * 主布局组件
 * 包含Header (状态栏), 主内容区域, Footer (底部导航)
 */
const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - 状态栏 */}
      <StatusBar />
      
      {/* Main Content - 主要内容区域 */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      {/* Footer - 底部导航 */}
      <BottomNavigation />
    </div>
  );
};

export default Layout; 