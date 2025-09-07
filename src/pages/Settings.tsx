import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/useGameStore'
import { PixelCard, PixelButton, PixelSlider } from '@/components/pixel'
import { audioService } from '@/services/audio'
import { SoundType } from '@/types'

export const Settings: React.FC = () => {
  const navigate = useNavigate()
  const { 
    settings, 
    updateSettings, 
    reset,
    userProfile,
    wordStates,
    gameState
  } = useGameStore()
  
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showExportSuccess, setShowExportSuccess] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  
  // 处理音量变化
  const handleSoundVolumeChange = (value: number) => {
    updateSettings({ soundVolume: value })
    audioService.setVolume(value / 100)
    // 播放测试音效
    audioService.play(SoundType.MENU_CLICK)
  }
  
  const handleMusicVolumeChange = (value: number) => {
    updateSettings({ musicVolume: value })
    // TODO: 更新背景音乐音量
  }
  
  // 导出数据
  const handleExportData = () => {
    const exportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      userProfile,
      wordStates,
      gameState,
      settings
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `word-contra-save-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    audioService.play(SoundType.ACHIEVEMENT)
    setShowExportSuccess(true)
    setTimeout(() => setShowExportSuccess(false), 3000)
  }
  
  // 导入数据
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string)
        
        // 验证数据格式
        if (!importData.version || !importData.userProfile || !importData.wordStates) {
          throw new Error('Invalid save file format')
        }
        
        // 导入数据到store
        const { initialize } = useGameStore.getState()
        initialize()
        
        // 更新各个部分的数据
        useGameStore.setState({
          userProfile: importData.userProfile,
          wordStates: importData.wordStates,
          gameState: importData.gameState,
          settings: importData.settings
        })
        
        audioService.play(SoundType.ACHIEVEMENT)
        setShowImportDialog(false)
        alert('存档导入成功！')
        
      } catch (error) {
        console.error('Import failed:', error)
        alert('导入失败：文件格式不正确')
      }
    }
    reader.readAsText(file)
  }
  
  // 重置进度
  const handleResetProgress = () => {
    audioService.play(SoundType.MENU_CLICK)
    reset()
    setShowResetConfirm(false)
    alert('游戏进度已重置！')
    navigate('/')
  }
  
  // 返回主菜单
  const handleBack = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/')
  }
  
  return (
    <div className="min-h-screen bg-pixel-black p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 opacity-5">
        <div className="h-full w-full" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #00FF00,
              #00FF00 10px,
              transparent 10px,
              transparent 20px
            )`
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <PixelButton 
            size="sm" 
            variant="secondary"
            onClick={handleBack}
          >
            ← 返回
          </PixelButton>
          
          <h1 className="font-pixel text-pixel-green text-2xl">
            游戏设置
          </h1>
          
          <div className="w-20" /> {/* 占位 */}
        </div>
        
        {/* 音效设置 */}
        <PixelCard className="p-6 mb-4">
          <h2 className="font-pixel text-pixel-yellow text-lg mb-4">
            音效设置
          </h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-pixel-white text-sm">音效音量</span>
                <span className="font-pixel text-pixel-gray text-xs">
                  {settings.soundVolume}%
                </span>
              </div>
              <PixelSlider
                value={settings.soundVolume}
                onChange={handleSoundVolumeChange}
                min={0}
                max={100}
                step={10}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-pixel-white text-sm">背景音乐</span>
                <span className="font-pixel text-pixel-gray text-xs">
                  {settings.musicVolume}%
                </span>
              </div>
              <PixelSlider
                value={settings.musicVolume}
                onChange={handleMusicVolumeChange}
                min={0}
                max={100}
                step={10}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <span className="font-pixel text-pixel-white text-sm">震动反馈</span>
              <button
                onClick={() => {
                  const newValue = !settings.vibration
                  updateSettings({ vibration: newValue })
                  audioService.play(SoundType.MENU_CLICK)
                  if (newValue && navigator.vibrate) {
                    navigator.vibrate(50)
                  }
                }}
                className={`
                  w-12 h-6 border-2 relative transition-all
                  ${settings.vibration 
                    ? 'bg-pixel-green border-pixel-green' 
                    : 'bg-pixel-dark-gray border-pixel-gray'
                  }
                `}
              >
                <div className={`
                  absolute top-0 w-4 h-4 bg-pixel-white transition-transform
                  ${settings.vibration ? 'translate-x-6' : 'translate-x-0'}
                `} />
              </button>
            </div>
          </div>
        </PixelCard>
        
        {/* 游戏设置 */}
        <PixelCard className="p-6 mb-4">
          <h2 className="font-pixel text-pixel-yellow text-lg mb-4">
            游戏设置
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-pixel-white text-sm">显示单词音标</span>
              <button
                onClick={() => {
                  updateSettings({ showPhonetic: !settings.showPhonetic })
                  audioService.play(SoundType.MENU_CLICK)
                }}
                className={`
                  w-12 h-6 border-2 relative transition-all
                  ${settings.showPhonetic 
                    ? 'bg-pixel-green border-pixel-green' 
                    : 'bg-pixel-dark-gray border-pixel-gray'
                  }
                `}
              >
                <div className={`
                  absolute top-0 w-4 h-4 bg-pixel-white transition-transform
                  ${settings.showPhonetic ? 'translate-x-6' : 'translate-x-0'}
                `} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-pixel text-pixel-white text-sm">显示例句</span>
              <button
                onClick={() => {
                  updateSettings({ showExample: !settings.showExample })
                  audioService.play(SoundType.MENU_CLICK)
                }}
                className={`
                  w-12 h-6 border-2 relative transition-all
                  ${settings.showExample 
                    ? 'bg-pixel-green border-pixel-green' 
                    : 'bg-pixel-dark-gray border-pixel-gray'
                  }
                `}
              >
                <div className={`
                  absolute top-0 w-4 h-4 bg-pixel-white transition-transform
                  ${settings.showExample ? 'translate-x-6' : 'translate-x-0'}
                `} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-pixel text-pixel-white text-sm">自动播放发音</span>
              <button
                onClick={() => {
                  updateSettings({ autoPlaySound: !settings.autoPlaySound })
                  audioService.play(SoundType.MENU_CLICK)
                }}
                className={`
                  w-12 h-6 border-2 relative transition-all
                  ${settings.autoPlaySound 
                    ? 'bg-pixel-green border-pixel-green' 
                    : 'bg-pixel-dark-gray border-pixel-gray'
                  }
                `}
              >
                <div className={`
                  absolute top-0 w-4 h-4 bg-pixel-white transition-transform
                  ${settings.autoPlaySound ? 'translate-x-6' : 'translate-x-0'}
                `} />
              </button>
            </div>
          </div>
        </PixelCard>
        
        {/* 数据管理 */}
        <PixelCard className="p-6 mb-4">
          <h2 className="font-pixel text-pixel-yellow text-lg mb-4">
            数据管理
          </h2>
          
          <div className="space-y-3">
            <PixelButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleExportData}
            >
              📥 导出存档
            </PixelButton>
            
            <PixelButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setShowImportDialog(true)}
            >
              📤 导入存档
            </PixelButton>
            
            <PixelButton
              variant="danger"
              size="md"
              className="w-full"
              onClick={() => {
                audioService.play(SoundType.MENU_CLICK)
                setShowResetConfirm(true)
              }}
            >
              🔄 重置进度
            </PixelButton>
          </div>
          
          {showExportSuccess && (
            <div className="mt-3 p-2 bg-pixel-dark-green border-2 border-pixel-green">
              <div className="font-pixel text-pixel-green text-xs text-center">
                存档导出成功！
              </div>
            </div>
          )}
        </PixelCard>
        
        {/* 关于 */}
        <PixelCard className="p-6">
          <h2 className="font-pixel text-pixel-yellow text-lg mb-4">
            关于游戏
          </h2>
          
          <div className="space-y-2 font-pixel text-pixel-white text-xs">
            <div>版本：v1.0.0</div>
            <div>作者：Word Contra Team</div>
            <div>引擎：React + TypeScript</div>
            <div className="text-pixel-gray pt-2">
              本游戏专为高中生英语学习设计，融合经典魂斗罗游戏元素，让背单词变得更有趣！
            </div>
          </div>
        </PixelCard>
        
        {/* 重置确认弹窗 */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <PixelCard className="p-6 max-w-sm w-full">
              <h3 className="font-pixel text-pixel-red text-lg mb-4">
                确认重置？
              </h3>
              <p className="font-pixel text-pixel-white text-xs mb-6">
                这将清除所有游戏进度，包括：
                <br />• 所有单词学习记录
                <br />• 关卡进度和成就
                <br />• 个人统计数据
                <br /><br />
                此操作无法撤销！
              </p>
              <div className="flex gap-3">
                <PixelButton
                  variant="danger"
                  size="md"
                  className="flex-1"
                  onClick={handleResetProgress}
                >
                  确认重置
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    audioService.play(SoundType.MENU_CLICK)
                    setShowResetConfirm(false)
                  }}
                >
                  取消
                </PixelButton>
              </div>
            </PixelCard>
          </div>
        )}
        
        {/* 导入文件弹窗 */}
        {showImportDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <PixelCard className="p-6 max-w-sm w-full">
              <h3 className="font-pixel text-pixel-yellow text-lg mb-4">
                导入存档
              </h3>
              <p className="font-pixel text-pixel-white text-xs mb-4">
                选择之前导出的存档文件（.json格式）
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
              />
              <div className="flex gap-3">
                <label
                  htmlFor="import-file"
                  className="flex-1"
                >
                  <PixelButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => {}}
                  >
                    选择文件
                  </PixelButton>
                </label>
                <PixelButton
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    audioService.play(SoundType.MENU_CLICK)
                    setShowImportDialog(false)
                  }}
                >
                  取消
                </PixelButton>
              </div>
            </PixelCard>
          </div>
        )}
      </div>
    </div>
  )
}