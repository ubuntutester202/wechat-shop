import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../../components/common/StatusBar";

/**
 * 登录页面组件 - 对应Figma设计稿："03 Login"页面
 * 用户登录界面，包含邮箱输入和登录按钮
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // 表单状态管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 处理取消按钮点击 - 返回创建账户页面
  const handleCancel = () => {
    navigate("/auth/register");
  };

  // 处理邮箱输入变化
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // 处理密码输入变化
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 处理Next按钮点击
  const handleNext = () => {
    // 这里可以添加登录验证逻辑
    console.log("Login attempt with:", { email, password });
    // TODO: 实现登录逻辑，成功后跳转到主页面
    navigate("/shop");
  };

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* 装饰背景气泡 - 按照Figma设计稿的气泡位置和颜色 */}
      <div className="absolute -top-44 -left-40 w-[782px] h-[1113px] pointer-events-none">
        {/* bubble 01 - 蓝色气泡 */}
        <div className="absolute top-0 left-0 w-[403px] h-[443px] bg-primary rounded-full opacity-80"></div>

        {/* bubble 02 - 浅蓝色气泡 */}
        <div className="absolute top-0 left-[22px] w-[512px] h-[550px] bg-blue-100 rounded-full opacity-60"></div>

        {/* bubble 03 - 小蓝色气泡 */}
        <div className="absolute top-[411px] left-[440px] w-[187px] h-[194px] bg-primary rounded-full opacity-80"></div>

        {/* bubble 04 - 浅色气泡 */}
        <div className="absolute top-[621px] left-[246px] w-[536px] h-[492px] bg-blue-50 rounded-full opacity-60"></div>
      </div>

      {/* 状态栏 */}
      <StatusBar />

      {/* 主要内容区域 */}
      <div className="container-mobile min-h-screen flex flex-col pt-20 pb-8 safe-area-top safe-area-bottom relative z-10">
        {/* 顶部指示器条 */}
        <div className="flex justify-start mb-16">
          <div className="w-[134px] h-[5px] bg-black rounded-full opacity-30"></div>
        </div>

        {/* 主标题区域 */}
        <div className="mb-8">
          <h1 className="font-raleway font-bold text-5xl leading-[1.17] tracking-tight text-text-primary mb-4">
            Login
          </h1>

          {/* 副标题和心形图标 */}
          <div className="flex items-center gap-2">
            <p className="font-nunito font-light text-[19px] leading-[1.84] text-text-primary">
              Good to see you back!
            </p>
            {/* 心形图标 */}
            <div className="w-4 h-4">
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.2 14.3L7.05 13.27C3.4 10.04 1 7.89 1 5.3C1 3.15 2.69 1.5 4.9 1.5C6.13 1.5 7.31 2.09 8 3.01C8.69 2.09 9.87 1.5 11.1 1.5C13.31 1.5 15 3.15 15 5.3C15 7.89 12.6 10.04 8.95 13.27L8.2 14.3Z"
                  fill="#000000"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="mb-8 flex-1">
          <div className="space-y-6">
            {/* Email输入框 */}
            <div className="w-full">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                className="w-full h-[52px] px-5 py-4 bg-gray-50 rounded-[59px] border-none outline-none font-medium text-sm placeholder-gray-400 focus:bg-gray-100 transition-colors"
                aria-label="邮箱地址"
              />
            </div>

            {/* Password输入框 */}
            <div className="w-full relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full h-[52px] px-5 py-4 bg-gray-50 rounded-[59px] border-none outline-none font-medium text-sm placeholder-gray-400 focus:bg-gray-100 transition-colors"
                aria-label="密码"
              />
            </div>
          </div>

          {/* Next按钮 */}
          <div className="w-full mt-6">
            <button
              onClick={handleNext}
              className="w-full h-[61px] bg-primary text-gray-100 rounded-2xl font-nunito font-light text-[22px] leading-[1.41] hover:bg-primary-600 transition-colors active:bg-primary-700"
              aria-label="下一步登录"
            >
              Next
            </button>
          </div>
        </div>

        {/* 底部Cancel按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleCancel}
            className="font-nunito font-light text-[15px] leading-[1.73] text-text-primary opacity-90 hover:opacity-100 transition-opacity"
            aria-label="取消登录"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
