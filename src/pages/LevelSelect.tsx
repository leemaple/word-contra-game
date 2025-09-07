import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/useGameStore'
import { PixelCard, PixelButton } from '@/components/pixel'
import { wordLists } from '@/data/vocabulary'
import { audioService } from '@/services/audio'
import { SoundType } from '@/types'

export const LevelSelect: React.FC = () => {
  const navigate = useNavigate()
  const { gameState, userProfile } = useGameStore()
  const [selectedList, setSelectedList] = useState<string>('list_1')
  
  // 获取当前选中的单元信息
  const currentList = wordLists.find(list => list.id === selectedList) || wordLists[0]
  
  // 检查关卡是否解锁
  const isLevelUnlocked = (listId: string, levelNum: number) => {
    const levelId = `${listId}_level_${levelNum}`
    return gameState.unlockedLevels.includes(levelId)
  }
  
  // 检查关卡是否完成
  const isLevelCompleted = (listId: string, levelNum: number) => {
    const levelId = `${listId}_level_${levelNum}`
    return gameState.completedLevels.includes(levelId)
  }
  
  // 检查Boss是否解锁
  const isBossUnlocked = (listId: string) => {
    const bossId = `${listId}_boss`
    return gameState.unlockedBosses.includes(bossId)
  }
  
  // 检查Boss是否完成
  const isBossCompleted = (listId: string) => {
    const bossId = `${listId}_boss`
    return gameState.completedBosses.includes(bossId)
  }
  
  // 检查单元是否解锁（第一关解锁即算解锁）
  const isListUnlocked = (listId: string) => {
    return isLevelUnlocked(listId, 1)
  }
  
  // 计算单元完成度
  const getListProgress = (listId: string) => {
    let completed = 0
    for (let i = 1; i <= 5; i++) {
      if (isLevelCompleted(listId, i)) completed++
    }
    if (isBossCompleted(listId)) completed++
    return completed
  }
  
  const handleLevelClick = (levelNum: number) => {
    if (!isLevelUnlocked(selectedList, levelNum)) {
      audioService.play(SoundType.HURT)
      return
    }
    
    if (userProfile.currentHP <= 0) {
      audioService.play(SoundType.HURT)
      alert('生命值不足！请等待恢复或明天再来。')
      return
    }
    
    audioService.play(SoundType.MENU_CLICK)
    const levelId = `${selectedList}_level_${levelNum}`
    navigate(`/game/${levelId}`)
  }
  
  const handleBossClick = () => {
    if (!isBossUnlocked(selectedList)) {
      audioService.play(SoundType.HURT)
      return
    }
    
    if (userProfile.currentHP <= 0) {
      audioService.play(SoundType.HURT)
      alert('生命值不足！请等待恢复或明天再来。')
      return
    }
    
    audioService.play(SoundType.MENU_CLICK)
    const bossId = `${selectedList}_boss`
    navigate(`/boss/${bossId}`)
  }
  
  const handleBack = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/')
  }
  
  return (
    <div className="min-h-screen bg-pixel-black p-4">
      {/* 背景网格 */}
      <div className="fixed inset-0 opacity-5">
        <div className="h-full w-full" 
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              #00FF00,
              #00FF00 1px,
              transparent 1px,
              transparent 20px
            ), repeating-linear-gradient(
              90deg,
              #00FF00,
              #00FF00 1px,
              transparent 1px,
              transparent 20px
            )`
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-6">
          <PixelButton 
            size="sm" 
            variant="secondary"
            onClick={handleBack}
          >
            ← 返回
          </PixelButton>
          
          <div className="text-pixel-white font-pixel text-xs">
            <span className="text-pixel-red">HP: {userProfile.currentHP}/{userProfile.maxHP}</span>
            {' | '}
            <span className="text-pixel-yellow">已掌握: {userProfile.totalWordsMastered}</span>
          </div>
        </div>
        
        {/* 标题 */}
        <h1 className="text-3xl font-pixel text-pixel-yellow text-center mb-8">
          任务选择
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：单元列表 */}
          <div className="lg:col-span-1">
            <PixelCard className="p-4">
              <h2 className="font-pixel text-pixel-green text-sm mb-4">
                单元列表
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {wordLists.slice(0, 7).map((list) => {
                  const isUnlocked = isListUnlocked(list.id)
                  const progress = getListProgress(list.id)
                  
                  return (
                    <button
                      key={list.id}
                      onClick={() => {
                        if (isUnlocked) {
                          audioService.play(SoundType.MENU_CLICK)
                          setSelectedList(list.id)
                        } else {
                          audioService.play(SoundType.HURT)
                        }
                      }}
                      disabled={!isUnlocked}
                      className={`
                        w-full p-3 text-left border-2 transition-all
                        ${selectedList === list.id 
                          ? 'bg-pixel-dark-green border-pixel-green' 
                          : 'bg-pixel-dark-gray border-pixel-gray hover:border-pixel-white'
                        }
                        ${!isUnlocked && 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      <div className="font-pixel text-xs">
                        <div className="flex justify-between items-center">
                          <span className={isUnlocked ? 'text-pixel-white' : 'text-pixel-gray'}>
                            {list.name}
                          </span>
                          <span className="text-pixel-yellow">
                            {progress}/6
                          </span>
                        </div>
                        <div className="text-[10px] text-pixel-gray mt-1">
                          {list.description}
                        </div>
                        {!isUnlocked && (
                          <div className="text-[10px] text-pixel-red mt-1">
                            🔒 未解锁
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </PixelCard>
          </div>
          
          {/* 右侧：关卡地图 */}
          <div className="lg:col-span-2">
            <PixelCard className="p-6">
              <h2 className="font-pixel text-pixel-green text-lg mb-6">
                {currentList.name} - 任务地图
              </h2>
              
              {/* 5个普通关卡 */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                {[1, 2, 3, 4, 5].map((levelNum) => {
                  const isUnlocked = isLevelUnlocked(selectedList, levelNum)
                  const isCompleted = isLevelCompleted(selectedList, levelNum)
                  
                  return (
                    <div key={levelNum} className="text-center">
                      <button
                        onClick={() => handleLevelClick(levelNum)}
                        disabled={!isUnlocked}
                        className={`
                          w-full aspect-square border-4 p-2 transition-all
                          flex flex-col items-center justify-center
                          ${isCompleted 
                            ? 'bg-pixel-dark-green border-pixel-green hover:bg-pixel-green' 
                            : isUnlocked
                            ? 'bg-pixel-dark-gray border-pixel-white hover:bg-pixel-gray'
                            : 'bg-pixel-black border-pixel-dark-gray opacity-50 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="text-2xl mb-1">
                          {isCompleted ? '✓' : isUnlocked ? '⚔️' : '🔒'}
                        </div>
                        <div className="font-pixel text-[10px] text-pixel-white">
                          {levelNum}-{levelNum}
                        </div>
                      </button>
                      <div className="font-pixel text-[10px] text-pixel-gray mt-2">
                        关卡 {levelNum}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Boss关卡 */}
              <div className="border-t-2 border-pixel-gray pt-6">
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleBossClick}
                    disabled={!isBossUnlocked(selectedList)}
                    className={`
                      px-8 py-6 border-4 transition-all
                      flex flex-col items-center justify-center
                      ${isBossCompleted(selectedList)
                        ? 'bg-pixel-purple border-pixel-yellow hover:bg-pixel-dark-red animate-pulse' 
                        : isBossUnlocked(selectedList)
                        ? 'bg-pixel-dark-red border-pixel-red hover:bg-pixel-red'
                        : 'bg-pixel-black border-pixel-dark-gray opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="text-4xl mb-2">
                      {isBossCompleted(selectedList) ? '👑' : isBossUnlocked(selectedList) ? '👹' : '🔒'}
                    </div>
                    <div className="font-pixel text-sm text-pixel-yellow">
                      BOSS战
                    </div>
                    <div className="font-pixel text-[10px] text-pixel-white mt-1">
                      {isBossUnlocked(selectedList) ? '拼写挑战' : '完成5关解锁'}
                    </div>
                  </button>
                </div>
              </div>
              
              {/* 单元说明 */}
              <div className="mt-6 p-4 bg-pixel-black border-2 border-pixel-gray">
                <div className="font-pixel text-xs text-pixel-white">
                  <div className="mb-2">
                    <span className="text-pixel-yellow">单元词汇：</span>
                    {currentList.words.length} 个
                  </div>
                  <div className="mb-2">
                    <span className="text-pixel-green">游戏规则：</span>
                  </div>
                  <ul className="space-y-1 text-[10px] text-pixel-gray">
                    <li>• 普通关卡：选择正确的中文释义消灭敌人</li>
                    <li>• 每关20个单词，答错扣1点HP</li>
                    <li>• Boss战：拼写单词击败Boss</li>
                    <li>• 完成关卡解锁下一关，完成5关解锁Boss</li>
                  </ul>
                </div>
              </div>
            </PixelCard>
          </div>
        </div>
      </div>
    </div>
  )
}