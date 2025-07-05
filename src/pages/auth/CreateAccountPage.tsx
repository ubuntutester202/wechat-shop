import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBar from "../../components/common/StatusBar";
import Button from "../../components/ui/Button";

/**
 * 创建账户页面组件 - 对应Figma设计稿："02 Create Account"页面
 * 包含用户注册表单，头像上传功能
 */
const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();

  // 表单状态管理
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
  });

  // 密码可见性状态
  const [showPassword, setShowPassword] = useState(false);

  // 头像上传状态
  const [avatar, setAvatar] = useState<string | null>(null);

  // 处理取消按钮点击
  const handleCancel = () => {
    navigate(-1); // 返回上一页
  };

  // 处理表单输入变化
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 处理密码可见性切换
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 处理头像上传
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理完成按钮点击
  const handleDone = () => {
    // 这里可以添加表单验证和提交逻辑
    console.log("Form submitted:", formData);
    // 跳转到下一页面（例如：主页或邮箱验证页）
    navigate("/shop");
  };

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* 装饰背景气泡 */}
      <div className="absolute -top-52 -left-32 w-[659px] h-[513px] pointer-events-none">
        <div className="absolute top-0 left-0 w-[426px] h-[457px] bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute top-60 right-0 w-[244px] h-[267px] bg-primary rounded-full opacity-80"></div>
      </div>

      {/* 状态栏 */}
      <StatusBar />

      {/* 主要内容区域 */}
      <div className="container-mobile min-h-screen flex flex-col pt-20 pb-8 safe-area-top safe-area-bottom relative z-10">
        {/* 顶部导航区域 */}
        <div className="flex justify-between items-center mb-8">
          {/* 底部指示器条 */}
          <div className="w-[134px] h-[5px] bg-black rounded-full opacity-30"></div>
        </div>

        {/* 主标题 */}
        <div className="mb-16">
          <h1 className="font-raleway font-bold text-5xl leading-[1.08] tracking-tight text-text-primary whitespace-pre-line">
            {"Create\nAccount"}
          </h1>
        </div>

        {/* 头像上传区域 */}
        <div className="mb-12">
          <div className="w-[90px] h-[90px] relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              aria-label="上传头像"
            />
            <div className="w-full h-full border-2 border-dashed border-primary rounded-full bg-background-primary flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt="用户头像"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-[34px] h-[28px] relative">
                  {/* 相机图标 */}
                  <svg
                    width="34"
                    height="28"
                    viewBox="0 0 34 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30.6 6.3H26.9L24.8 3.5C24.4 2.9 23.7 2.5 23 2.5H11C10.3 2.5 9.6 2.9 9.2 3.5L7.1 6.3H3.4C1.5 6.3 0 7.8 0 9.7V23.8C0 25.7 1.5 27.2 3.4 27.2H30.6C32.5 27.2 34 25.7 34 23.8V9.7C34 7.8 32.5 6.3 30.6 6.3Z"
                      stroke="#004CFF"
                      strokeWidth="2"
                    />
                    <path
                      d="M17 21.8C20.3 21.8 23 19.1 23 15.8C23 12.5 20.3 9.8 17 9.8C13.7 9.8 11 12.5 11 15.8C11 19.1 13.7 21.8 17 21.8Z"
                      stroke="#004CFF"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="space-y-2 mb-16">
          {/* Email输入框 */}
          <div className="w-full">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full h-[52px] px-5 py-4 bg-gray-50 rounded-[59px] border-none outline-none font-medium text-sm placeholder-gray-400 focus:bg-gray-100 transition-colors"
              aria-label="邮箱地址"
            />
          </div>

          {/* Password输入框 */}
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full h-[52px] px-5 py-4 pr-12 bg-gray-50 rounded-[59px] border-none outline-none font-medium text-sm placeholder-gray-400 focus:bg-gray-100 transition-colors"
              aria-label="密码"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 w-4 h-4"
              aria-label={showPassword ? "隐藏密码" : "显示密码"}
            >
              {/* 眼睛图标 */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {showPassword ? (
                  <g stroke="#1F1F1F" strokeWidth="1">
                    <path d="M9.88 9.88a3 3 0 01-4.24-4.24" />
                    <path d="M6.06 6.06L4.4 4.4m7.2 7.2l1.66 1.66m-11.72 0L3.2 11.6M8 5.2c2.76 0 5.2 1.64 6.4 2.8-1.2 1.16-3.64 2.8-6.4 2.8" />
                    <path d="M2.4 8c1.2-1.16 3.64-2.8 6.4-2.8" />
                    <path d="M2.4 2.4l11.2 11.2" />
                  </g>
                ) : (
                  <g stroke="#1F1F1F" strokeWidth="1">
                    <path d="M8 3.2c2.76 0 5.2 1.64 6.4 2.8C13.2 7.16 10.76 8.8 8 8.8S2.8 7.16 1.6 6C2.8 4.84 5.24 3.2 8 3.2z" />
                    <circle cx="8" cy="6" r="1.6" />
                  </g>
                )}
              </svg>
            </button>
          </div>

          {/* Phone Number输入框 */}
          <div className="w-full">
            <div className="w-full h-[55px] px-5 py-4 bg-gray-50 rounded-[59px] flex items-center gap-4">
              {/* 国旗和下拉箭头 */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-4 bg-red-500 rounded-sm overflow-hidden">
                  {/* 简化的英国国旗 */}
                  <div className="w-full h-full bg-gradient-to-b from-white/70 to-black/30"></div>
                </div>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.59 0.59L6 5.17L1.41 0.59L0 2L6 8L12 2L10.59 0.59Z"
                    fill="#1F1F1F"
                  />
                </svg>
              </div>

              {/* 分隔线 */}
              <div className="w-px h-6 bg-gray-300"></div>

              {/* 电话号码输入 */}
              <input
                type="tel"
                placeholder="Your number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="flex-1 bg-transparent border-none outline-none font-medium text-sm placeholder-gray-400"
                aria-label="电话号码"
              />
            </div>
          </div>
        </div>

        {/* Done按钮 */}
        <div className="mb-8">
          <Button
            variant="primary"
            size="large"
            onClick={handleDone}
            className="w-full h-[61px] bg-primary text-white font-nunito font-light text-xl rounded-2xl"
          >
            Done
          </Button>
        </div>
        {/* 取消按钮 */}
        <button
          onClick={handleCancel}
          className="text-text-primary font-nunito font-light text-sm opacity-90 hover:opacity-100 transition-opacity relative z-[60]"
          aria-label="取消创建账户"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateAccountPage;
