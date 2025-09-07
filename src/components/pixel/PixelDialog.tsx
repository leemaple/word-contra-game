import React from 'react'
import { cn } from '@/lib/utils'

interface PixelDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const PixelDialog: React.FC<PixelDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  size = 'md'
}) => {
  if (!isOpen) return null
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black opacity-75"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={cn(
        'relative bg-pixel-dark-gray border-4 border-pixel-white shadow-pixel-lg',
        'p-4 mx-4 animate-pixelFade',
        sizeClasses[size],
        className
      )}>
        {/* Title Bar */}
        {title && (
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-pixel-white">
            <h2 className="text-pixel-yellow font-pixel text-sm uppercase">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-pixel-white hover:text-pixel-red transition-colors"
                aria-label="Close"
              >
                X
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="text-pixel-white">
          {children}
        </div>
      </div>
    </div>
  )
}