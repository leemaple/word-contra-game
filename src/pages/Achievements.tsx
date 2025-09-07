import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/useGameStore'
import { PixelCard, PixelButton, PixelProgress } from '@/components/pixel'
import { 
  achievements, 
  getAchievementProgress, 
  checkAchievementUnlocked,
  getRarityColor,
  getRarityBorder 
} from '@/data/achievements'
import { audioService } from '@/services/audio'
import { SoundType, WordStatus } from '@/types'

type FilterType = 'all' | 'unlocked' | 'locked' | 'common' | 'rare' | 'epic' | 'legendary'

export const Achievements: React.FC = () => {
  const navigate = useNavigate()
  const { wordStates, gameState, userProfile } = useGameStore()
  
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [selectedAchievement, setSelectedAchievement] = useState<typeof achievements[0] | null>(null)
  
  // 计算统计数据
  const stats = useMemo(() => {
    try {
      // 统计已掌握的单词数
      const wordsMastered = Object.entries(wordStates || {}).filter(
        ([_, state]) => state?.status === WordStatus.MASTERED
      ).length
      
      // 统计完成的关卡数
      const levelsCompleted = (gameState?.completedLevels || []).length
      
      // 统计击败的Boss数（使用completedBosses）
      const bossesDefeated = (gameState?.completedBosses || []).length
    
      // 统计完美通关数（假设存储在gameState中）
      const perfectLevels = (gameState as any)?.perfectLevels?.length || 0
      
      // 统计最大连击数（需要从会话历史中计算）
      const maxStreak = (gameState as any)?.maxStreak || 0
      
      // 统计总分
      const totalScore = (userProfile as any)?.totalScore || 0
      
      return {
        wordsMastered,
        levelsCompleted,
        bossesDefeated,
        perfectLevels,
        maxStreak,
        totalScore
      }
    } catch (error) {
      console.error('Error calculating stats:', error)
      // 返回默认值避免页面崩溃
      return {
        wordsMastered: 0,
        levelsCompleted: 0,
        bossesDefeated: 0,
        perfectLevels: 0,
        maxStreak: 0,
        totalScore: 0
      }
    }
  }, [wordStates, gameState, userProfile])
  
  // 计算已解锁的成就
  const unlockedAchievements = useMemo(() => {
    return achievements.filter(achievement => 
      checkAchievementUnlocked(achievement, stats)
    )
  }, [stats])
  
  // 计算总成就点数
  const totalPoints = useMemo(() => {
    return unlockedAchievements.reduce((sum, achievement) => 
      sum + achievement.points, 0
    )
  }, [unlockedAchievements])
  
  // 过滤成就
  const filteredAchievements = useMemo(() => {
    let filtered = [...achievements]
    
    switch (selectedFilter) {
      case 'unlocked':
        filtered = filtered.filter(a => checkAchievementUnlocked(a, stats))
        break
      case 'locked':
        filtered = filtered.filter(a => !checkAchievementUnlocked(a, stats))
        break
      case 'common':
      case 'rare':
      case 'epic':
      case 'legendary':
        filtered = filtered.filter(a => a.rarity === selectedFilter)
        break
    }
    
    // 排序：已解锁的在前，按稀有度和点数排序
    filtered.sort((a, b) => {
      const aUnlocked = checkAchievementUnlocked(a, stats)
      const bUnlocked = checkAchievementUnlocked(b, stats)
      
      if (aUnlocked !== bUnlocked) {
        return aUnlocked ? -1 : 1
      }
      
      // 稀有度权重
      const rarityWeight = { common: 0, rare: 1, epic: 2, legendary: 3 }
      const aWeight = rarityWeight[a.rarity]
      const bWeight = rarityWeight[b.rarity]
      
      if (aWeight !== bWeight) {
        return bWeight - aWeight
      }
      
      return b.points - a.points
    })
    
    return filtered
  }, [selectedFilter, stats])
  
  // 处理返回
  const handleBack = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/')
  }
  
  // 处理成就点击
  const handleAchievementClick = (achievement: typeof achievements[0]) => {
    audioService.play(SoundType.MENU_CLICK)
    setSelectedAchievement(achievement)
  }
  
  // 获取当前值（用于显示进度）
  const getCurrentValue = (achievement: typeof achievements[0]): number => {
    const { type } = achievement.requirement
    
    switch (type) {
      case 'words_mastered':
        return stats.wordsMastered
      case 'levels_completed':
        return stats.levelsCompleted
      case 'boss_defeated':
        return stats.bossesDefeated
      case 'perfect_level':
        return stats.perfectLevels
      case 'streak':
        return stats.maxStreak
      case 'total_score':
        return stats.totalScore
      default:
        return 0
    }
  }
  
  return (
    <div className="min-h-screen bg-pixel-black p-4">
      {/* 背景装饰 */}
      <div className="fixed inset-0 opacity-5">
        <div className="h-full w-full" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #FFD700,
              #FFD700 10px,
              transparent 10px,
              transparent 20px
            )`
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <PixelButton 
            size="sm" 
            variant="secondary"
            onClick={handleBack}
          >
            ← 返回
          </PixelButton>
          
          <h1 className="font-pixel text-pixel-yellow text-2xl">
            成就系统
          </h1>
          
          <div className="font-pixel text-pixel-white text-sm">
            总点数: <span className="text-pixel-yellow">{totalPoints}</span>
          </div>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <PixelCard className="p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-pixel text-pixel-yellow text-xs mb-1">已解锁</div>
            <div className="font-pixel text-pixel-white text-xl">
              {unlockedAchievements.length}/{achievements.length}
            </div>
          </PixelCard>
          
          <PixelCard className="p-4 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="font-pixel text-pixel-green text-xs mb-1">完成度</div>
            <div className="font-pixel text-pixel-white text-xl">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </div>
          </PixelCard>
          
          <PixelCard className="p-4 text-center">
            <div className="text-3xl mb-2">💎</div>
            <div className="font-pixel text-pixel-blue text-xs mb-1">总点数</div>
            <div className="font-pixel text-pixel-white text-xl">
              {totalPoints}
            </div>
          </PixelCard>
          
          <PixelCard className="p-4 text-center">
            <div className="text-3xl mb-2">👑</div>
            <div className="font-pixel text-pixel-purple text-xs mb-1">传奇成就</div>
            <div className="font-pixel text-pixel-white text-xl">
              {unlockedAchievements.filter(a => a.rarity === 'legendary').length}
            </div>
          </PixelCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：筛选器 */}
          <div className="lg:col-span-1">
            <PixelCard className="p-4">
              <div className="font-pixel text-pixel-yellow text-xs mb-3">
                筛选成就
              </div>
              
              <div className="space-y-1">
                {[
                  { value: 'all', label: '全部', color: 'text-pixel-white' },
                  { value: 'unlocked', label: '已解锁', color: 'text-pixel-green' },
                  { value: 'locked', label: '未解锁', color: 'text-pixel-gray' },
                  { value: 'common', label: '普通', color: 'text-pixel-white' },
                  { value: 'rare', label: '稀有', color: 'text-pixel-blue' },
                  { value: 'epic', label: '史诗', color: 'text-pixel-purple' },
                  { value: 'legendary', label: '传奇', color: 'text-pixel-yellow' }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      audioService.play(SoundType.MENU_CLICK)
                      setSelectedFilter(filter.value as FilterType)
                    }}
                    className={`
                      w-full p-2 text-left border-2 transition-all
                      ${selectedFilter === filter.value 
                        ? 'bg-pixel-dark-green border-pixel-green' 
                        : 'bg-pixel-dark-gray border-pixel-gray hover:border-pixel-white'
                      }
                    `}
                  >
                    <span className={`font-pixel text-xs ${filter.color}`}>
                      {filter.label}
                    </span>
                  </button>
                ))}
              </div>
            </PixelCard>
            
            {/* 进度统计 */}
            <PixelCard className="p-4 mt-4">
              <div className="font-pixel text-pixel-yellow text-xs mb-3">
                当前进度
              </div>
              
              <div className="space-y-2 font-pixel text-xs">
                <div className="text-pixel-white">
                  单词掌握: <span className="text-pixel-green">{stats.wordsMastered}</span>
                </div>
                <div className="text-pixel-white">
                  关卡完成: <span className="text-pixel-green">{stats.levelsCompleted}</span>
                </div>
                <div className="text-pixel-white">
                  Boss击败: <span className="text-pixel-green">{stats.bossesDefeated}</span>
                </div>
                <div className="text-pixel-white">
                  完美通关: <span className="text-pixel-green">{stats.perfectLevels}</span>
                </div>
                <div className="text-pixel-white">
                  最大连击: <span className="text-pixel-green">{stats.maxStreak}</span>
                </div>
                <div className="text-pixel-white">
                  总分: <span className="text-pixel-green">{stats.totalScore}</span>
                </div>
              </div>
            </PixelCard>
          </div>
          
          {/* 右侧：成就列表 */}
          <div className="lg:col-span-3">
            <PixelCard className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAchievements.map(achievement => {
                  const isUnlocked = checkAchievementUnlocked(achievement, stats)
                  const progress = getAchievementProgress(achievement, stats)
                  const currentValue = getCurrentValue(achievement)
                  
                  return (
                    <button
                      key={achievement.id}
                      onClick={() => handleAchievementClick(achievement)}
                      className={`
                        p-3 border-2 transition-all text-left
                        ${isUnlocked 
                          ? `bg-pixel-dark-green ${getRarityBorder(achievement.rarity)} hover:bg-pixel-dark-blue` 
                          : 'bg-pixel-dark-gray border-pixel-gray hover:border-pixel-white opacity-75'
                        }
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`text-2xl ${!isUnlocked && 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <div className={`font-pixel text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.name}
                          </div>
                          <div className="font-pixel text-pixel-gray text-xs mt-1">
                            {achievement.description}
                          </div>
                          
                          {!isUnlocked && (
                            <div className="mt-2">
                              <PixelProgress 
                                value={progress * 100} 
                                color="yellow" 
                                size="sm"
                              />
                              <div className="font-pixel text-pixel-gray text-xs mt-1">
                                {currentValue}/{achievement.requirement.value}
                              </div>
                            </div>
                          )}
                          
                          <div className="font-pixel text-pixel-yellow text-xs mt-1">
                            +{achievement.points}点
                          </div>
                        </div>
                        
                        {isUnlocked && (
                          <div className="text-pixel-green">✓</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
              
              {filteredAchievements.length === 0 && (
                <div className="text-center py-8 font-pixel text-pixel-gray">
                  没有找到匹配的成就
                </div>
              )}
            </PixelCard>
          </div>
        </div>
        
        {/* 成就详情弹窗 */}
        {selectedAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <PixelCard className="p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">
                    {selectedAchievement.icon}
                  </div>
                  <div>
                    <h3 className={`font-pixel text-lg ${getRarityColor(selectedAchievement.rarity)}`}>
                      {selectedAchievement.name}
                    </h3>
                    <div className="font-pixel text-pixel-gray text-xs">
                      {selectedAchievement.rarity === 'common' && '普通成就'}
                      {selectedAchievement.rarity === 'rare' && '稀有成就'}
                      {selectedAchievement.rarity === 'epic' && '史诗成就'}
                      {selectedAchievement.rarity === 'legendary' && '传奇成就'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="text-pixel-white hover:text-pixel-red"
                >
                  ✕
                </button>
              </div>
              
              <div className="font-pixel text-pixel-white text-sm mb-4">
                {selectedAchievement.description}
              </div>
              
              <div className="p-3 bg-pixel-black border-2 border-pixel-gray mb-4">
                <div className="font-pixel text-xs space-y-1">
                  <div className="text-pixel-gray">
                    达成条件: 
                    <span className="text-pixel-white ml-1">
                      {selectedAchievement.requirement.type === 'words_mastered' && `掌握${selectedAchievement.requirement.value}个单词`}
                      {selectedAchievement.requirement.type === 'levels_completed' && `完成${selectedAchievement.requirement.value}个关卡`}
                      {selectedAchievement.requirement.type === 'boss_defeated' && `击败${selectedAchievement.requirement.value}个Boss`}
                      {selectedAchievement.requirement.type === 'perfect_level' && `完美通关${selectedAchievement.requirement.value}个关卡`}
                      {selectedAchievement.requirement.type === 'streak' && `连续答对${selectedAchievement.requirement.value}题`}
                      {selectedAchievement.requirement.type === 'total_score' && `累计获得${selectedAchievement.requirement.value}分`}
                    </span>
                  </div>
                  <div className="text-pixel-gray">
                    奖励点数: <span className="text-pixel-yellow">{selectedAchievement.points}点</span>
                  </div>
                </div>
              </div>
              
              {!checkAchievementUnlocked(selectedAchievement, stats) && (
                <div>
                  <div className="font-pixel text-pixel-gray text-xs mb-2">
                    当前进度: {getCurrentValue(selectedAchievement)}/{selectedAchievement.requirement.value}
                  </div>
                  <PixelProgress 
                    value={getAchievementProgress(selectedAchievement, stats) * 100} 
                    color="yellow" 
                    size="sm"
                    showText
                  />
                </div>
              )}
              
              {checkAchievementUnlocked(selectedAchievement, stats) && (
                <div className="text-center">
                  <div className="font-pixel text-pixel-green text-lg animate-pulse">
                    ✨ 已解锁 ✨
                  </div>
                </div>
              )}
            </PixelCard>
          </div>
        )}
      </div>
    </div>
  )
}