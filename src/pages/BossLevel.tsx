import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/useGameStore'
import { PixelCard, PixelButton, HPBar, PixelProgress, PixelInput } from '@/components/pixel'
import { getWordsByListId } from '@/data/vocabulary'
import { audioService } from '@/services/audio'
import { SoundType, WordStatus } from '@/types'
import type { Word } from '@/types'

export const BossLevel: React.FC = () => {
  const { bossId } = useParams<{ bossId: string }>()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { 
    userProfile,
    updateHP,
    updateWordStatus,
    recordWordError,
    startBossSession,
    updateBossSession,
    endBossSession,
    completeBoss
  } = useGameStore()
  
  // 游戏状态
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState<Word[]>([])
  const [input, setInput] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [correctSpellings, setCorrectSpellings] = useState(0)
  const [masteredWords, setMasteredWords] = useState<string[]>([])
  const [isGameOver, setIsGameOver] = useState(false)
  const [isVictory, setIsVictory] = useState(false)
  
  // Boss状态
  const [bossHP, setBossHP] = useState(10)
  const [bossMaxHP] = useState(10)
  const [bossAnimation, setBossAnimation] = useState<'idle' | 'attack' | 'hurt' | 'defeat'>('idle')
  const [heroAnimation, setHeroAnimation] = useState<'idle' | 'attack' | 'hurt'>('idle')
  
  // 初始化Boss战
  useEffect(() => {
    if (!bossId) return
    
    // 解析Boss ID（格式：list_1_boss）
    const parts = bossId.split('_')
    const listId = `${parts[0]}_${parts[1]}`
    
    // 获取该单元的所有单词
    const allWords = getWordsByListId(listId)
    
    // Boss战使用本单元所有单词（或最多30个）
    const shuffled = [...allWords].sort(() => Math.random() - 0.5)
    const bossWords = shuffled.slice(0, Math.min(30, shuffled.length))
    
    setWords(bossWords)
    setBossHP(Math.min(10, bossWords.length))
    
    // 开始Boss会话
    const wordIds = bossWords.map(w => w.id)
    startBossSession(bossId, wordIds)
    
    // 自动聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }, [bossId, startBossSession])
  
  // 获取当前单词
  const currentWord = words[currentWordIndex]
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().trim()
    setInput(value)
    setIsWrong(false)
  }
  
  // 提交答案
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!currentWord || isGameOver) return
    
    const userAnswer = input.toLowerCase().trim()
    const correctAnswer = currentWord.word.toLowerCase()
    
    if (userAnswer === correctAnswer) {
      // 拼写正确
      handleCorrectAnswer()
    } else {
      // 拼写错误
      handleWrongAnswer()
    }
  }
  
  // 处理正确答案
  const handleCorrectAnswer = () => {
    audioService.play(SoundType.SHOOT)
    setIsCorrect(true)
    setHeroAnimation('attack')
    setBossAnimation('hurt')
    
    // Boss掉血
    setBossHP(prev => Math.max(0, prev - 1))
    
    // 第一次就拼对，标记为掌握
    if (attempts === 0) {
      updateWordStatus(currentWord.id, WordStatus.MASTERED)
      setMasteredWords(prev => [...prev, currentWord.id])
    } else {
      updateWordStatus(currentWord.id, WordStatus.LEARNING)
    }
    
    setCorrectSpellings(prev => prev + 1)
    
    // 更新会话
    updateBossSession({
      correctSpellings: correctSpellings + 1,
      masteredWords: attempts === 0 ? [...masteredWords, currentWord.id] : masteredWords
    })
    
    setTimeout(() => {
      setIsCorrect(false)
      setHeroAnimation('idle')
      setBossAnimation('idle')
      
      // 检查是否击败Boss
      if (bossHP <= 1) {
        handleVictory()
      } else {
        nextWord()
      }
    }, 1500)
  }
  
  // 处理错误答案
  const handleWrongAnswer = () => {
    audioService.play(SoundType.HURT)
    setIsWrong(true)
    setAttempts(prev => prev + 1)
    setBossAnimation('attack')
    setHeroAnimation('hurt')
    
    // 记录错误
    recordWordError(currentWord.id)
    
    // 第一次错误，显示提示
    if (attempts === 0) {
      setShowHint(true)
    }
    
    // 第二次错误，扣HP并跳过
    if (attempts >= 1) {
      updateHP(-1)
      updateBossSession({
        wrongAttempts: (updateBossSession as any).wrongAttempts + 1
      })
      
      // 检查是否游戏结束
      if (userProfile.currentHP <= 1) {
        setTimeout(() => {
          handleDefeat()
        }, 1000)
      } else {
        setTimeout(() => {
          nextWord()
        }, 2000)
      }
    }
    
    setTimeout(() => {
      setBossAnimation('idle')
      setHeroAnimation('idle')
    }, 1000)
  }
  
  // 下一个单词
  const nextWord = () => {
    const nextIndex = currentWordIndex + 1
    
    if (nextIndex >= words.length) {
      // 所有单词完成
      handleVictory()
    } else {
      setCurrentWordIndex(nextIndex)
      setInput('')
      setAttempts(0)
      setShowHint(false)
      setIsWrong(false)
      updateBossSession({
        currentWordIndex: nextIndex
      })
      
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }
  
  // 胜利
  const handleVictory = () => {
    audioService.play(SoundType.ACHIEVEMENT)
    setBossAnimation('defeat')
    setIsGameOver(true)
    setIsVictory(true)
    
    // 完成Boss
    completeBoss(bossId!)
    
    // 结束会话
    updateBossSession({
      endTime: new Date().toISOString()
    })
    
    setTimeout(() => {
      endBossSession()
    }, 100)
  }
  
  // 失败
  const handleDefeat = () => {
    audioService.play(SoundType.GAME_OVER)
    setIsGameOver(true)
    setIsVictory(false)
    
    // 结束会话
    updateBossSession({
      endTime: new Date().toISOString()
    })
    
    setTimeout(() => {
      endBossSession()
    }, 100)
  }
  
  // 返回
  const handleBack = () => {
    audioService.play(SoundType.MENU_CLICK)
    endBossSession()
    navigate('/levels')
  }
  
  // 重试
  const handleRetry = () => {
    audioService.play(SoundType.MENU_CLICK)
    window.location.reload()
  }
  
  // 获取拼写提示
  const getSpellingHint = () => {
    if (!currentWord || !showHint) return ''
    
    const word = currentWord.word
    const hint = word.split('').map((char, index) => {
      if (index === 0 || index === word.length - 1) {
        return char
      }
      return '_'
    }).join(' ')
    
    return hint
  }
  
  if (!currentWord) {
    return (
      <div className="min-h-screen bg-pixel-black flex items-center justify-center">
        <div className="font-pixel text-pixel-white">加载中...</div>
      </div>
    )
  }
  
  const progress = ((currentWordIndex + 1) / words.length) * 100
  
  return (
    <div className="min-h-screen bg-pixel-black p-4">
      {/* Boss战背景 */}
      <div className="fixed inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-b from-pixel-purple to-pixel-black" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* 顶部状态栏 */}
        <div className="flex items-center justify-between mb-4">
          <HPBar current={userProfile.currentHP} max={userProfile.maxHP} size="sm" />
          
          <div className="font-pixel text-xs text-pixel-white">
            <span className="text-pixel-green">掌握: {masteredWords.length}</span>
            {' | '}
            <span className="text-pixel-yellow">进度: {currentWordIndex + 1}/{words.length}</span>
          </div>
          
          <PixelButton size="sm" variant="secondary" onClick={handleBack}>
            撤退
          </PixelButton>
        </div>
        
        {/* 进度条 */}
        <PixelProgress value={progress} color="yellow" size="sm" className="mb-6" />
        
        {!isGameOver ? (
          <>
            {/* Boss血条 */}
            <div className="mb-6">
              <div className="font-pixel text-pixel-red text-center text-sm mb-2">
                BOSS HP
              </div>
              <PixelProgress 
                value={(bossHP / bossMaxHP) * 100} 
                color="red" 
                size="lg" 
                showText
              />
            </div>
            
            {/* 战斗场景 */}
            <div className="relative h-[300px] bg-pixel-dark-gray border-4 border-pixel-white mb-6">
              {/* Boss */}
              <div className={`
                absolute top-8 right-8 w-32 h-32
                ${bossAnimation === 'hurt' && 'animate-shake'}
                ${bossAnimation === 'attack' && 'animate-pulse'}
                ${bossAnimation === 'defeat' && 'animate-ping opacity-50'}
              `}>
                <div className="w-full h-full bg-pixel-purple border-4 border-pixel-red flex items-center justify-center">
                  <span className="text-6xl">👹</span>
                </div>
              </div>
              
              {/* 英雄 */}
              <div className={`
                absolute bottom-8 left-8 w-20 h-20
                ${heroAnimation === 'attack' && 'animate-pulse'}
                ${heroAnimation === 'hurt' && 'animate-shake'}
              `}>
                <div className="w-full h-full bg-pixel-blue border-2 border-pixel-white flex items-center justify-center">
                  <span className="text-4xl">🎮</span>
                </div>
              </div>
              
              {/* 攻击效果 */}
              {heroAnimation === 'attack' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="text-4xl animate-ping">💥</div>
                </div>
              )}
              
              {/* 单词显示 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <PixelCard className="p-4 bg-pixel-black border-4 border-pixel-yellow">
                  <div className="font-pixel text-pixel-yellow text-2xl text-center mb-2">
                    {currentWord.meaning}
                  </div>
                  {currentWord.phonetic && (
                    <div className="font-pixel text-pixel-white text-sm text-center">
                      {currentWord.phonetic}
                    </div>
                  )}
                </PixelCard>
              </div>
            </div>
            
            {/* 输入区域 */}
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="font-pixel text-pixel-yellow text-sm block mb-2">
                    拼写单词击败Boss：
                  </label>
                  <PixelInput
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    error={isWrong}
                    placeholder="输入英文单词..."
                    className="text-center text-xl"
                    autoFocus
                  />
                </div>
                
                {/* 提示 */}
                {showHint && (
                  <div className="font-pixel text-pixel-yellow text-sm text-center mb-4">
                    提示: {getSpellingHint()}
                  </div>
                )}
                
                {/* 反馈信息 */}
                {isCorrect && (
                  <div className="font-pixel text-pixel-green text-center mb-4 animate-pulse">
                    正确! 干得漂亮!
                  </div>
                )}
                
                {isWrong && attempts === 1 && (
                  <div className="font-pixel text-pixel-red text-center mb-4">
                    拼写错误，再试一次!
                  </div>
                )}
                
                <PixelButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!input.trim() || isCorrect}
                >
                  攻击
                </PixelButton>
              </form>
            </div>
          </>
        ) : (
          /* 游戏结束画面 */
          <PixelCard className="p-8 text-center">
            <h2 className={`font-pixel text-3xl mb-4 ${isVictory ? 'text-pixel-yellow animate-pulse' : 'text-pixel-red'}`}>
              {isVictory ? 'Boss击败！' : '挑战失败！'}
            </h2>
            
            {isVictory && (
              <div className="text-6xl mb-4 animate-bounce">🏆</div>
            )}
            
            <div className="space-y-2 mb-6">
              <div className="font-pixel text-pixel-white">
                正确拼写: <span className="text-pixel-green">{correctSpellings}</span> / {words.length}
              </div>
              <div className="font-pixel text-pixel-white">
                完美掌握: <span className="text-pixel-yellow">{masteredWords.length}</span> 个单词
              </div>
              <div className="font-pixel text-pixel-white text-sm">
                准确率: {Math.round((correctSpellings / words.length) * 100)}%
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              {userProfile.currentHP > 0 && !isVictory && (
                <PixelButton variant="primary" size="lg" onClick={handleRetry}>
                  再次挑战
                </PixelButton>
              )}
              <PixelButton variant="secondary" size="lg" onClick={handleBack}>
                返回选关
              </PixelButton>
            </div>
          </PixelCard>
        )}
      </div>
    </div>
  )
}