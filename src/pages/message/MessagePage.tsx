import React from "react";

/**
 * 消息页面组件
 */
const MessagePage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">消息中心</h1>
      <div className="text-gray-500 text-center py-8">
        <p>暂无新消息</p>
      </div>
    </div>
  );
};

export default MessagePage; 