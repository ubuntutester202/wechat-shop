import React from 'react'

/**
 * 状态栏组件 - 模拟移动设备状态栏
 * 显示时间、信号、WiFi、电池等信息
 */
const StatusBar: React.FC = () => {
  // 获取当前时间
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-11 bg-background-primary flex items-center justify-between px-5 safe-area-top">
      {/* 时间显示 */}
      <div className="font-nunito font-semibold text-sm text-black">
        {currentTime}
      </div>

      {/* 右侧状态图标 */}
      <div className="flex items-center space-x-1">
        {/* 信号强度 */}
        <div className="flex items-end space-x-0.5">
          <div className="w-1 h-1 bg-black rounded-full"></div>
          <div className="w-1 h-1.5 bg-black rounded-full"></div>
          <div className="w-1 h-2 bg-black rounded-full"></div>
          <div className="w-1 h-2.5 bg-black rounded-full"></div>
        </div>

        {/* WiFi图标 */}
        <div className="w-4 h-3 relative ml-2">
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M7.5 0C3.36 0 0 1.64 0 3.67C0 4.47 0.67 5.2 1.5 5.67L7.5 11L13.5 5.67C14.33 5.2 15 4.47 15 3.67C15 1.64 11.64 0 7.5 0Z" fill="#000000"/>
          </svg>
        </div>

        {/* 电池图标 */}
        <div className="w-6 h-3 relative ml-2">
          <div className="w-5 h-3 border border-black rounded-sm relative">
            <div className="w-4 h-2 bg-black rounded-sm absolute top-0.5 left-0.5"></div>
          </div>
          <div className="w-0.5 h-1 bg-black rounded-sm absolute top-1 -right-0.5"></div>
        </div>
      </div>
    </div>
  )
}

export default StatusBar 