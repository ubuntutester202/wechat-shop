import React, { useRef, useState } from "react";

interface AvatarUploaderProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

/**
 * 头像上传组件
 * 支持点击上传、拖拽上传、预览功能
 */
const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  size = "md",
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 尺寸配置
  const sizeConfig = {
    sm: { container: "w-12 h-12", icon: "w-6 h-6" },
    md: { container: "w-16 h-16", icon: "w-8 h-8" },
    lg: { container: "w-24 h-24", icon: "w-12 h-12" },
  };

  const { container, icon } = sizeConfig[size];

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("图片大小不能超过5MB");
      return;
    }

    uploadFile(file);
  };

  // 模拟文件上传
  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      // 模拟上传过程
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 创建本地预览URL（实际项目中应该是服务器返回的URL）
      const previewUrl = URL.createObjectURL(file);
      onAvatarChange(previewUrl);

      // 在实际项目中，这里应该调用上传API
      // const formData = new FormData();
      // formData.append('avatar', file);
      // const response = await fetch('/api/upload/avatar', {
      //   method: 'POST',
      //   body: formData
      // });
      // const { avatarUrl } = await response.json();
      // onAvatarChange(avatarUrl);
    } catch (error) {
      console.error("上传失败:", error);
      alert("上传失败，请重试");
    } finally {
      setIsUploading(false);
    }
  };

  // 处理点击上传
  const handleClick = () => {
    if (disabled || isUploading) return;
    fileInputRef.current?.click();
  };

  // 处理文件输入变化
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // 处理拖拽
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled && !isUploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="relative inline-block">
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="选择头像图片"
      />

      {/* 头像容器 */}
      <div
        className={`
          ${container} relative cursor-pointer rounded-full overflow-hidden
          border-2 border-dashed transition-all duration-200
          ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : currentAvatar
              ? "border-transparent"
              : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "cursor-not-allowed opacity-50" : ""}
          ${isUploading ? "cursor-wait" : ""}
        `}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentAvatar ? (
          // 显示当前头像
          <img
            src={currentAvatar}
            alt="头像"
            className="w-full h-full object-cover"
          />
        ) : (
          // 显示默认占位符
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg
              className={`${icon} text-gray-400`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* 上传loading状态 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
        )}

        {/* 悬浮编辑提示 */}
        {!disabled && !isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 拖拽提示文字 */}
      {dragOver && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 whitespace-nowrap">
          释放以上传图片
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
