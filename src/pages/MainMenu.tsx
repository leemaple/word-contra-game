import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/useGameStore'
import { 
  PixelButton, 
  PixelCard, 
  HPBar, 
  PixelDialog 
} from '@/components/pixel'
import { audioService } from '@/services/audio'
import { SoundType } from '@/types'

export const MainMenu: React.FC = () => {
  const navigate = useNavigate()
  const { 
    userProfile, 
    initialize, 
    isInitialized,
    settings,
    toggleSound,
    toggleMusic 
  } = useGameStore()
  
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)

  useEffect(() => {
    if (!isInitialized) {
      initialize()
    }
    // Check if new user for onboarding
    const isNewUser = localStorage.getItem('wordContra_hasSeenOnboarding') !== 'true'
    if (isNewUser) {
      setShowOnboarding(true)
    }
  }, [initialize, isInitialized])

  const handleStartMission = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/levels')
  }

  const handleWordFactory = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/vocabulary')
  }

  const handleAchievements = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/achievements')
  }

  const handleSettings = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/settings')
  }

  const handleOnboardingNext = () => {
    if (onboardingStep < 3) {
      setOnboardingStep(onboardingStep + 1)
    } else {
      localStorage.setItem('wordContra_hasSeenOnboarding', 'true')
      setShowOnboarding(false)
    }
  }

  const getOnboardingContent = () => {
    const steps = [
      {
        title: '欢迎来到单词魂斗罗！',
        content: '准备好开始你的英语冒险了吗？在这里，你将通过经典的魂斗罗游戏方式学习高考英语单词！'
      },
      {
        title: '开始任务',
        content: '点击"开始任务"进入关卡选择，通过选择正确的中文释义来消灭敌人。每个单元有5个关卡等待你的挑战！'
      },
      {
        title: 'Boss挑战',
        content: '完成5个关卡后将解锁Boss战！在Boss战中，你需要正确拼写单词才能击败它！'
      },
      {
        title: '生命值系统',
        content: '注意你的生命值（HP）！每次答错都会损失1点HP。每天登录会恢复满血，每6小时也会恢复1点HP。'
      }
    ]
    return steps[onboardingStep]
  }

  return (
    <div className="min-h-screen bg-pixel-black p-4 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              #00FF00,
              #00FF00 2px,
              transparent 2px,
              transparent 4px
            ), repeating-linear-gradient(
              90deg,
              #00FF00,
              #00FF00 2px,
              transparent 2px,
              transparent 4px
            )`
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pixel text-pixel-yellow mb-2 animate-pulse">
            单词魂斗罗
          </h1>
          <p className="text-pixel-green font-pixel text-xs">
            WORD CONTRA - GAOKAO EDITION
          </p>
        </div>

        {/* Status Bar */}
        <PixelCard className="mb-6">
          <div className="flex items-center justify-between">
            <HPBar 
              current={userProfile.currentHP} 
              max={userProfile.maxHP}
              size="md"
            />
            <div className="text-pixel-white font-pixel text-xs">
              <span className="text-pixel-yellow">已掌握: </span>
              <span>{userProfile.totalWordsMastered}</span>
              <span className="text-pixel-gray"> / 3500</span>
            </div>
            <button 
              onClick={handleSettings}
              className="text-pixel-white hover:text-pixel-yellow transition-colors"
              aria-label="Settings"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </PixelCard>

        {/* Main Menu Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Mission */}
          <PixelCard 
            isInteractive 
            className="flex flex-col items-center justify-center p-8 hover:border-pixel-yellow"
            onClick={handleStartMission}
          >
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="font-pixel text-pixel-yellow text-lg mb-2">
              开始任务
            </h2>
            <p className="font-pixel text-pixel-white text-xs text-center">
              ENTER MISSION MODE
            </p>
          </PixelCard>

          {/* Word Factory */}
          <PixelCard 
            isInteractive 
            className="flex flex-col items-center justify-center p-8 hover:border-pixel-green"
            onClick={handleWordFactory}
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="font-pixel text-pixel-green text-lg mb-2">
              单词兵工厂
            </h2>
            <p className="font-pixel text-pixel-white text-xs text-center">
              WORD FACTORY
            </p>
          </PixelCard>

          {/* Achievements */}
          <PixelCard 
            isInteractive 
            className="flex flex-col items-center justify-center p-8 hover:border-pixel-orange"
            onClick={handleAchievements}
          >
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="font-pixel text-pixel-orange text-lg mb-2">
              功勋墙
            </h2>
            <p className="font-pixel text-pixel-white text-xs text-center">
              ACHIEVEMENTS
            </p>
          </PixelCard>

          {/* Quick Settings */}
          <PixelCard className="flex flex-col items-center justify-center p-8">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="font-pixel text-pixel-light-gray text-lg mb-4">
              快速设置
            </h2>
            <div className="flex gap-4">
              <PixelButton
                size="sm"
                variant={settings.soundOn ? "success" : "secondary"}
                onClick={() => {
                  toggleSound()
                  audioService.setMuted(!settings.soundOn)
                }}
              >
                {settings.soundOn ? '音效: 开' : '音效: 关'}
              </PixelButton>
              <PixelButton
                size="sm"
                variant={settings.musicOn ? "success" : "secondary"}
                onClick={toggleMusic}
              >
                {settings.musicOn ? '音乐: 开' : '音乐: 关'}
              </PixelButton>
            </div>
          </PixelCard>
        </div>

        {/* Stats Footer */}
        <div className="mt-6 text-center">
          <p className="font-pixel text-pixel-gray text-xs">
            连续登录 {userProfile.achievements.length > 0 ? '1' : '0'} 天 | 
            成就解锁 {userProfile.achievements.length} 个
          </p>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <PixelDialog
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        title={getOnboardingContent().title}
        size="md"
      >
        <div className="py-4">
          <p className="font-pixel text-xs mb-6">
            {getOnboardingContent().content}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-pixel text-xs text-pixel-gray">
              {onboardingStep + 1} / 4
            </span>
            <PixelButton
              size="sm"
              variant="primary"
              onClick={handleOnboardingNext}
            >
              {onboardingStep < 3 ? '下一步' : '开始游戏'}
            </PixelButton>
          </div>
        </div>
      </PixelDialog>
    </div>
  )
}