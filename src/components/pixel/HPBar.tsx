import React from 'react'
import { cn } from '@/lib/utils'

interface HPBarProps {
  current: number
  max: number
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const HPBar: React.FC<HPBarProps> = ({
  current,
  max,
  showText = true,
  size = 'md',
  className
}) => {
  const hearts = []
  
  // Generate heart icons
  for (let i = 0; i < max; i++) {
    const isFilled = i < current
    hearts.push(
      <span
        key={i}
        className={cn(
          'inline-block',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-2xl',
          size === 'lg' && 'text-3xl',
          isFilled ? 'text-pixel-red' : 'text-pixel-dark-gray'
        )}
      >
        {isFilled ? '♥' : '♡'}
      </span>
    )
  }
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showText && (
        <span className="text-pixel-white font-pixel text-xs uppercase">
          HP:
        </span>
      )}
      <div className="flex gap-1">
        {hearts}
      </div>
      {showText && (
        <span className="text-pixel-white font-pixel text-xs">
          {current}/{max}
        </span>
      )}
    </div>
  )
}

// Pixel Heart Component (alternative style)
export const PixelHeart: React.FC<{ filled?: boolean; size?: number }> = ({ 
  filled = true, 
  size = 16 
}) => {
  return (
    <div 
      className="inline-block"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {filled ? (
          <path
            d="M2 2h3v1h1v1h2V3h1V2h3v1h1v1h1v1h1v3h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1H6v-1H5v-1H4v-1H3V9H2V8H1V5h1V3h1V2H2z"
            fill="#FF0000"
          />
        ) : (
          <path
            d="M2 2h3v1h1v1h2V3h1V2h3v1h1v1h1v1h1v3h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1H6v-1H5v-1H4v-1H3V9H2V8H1V5h1V3h1V2H2z"
            stroke="#FF0000"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  )
}