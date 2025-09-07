import React from 'react'
import { cn } from '@/lib/utils'

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'inset'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  isInteractive?: boolean
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  isInteractive = false,
  ...props
}) => {
  const baseClasses = 'bg-pixel-dark-gray'
  
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  }
  
  const variantClasses = {
    default: 'border-2 border-pixel-white shadow-pixel',
    bordered: 'border-4 border-pixel-white shadow-pixel-lg',
    inset: 'border-2 border-pixel-black shadow-pixel-inset bg-pixel-black'
  }
  
  const interactiveClasses = isInteractive 
    ? 'hover:bg-pixel-gray cursor-pointer transition-colors duration-75 active:translate-x-[1px] active:translate-y-[1px]' 
    : ''
  
  return (
    <div
      className={cn(
        baseClasses,
        paddingClasses[padding],
        variantClasses[variant],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}