import React, { useEffect, useRef, useState } from "react";
import {
  createCOSUploader,
  type UploadProgress,
} from "../../utils/cosUploader";

interface AvatarUploaderProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

/**
 * 头像上传组件
 * 支持真实COS上传、进度显示、拖拽上传、取消功能
 */
const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  size = "md",
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );
  const [canCancel, setCanCancel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploaderRef = useRef(createCOSUploader());
  const currentTaskIdRef = useRef<string | null>(null);

  // 尺寸配置
  const sizeConfig = {
    sm: { container: "w-12 h-12", icon: "w-6 h-6" },
    md: { container: "w-16 h-16", icon: "w-8 h-8" },
    lg: { container: "w-24 h-24", icon: "w-12 h-12" },
  };

  const { container, icon } = sizeConfig[size];

  // 组件卸载时清理任务
  useEffect(() => {
    return () => {
      if (currentTaskIdRef.current) {
        uploaderRef.current.clearAllTasks();
      }
    };
  }, []);

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

  // 真实文件上传到COS
  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(null);
    setCanCancel(true);

    console.log("[Avatar Uploader] 开始上传头像", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    try {
      // 生成任务ID
      const taskId = `avatar_${Date.now()}_${Math.random()}`;
      currentTaskIdRef.current = taskId;

      // 调用COS上传
      const result = await uploaderRef.current.uploadFile({
        file,
        key: `avatar/${Date.now()}_${file.name}`, // 自定义文件路径
        onProgress: (progress: UploadProgress) => {
          console.log("[Avatar Uploader] 上传进度更新", progress);
          setUploadProgress(progress);
        },
        onSuccess: (result) => {
          console.log("[Avatar Uploader] 上传成功回调", result);
        },
        onError: (error) => {
          console.error("[Avatar Uploader] 上传错误回调", error);
        },
      });

      console.log("[Avatar Uploader] 头像上传完成", {
        taskId,
        url: result.url,
        key: result.key,
      });

      // 更新头像URL
      onAvatarChange(result.url);

      // 重置状态
      setUploadProgress(null);
      setCanCancel(false);
    } catch (error) {
      console.error("[Avatar Uploader] 头像上传失败", {
        taskId: currentTaskIdRef.current,
        error: error instanceof Error ? error.message : String(error),
      });

      alert(`上传失败: ${error instanceof Error ? error.message : "未知错误"}`);
      setUploadProgress(null);
      setCanCancel(false);
    } finally {
      setIsUploading(false);
      currentTaskIdRef.current = null;
    }
  };

  // 取消上传
  const handleCancelUpload = () => {
    if (currentTaskIdRef.current && canCancel) {
      console.log("[Avatar Uploader] 用户取消上传", {
        taskId: currentTaskIdRef.current,
      });

      uploaderRef.current.cancelUpload(currentTaskIdRef.current);
      setIsUploading(false);
      setUploadProgress(null);
      setCanCancel(false);
      currentTaskIdRef.current = null;
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
    // 清空input值，允许重复选择同一文件
    event.target.value = "";
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
        data-testid="avatar-container"
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

        {/* 上传状态遮罩 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            {/* 进度环或加载动画 */}
            {uploadProgress ? (
              <div className="relative">
                <svg
                  className="w-8 h-8 transform -rotate-90"
                  viewBox="0 0 32 32"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${uploadProgress.percent * 0.88} 88`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {uploadProgress.percent}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            )}

            {/* 取消按钮 */}
            {canCancel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelUpload();
                }}
                className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
              >
                取消
              </button>
            )}
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

      {/* 上传进度详情（调试信息） */}
      {uploadProgress && process.env.NODE_ENV === "development" && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-black bg-opacity-75 text-white text-xs rounded whitespace-nowrap">
          进度: {uploadProgress.percent}% (
          {Math.round(uploadProgress.loaded / 1024)}KB /{" "}
          {Math.round(uploadProgress.total / 1024)}KB)
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
