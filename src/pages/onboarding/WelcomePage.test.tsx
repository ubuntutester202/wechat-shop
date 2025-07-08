import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WelcomePage from './WelcomePage';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 创建包装组件
const WelcomePageWrapper = () => (
  <BrowserRouter>
    <WelcomePage />
  </BrowserRouter>
);

describe('WelcomePage Smoke Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('应该正确渲染基本元素（Smoke Test）', () => {
    render(<WelcomePageWrapper />);
    
    // 检查主标题
    expect(screen.getByText('Shoppe')).toBeInTheDocument();
    
    // 检查副标题
    expect(screen.getByText('Beautiful eCommerce UI Kit for your online store')).toBeInTheDocument();
    
    // 检查主要按钮
    expect(screen.getByRole('button', { name: "Let's get started" })).toBeInTheDocument();
    
    // 检查"已有账户"链接
    expect(screen.getByText('I already have an account')).toBeInTheDocument();
  });

  it('应该处理"开始"按钮点击', () => {
    render(<WelcomePageWrapper />);
    
    const getStartedButton = screen.getByRole('button', { name: "Let's get started" });
    fireEvent.click(getStartedButton);
    
    // 验证导航到注册页面
    expect(mockNavigate).toHaveBeenCalledWith('/auth/register');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('应该处理"已有账户"按钮点击', () => {
    render(<WelcomePageWrapper />);
    
    const loginButton = screen.getByLabelText('前往登录页面');
    fireEvent.click(loginButton);
    
    // 验证导航到登录页面
    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('应该包含必要的图片元素', () => {
    render(<WelcomePageWrapper />);
    
    // 检查装饰椭圆图片
    const decorationImage = screen.getByAltText('装饰椭圆');
    expect(decorationImage).toBeInTheDocument();
    expect(decorationImage).toHaveAttribute('src', '/assets/images/ellipse-decoration.svg');
    
    // 检查Logo图片
    const logoImage = screen.getByAltText('Shoppe Logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/assets/images/logo.svg');
  });

  it('应该有正确的CSS类和样式结构', () => {
    const { container } = render(<WelcomePageWrapper />);
    
    // 检查根容器有正确的背景类
    const rootDiv = container.querySelector('.min-h-screen.bg-background-primary');
    expect(rootDiv).toBeInTheDocument();
    
    // 检查按钮有正确的宽度类
    const getStartedButton = screen.getByRole('button', { name: "Let's get started" });
    expect(getStartedButton).toHaveClass('w-full');
  });

  it('应该在不同视口下正确渲染（响应式测试）', () => {
    // 模拟移动端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<WelcomePageWrapper />);
    
    // 验证移动端特定的类存在
    const container = screen.getByText('Shoppe').closest('.container-mobile');
    expect(container).toBeInTheDocument();
  });

  it('应该正确处理图片加载错误', () => {
    render(<WelcomePageWrapper />);
    
    const logoImage = screen.getByAltText('Shoppe Logo');
    
    // 模拟图片加载错误
    fireEvent.error(logoImage);
    
    // 图片元素应该仍然存在（基本容错）
    expect(logoImage).toBeInTheDocument();
  });
}); 