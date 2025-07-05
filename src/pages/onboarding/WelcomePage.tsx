import React from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../../components/common/StatusBar'
import Button from '../../components/ui/Button'

/**
 * 欢迎页面组件 - 首次启动界面
 * 对应Figma设计稿："01 Start"页面
 */
const WelcomePage: React.FC = () => {
  const navigate = useNavigate()

  // 处理主要按钮点击
  const handleGetStarted = () => {
    // 可以跳转到注册页面或商品列表页面
    navigate('/auth/register')
  }

  // 处理已有账户按钮点击
  const handleAlreadyHaveAccount = () => {
    navigate('/auth/login')
  }

  return (
    <div className="min-h-screen bg-background-primary relative overflow-hidden">
      {/* 状态栏 */}
      <StatusBar />
      
      {/* 主要内容区域 */}
      <div className="container-mobile min-h-screen flex flex-col justify-between items-center pt-11 pb-8 safe-area-top safe-area-bottom">
        
        {/* 上半部分：装饰图标和文字 */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* 装饰椭圆和Logo */}
          <div className="relative w-[134px] h-[134px] shadow-soft flex items-center justify-center mb-12">
            {/* 使用Figma下载的装饰椭圆 */}
            <img 
              src="/assets/images/ellipse-decoration.svg" 
              alt="装饰椭圆" 
              className="w-full h-full"
            />
            {/* Logo图标 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/assets/images/logo.svg" 
                alt="Shoppe Logo" 
                className="w-20 h-20"
              />
            </div>
          </div>

          {/* 内容区域 */}
          <div className="flex flex-col items-center text-center">
            {/* 主标题 */}
            <h1 className="text-brand-title text-text-primary mb-4">
              Shoppe
            </h1>
            
            {/* 副标题 */}
            <p className="text-brand-subtitle text-text-primary max-w-[249px] px-4">
              Beautiful eCommerce UI Kit for your online store
            </p>
          </div>
        </div>

        {/* 下半部分：按钮区域 */}
        <div className="w-full max-w-[335px] space-y-6 mb-8">
          {/* 主要按钮 */}
          <Button
            variant="primary"
            size="large"
            onClick={handleGetStarted}
            className="w-full"
          >
            Let's get started
          </Button>

          {/* 已有账户链接 */}
          <div className="flex items-center justify-center space-x-4">
            <span className="text-link text-text-primary">
              I already have an account
            </span>
            <button
              onClick={handleAlreadyHaveAccount}
              className="w-[30px] h-[30px] relative flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="前往登录页面"
            >
              <img 
                src="/assets/images/arrow-circle.svg" 
                alt="箭头背景圆圈" 
                className="w-full h-full"
              />
              <img 
                src="/assets/images/arrow.svg" 
                alt="箭头" 
                className="absolute w-3.5 h-3 ml-0.5"
              />
            </button>
          </div>
          
          {/* 底部装饰指示器 */}
          <div className="flex justify-center mt-8">
            <div className="w-[134px] h-[5px] bg-black rounded-full opacity-30"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage 