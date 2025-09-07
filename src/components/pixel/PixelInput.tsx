import React from 'react'
import { cn } from '@/lib/utils'

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  pixelStyle?: 'normal' | 'thick'
}

export const PixelInput = React.forwardRef<HTMLInputElement, PixelInputProps>(
  ({ className, error = false, pixelStyle = 'normal', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2',
          'font-pixel text-xs uppercase',
          'bg-pixel-black text-pixel-white',
          'border-2',
          error ? 'border-pixel-red' : 'border-pixel-white',
          pixelStyle === 'thick' ? 'border-4' : 'border-2',
          'focus:outline-none focus:bg-pixel-dark-gray',
          'placeholder:text-pixel-gray',
          className
        )}
        {...props}
      />
    )
  }
)

PixelInput.displayName = 'PixelInput'