import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Button from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '可复用的按钮组件，支持不同的变体和尺寸。提供了primary、secondary和outline三种样式变体。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
      description: '按钮变体样式'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '按钮尺寸'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用按钮'
    },
    children: {
      control: 'text',
      description: '按钮内容'
    },
    className: {
      control: 'text',
      description: '自定义CSS类名'
    },
    onClick: {
      action: 'clicked',
      description: '点击事件处理函数'
    }
  },
  args: {
    onClick: fn(),
    children: '按钮'
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 主要按钮
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮'
  }
};

// 次要按钮
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '次要按钮'
  }
};

// 轮廓按钮
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '轮廓按钮'
  }
};

// 小尺寸
export const Small: Story = {
  args: {
    size: 'small',
    children: '小按钮'
  }
};

// 中等尺寸（默认）
export const Medium: Story = {
  args: {
    size: 'medium',
    children: '中等按钮'
  }
};

// 大尺寸
export const Large: Story = {
  args: {
    size: 'large',
    children: '大按钮'
  }
};

// 禁用状态
export const Disabled: Story = {
  args: {
    disabled: true,
    children: '禁用按钮'
  }
};

// 禁用的次要按钮
export const DisabledSecondary: Story = {
  args: {
    variant: 'secondary',
    disabled: true,
    children: '禁用次要按钮'
  }
};

// 禁用的轮廓按钮
export const DisabledOutline: Story = {
  args: {
    variant: 'outline',
    disabled: true,
    children: '禁用轮廓按钮'
  }
};

// 自定义样式
export const CustomStyle: Story = {
  args: {
    className: 'min-w-32 shadow-lg',
    children: '自定义样式'
  }
};

// 长文本按钮
export const LongText: Story = {
  args: {
    children: '这是一个包含较长文本的按钮'
  }
}; 