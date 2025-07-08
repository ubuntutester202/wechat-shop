import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import ProductCard from './ProductCard';
import { Product } from '../../assets/data/mock/products';

// 测试用的模拟商品数据
const mockProduct: Product = {
  id: '1',
  name: '测试商品',
  price: 99.99,
  originalPrice: 129.99,
  image: 'https://example.com/product.jpg',
  category: 'electronics',
  description: '这是一个测试商品',
  stock: 10,
  tags: ['New', 'Hot'],
  rating: 4.5,
  reviews: 123
};

const mockProductWithoutOptionalFields: Product = {
  id: '2',
  name: '简单商品',
  price: 49.99,
  image: 'https://example.com/simple.jpg',
  category: 'books',
  description: '简单商品描述',
  stock: 5
};

describe('ProductCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('应该正确渲染商品基本信息', () => {
    render(<ProductCard product={mockProduct} />);
    
    // 检查商品名称
    expect(screen.getByText('测试商品')).toBeInTheDocument();
    
    // 检查价格
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$129.99')).toBeInTheDocument();
    
    // 检查图片
    const image = screen.getByAltText('测试商品');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/product.jpg');
  });

  it('应该正确显示商品标签', () => {
    render(<ProductCard product={mockProduct} />);
    
    // 检查第一个标签
    const tag = screen.getByText('New');
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveClass('bg-blue-500');
  });

  it('应该正确显示评分信息', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    
    // 检查评论数量
    expect(screen.getByText('(123)')).toBeInTheDocument();
    
    // 检查星星评分（应该有5个星星）
    const stars = container.querySelectorAll('svg');
    expect(stars).toHaveLength(5);
  });

  it('当showPrice为false时不应该显示价格信息', () => {
    render(<ProductCard product={mockProduct} showPrice={false} />);
    
    // 价格不应该显示
    expect(screen.queryByText('$99.99')).not.toBeInTheDocument();
    expect(screen.queryByText('$129.99')).not.toBeInTheDocument();
    
    // 商品图片仍然应该显示
    expect(screen.getByAltText('测试商品')).toBeInTheDocument();
    
    // 商品名称不应该显示（因为它在showPrice条件内）
    expect(screen.queryByText('测试商品')).not.toBeInTheDocument();
  });

  it('应该处理onClick事件', () => {
    const handleClick = vi.fn();
    render(<ProductCard product={mockProduct} onClick={handleClick} />);
    
    // 点击商品卡片
    const card = screen.getByRole('img').closest('div');
    fireEvent.click(card!);
    
    // 检查onClick是否被调用
    expect(handleClick).toHaveBeenCalledWith('1');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('应该处理图片加载错误', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('测试商品');
    
    // 模拟图片加载错误
    fireEvent.error(image);
    
    // 检查图片是否被隐藏
    expect(image).toHaveStyle({ display: 'none' });
  });

  it('应该应用自定义className', () => {
    const customClass = 'custom-test-class';
    const { container } = render(<ProductCard product={mockProduct} className={customClass} />);
    
    // 找到最外层的卡片容器
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass(customClass);
  });

  it('应该正确处理没有可选字段的商品', () => {
    render(<ProductCard product={mockProductWithoutOptionalFields} />);
    
    // 检查基本信息
    expect(screen.getByText('简单商品')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    
    // 不应该显示原价（因为没有originalPrice）
    expect(screen.queryByText(/line-through/)).not.toBeInTheDocument();
    
    // 不应该显示标签（因为没有tags）
    expect(screen.queryByText('New')).not.toBeInTheDocument();
    
    // 不应该显示评分（因为没有rating）
    expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
  });

  it('应该正确显示不同类型的标签颜色', () => {
    const productWithSaleTag: Product = {
      ...mockProduct,
      tags: ['Sale']
    };
    
    const { rerender } = render(<ProductCard product={productWithSaleTag} />);
    
    // Sale 标签应该是红色
    let tag = screen.getByText('Sale');
    expect(tag).toHaveClass('bg-red-500');
    
    // 测试 Hot 标签
    const productWithHotTag: Product = {
      ...mockProduct,
      tags: ['Hot']
    };
    
    rerender(<ProductCard product={productWithHotTag} />);
    tag = screen.getByText('Hot');
    expect(tag).toHaveClass('bg-orange-500');
  });

  it('应该正确显示评分星星', () => {
    const productWith3Stars: Product = {
      ...mockProduct,
      rating: 3.2
    };
    
    const { container } = render(<ProductCard product={productWith3Stars} />);
    
    const stars = container.querySelectorAll('svg');
    const filledStars = container.querySelectorAll('.text-yellow-400');
    const emptyStars = container.querySelectorAll('.text-gray-300');
    
    // 应该有5个星星总共
    expect(stars).toHaveLength(5);
    // 应该有3个填充的星星
    expect(filledStars).toHaveLength(3);
    // 应该有2个空的星星
    expect(emptyStars).toHaveLength(2);
  });
}); 