import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../assets/data/mock/products';

// 模拟商品数据
const mockProduct: Product = {
  id: '1',
  name: 'iPhone 15 Pro Max 256GB 深空黑色',
  price: 999.99,
  originalPrice: 1199.99,
  image: 'https://picsum.photos/300/200?random=1',
  category: 'Electronics',
  tags: ['New'],
  rating: 4.8,
  reviews: 1234,
  description: '最新 iPhone 15 Pro Max，搭载 A17 Pro 芯片'
};

const meta = {
  title: 'UI/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          # ProductCard 组件
          
          用于展示商品信息的卡片组件，包含以下特性：
          - 🖼️ 图片显示与错误处理
          - 💰 价格展示（支持原价/现价）
          - ⭐ 评分显示
          - 🏷️ 标签分类（New/Sale/Hot）
          - 📱 响应式设计
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    showPrice: {
      control: { type: 'boolean' },
      description: '是否显示价格信息',
    },
    onClick: { 
      action: 'clicked',
      description: '点击时的回调函数' 
    },
    className: {
      control: { type: 'text' },
      description: '自定义样式类名'
    }
  },
  args: {
    onClick: fn()
  }
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础展示
export const Default: Story = {
  args: {
    product: mockProduct,
    showPrice: true,
  },
};

// 隐藏价格
export const WithoutPrice: Story = {
  args: {
    product: mockProduct,
    showPrice: false,
  },
};

// 促销商品（有原价）
export const OnSale: Story = {
  args: {
    product: {
      ...mockProduct,
      price: 799.99,
      originalPrice: 999.99,
      tags: ['Sale']
    },
  },
};

// 新品
export const NewProduct: Story = {
  args: {
    product: {
      ...mockProduct,
      tags: ['New'],
      reviews: 0,
    },
  },
};

// 热门商品
export const HotProduct: Story = {
  args: {
    product: {
      ...mockProduct,
      tags: ['Hot'],
      rating: 4.9,
      reviews: 5678,
    },
  },
};

// 图片加载失败的情况
export const ImageError: Story = {
  args: {
    product: {
      ...mockProduct,
      image: 'https://broken-image-url.jpg',
    },
  },
};

// 长标题测试
export const LongTitle: Story = {
  args: {
    product: {
      ...mockProduct,
      name: '这是一个非常非常长的商品标题，用来测试文本截断和布局是否正常工作，看看会不会影响卡片的整体美观性',
    },
  },
};

// 无评分商品
export const NoRating: Story = {
  args: {
    product: {
      ...mockProduct,
      rating: undefined,
      reviews: undefined,
    },
  },
};

// 无评分和无原价的组合测试
export const Minimal: Story = {
  args: {
    product: {
      ...mockProduct,
      rating: undefined,
      reviews: undefined,
      originalPrice: undefined,
      tags: undefined,
    },
  },
}; 