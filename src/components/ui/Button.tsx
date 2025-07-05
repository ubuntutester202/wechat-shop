import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

/**
 * 按钮组件 - 可复用的按钮组件
 * 支持不同的变体和尺寸
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className,
  disabled = false,
  ...props
}) => {
  const baseClasses = [
    'font-nunito font-light transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-primary/20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'active:scale-95'
  ]

  const variantClasses = {
    primary: [
      'bg-primary text-text-light shadow-soft',
      'hover:bg-primary-600 active:bg-primary-700',
      'disabled:hover:bg-primary'
    ],
    secondary: [
      'bg-background-secondary text-text-primary',
      'hover:bg-gray-200 active:bg-gray-300',
      'disabled:hover:bg-background-secondary'
    ],
    outline: [
      'border border-primary text-primary bg-transparent',
      'hover:bg-primary hover:text-text-light',
      'active:bg-primary-700 active:text-text-light',
      'disabled:hover:bg-transparent disabled:hover:text-primary'
    ]
  }

  const sizeClasses = {
    small: 'px-4 py-2 text-sm rounded-xl',
    medium: 'px-6 py-3 text-base rounded-2xl',
    large: 'px-6 py-4 text-xl rounded-2xl'
  }

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button 