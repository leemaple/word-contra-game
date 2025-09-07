import React from 'react'
import { cn } from '@/lib/utils'

interface PixelProgressProps {
  value: number
  max?: number
  showText?: boolean
  color?: 'green' | 'yellow' | 'red' | 'blue'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const PixelProgress: React.FC<PixelProgressProps> = ({
  value,
  max = 100,
  showText = false,
  color = 'green',
  size = 'md',
  className
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }
  
  const colorClasses = {
    green: 'bg-pixel-green',
    yellow: 'bg-pixel-yellow',
    red: 'bg-pixel-red',
    blue: 'bg-pixel-blue'
  }
  
  const getProgressSegments = () => {
    const segmentCount = 20 // Number of segments in the progress bar
    const filledSegments = Math.floor((percentage / 100) * segmentCount)
    const segments = []
    
    for (let i = 0; i < segmentCount; i++) {
      segments.push(
        <div
          key={i}
          className={cn(
            'h-full w-full',
            i < filledSegments ? colorClasses[color] : 'bg-pixel-dark-gray'
          )}
        />
      )
    }
    
    return segments
  }
  
  return (
    <div className={cn('w-full', className)}>
      <div 
        className={cn(
          'w-full bg-pixel-black border-2 border-pixel-white p-[2px]',
          sizeClasses[size]
        )}
      >
        <div className="h-full w-full grid grid-cols-20 gap-[1px]">
          {getProgressSegments()}
        </div>
      </div>
      {showText && (
        <div className="mt-1 text-center">
          <span className="font-pixel text-xs text-pixel-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}