import React from 'react'
import { cn } from '@/lib/utils'

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  pixelStyle?: 'normal' | 'thick'
  isAnimated?: boolean
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  pixelStyle = 'normal',
  isAnimated = true,
  disabled = false,
  ...props
}) => {
  const baseClasses = 'font-pixel uppercase transition-all duration-75 relative active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-[10px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm'
  }
  
  const variantClasses = {
    primary: 'bg-pixel-dark-gray text-pixel-white hover:bg-pixel-gray border-2 border-pixel-white',
    secondary: 'bg-pixel-gray text-pixel-white hover:bg-pixel-light-gray border-2 border-pixel-white',
    danger: 'bg-pixel-dark-red text-pixel-white hover:bg-pixel-red border-2 border-pixel-red',
    success: 'bg-pixel-dark-green text-pixel-white hover:bg-pixel-green border-2 border-pixel-green'
  }
  
  const shadowClasses = pixelStyle === 'thick' ? 'shadow-pixel-lg' : 'shadow-pixel'
  
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed hover:bg-pixel-dark-gray active:translate-x-0 active:translate-y-0 active:shadow-pixel' 
    : ''
  
  const animatedClasses = isAnimated && !disabled ? 'hover:animate-pulse' : ''
  
  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        shadowClasses,
        disabledClasses,
        animatedClasses,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}