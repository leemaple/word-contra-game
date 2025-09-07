import React from 'react'

interface PixelSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

export const PixelSlider: React.FC<PixelSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = ''
}) => {
  const percentage = ((value - min) / (max - min)) * 100
  
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative h-8 bg-pixel-dark-gray border-2 border-pixel-white">
        {/* 填充条 */}
        <div 
          className="absolute top-0 left-0 h-full bg-pixel-green transition-all"
          style={{ width: `${percentage}%` }}
        />
        
        {/* 刻度线 */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {[...Array(11)].map((_, i) => (
            <div 
              key={i} 
              className="w-0.5 h-2 bg-pixel-gray opacity-50"
            />
          ))}
        </div>
        
        {/* 滑块 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* 滑块指示器 */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-pixel-yellow border-2 border-pixel-white pointer-events-none transition-all"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  )
}