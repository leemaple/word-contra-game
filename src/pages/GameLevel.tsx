import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/useGameStore'
import { PixelCard, PixelButton, HPBar, PixelProgress } from '@/components/pixel'
import { getWordsByListId, generateDistractors } from '@/data/vocabulary'
import { audioService } from '@/services/audio'
import { SoundType, WordStatus } from '@/types'
import type { Word, QuizOption } from '@/types'

export const GameLevel: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const { 
    userProfile,
    currentSession,
    updateHP,
    updateWordStatus,
    recordWordError,
    startGameSession,
    updateGameSession,
    endGameSession,
    completeLevel
  } = useGameStore()
  
  // 游戏状态
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [words, setWords] = useState<Word[]>([])
  const [options, setOptions] = useState<QuizOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isVictory, setIsVictory] = useState(false)
  
  // 动画状态
  const [heroAnimation, setHeroAnimation] = useState<'idle' | 'shoot' | 'hurt'>('idle')
  const [enemyAnimation, setEnemyAnimation] = useState<'idle' | 'hit' | 'explode'>('idle')
  const [showDamage, setShowDamage] = useState(false)
  
  // 初始化关卡
  useEffect(() => {
    if (!levelId) return
    
    // 解析关卡ID（格式：list_1_level_1）
    const parts = levelId.split('_')
    const listId = `${parts[0]}_${parts[1]}`
    
    // 获取该单元的所有单词
    const allWords = getWordsByListId(listId)
    
    // 随机选择20个单词作为本关卡的单词
    const shuffled = [...allWords].sort(() => Math.random() - 0.5)
    const levelWords = shuffled.slice(0, Math.min(20, shuffled.length))
    
    setWords(levelWords)
    
    // 开始游戏会话
    const wordIds = levelWords.map(w => w.id)
    startGameSession(levelId, wordIds)
    
    // 生成第一题
    if (levelWords.length > 0) {
      generateQuestion(levelWords[0])
    }
  }, [levelId, startGameSession])
  
  // 生成题目选项
  const generateQuestion = (word: Word) => {
    const correctOption: QuizOption = {
      id: 'correct',
      text: word.meaning,
      isCorrect: true
    }
    
    const distractorTexts = generateDistractors(word, 3)
    const distractorOptions: QuizOption[] = distractorTexts.map((text, index) => ({
      id: `distractor_${index}`,
      text,
      isCorrect: false
    }))
    
    // 打乱选项顺序
    const allOptions = [correctOption, ...distractorOptions].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
    setSelectedOption(null)
    setIsAnswered(false)
  }
  
  // 处理选择答案
  const handleSelectOption = (optionId: string) => {
    if (isAnswered || isGameOver) return
    
    const option = options.find(o => o.id === optionId)
    if (!option) return
    
    setSelectedOption(optionId)
    setIsAnswered(true)
    
    const currentWord = words[currentWordIndex]
    
    if (option.isCorrect) {
      // 正确答案
      audioService.play(SoundType.SHOOT)
      setHeroAnimation('shoot')
      setEnemyAnimation('hit')
      
      setTimeout(() => {
        audioService.play(SoundType.EXPLOSION)
        setEnemyAnimation('explode')
      }, 200)
      
      setCorrectCount(prev => prev + 1)
      setScore(prev => prev + 100)
      
      // 更新单词状态
      updateWordStatus(currentWord.id, WordStatus.LEARNING)
      
      // 更新会话
      updateGameSession({
        correctAnswers: correctCount + 1,
        score: score + 100
      })
      
      setTimeout(() => {
        handleNextWord()
      }, 1500)
      
    } else {
      // 错误答案
      audioService.play(SoundType.HURT)
      setHeroAnimation('hurt')
      setShowDamage(true)
      
      setWrongCount(prev => prev + 1)
      updateHP(-1)
      
      // 记录错误
      recordWordError(currentWord.id)
      
      // 更新会话
      updateGameSession({
        wrongAnswers: wrongCount + 1,
        mistakes: [...(currentSession as any)?.mistakes || [], currentWord.id]
      })
      
      // 检查是否游戏结束
      if (userProfile.currentHP <= 1) {
        setTimeout(() => {
          handleGameOver(false)
        }, 1500)
      } else {
        setTimeout(() => {
          handleNextWord()
        }, 2000)
      }
    }
    
    setTimeout(() => {
      setHeroAnimation('idle')
      setEnemyAnimation('idle')
      setShowDamage(false)
    }, 1000)
  }
  
  // 下一个单词
  const handleNextWord = () => {
    const nextIndex = currentWordIndex + 1
    
    if (nextIndex >= words.length) {
      // 关卡完成
      handleGameOver(true)
    } else {
      setCurrentWordIndex(nextIndex)
      generateQuestion(words[nextIndex])
      updateGameSession({
        currentWordIndex: nextIndex
      })
    }
  }
  
  // 游戏结束
  const handleGameOver = (victory: boolean) => {
    setIsGameOver(true)
    setIsVictory(victory)
    
    if (victory) {
      audioService.play(SoundType.ACHIEVEMENT)
      completeLevel(levelId!)
      
      // 计算奖励分数
      const bonusScore = userProfile.currentHP * 50
      setScore(prev => prev + bonusScore)
    } else {
      audioService.play(SoundType.GAME_OVER)
    }
    
    // 结束会话
    updateGameSession({
      endTime: new Date().toISOString(),
      score: score + (victory ? userProfile.currentHP * 50 : 0)
    })
    
    setTimeout(() => {
      endGameSession()
    }, 100)
  }
  
  // 返回关卡选择
  const handleBack = () => {
    audioService.play(SoundType.MENU_CLICK)
    if (currentSession) {
      endGameSession()
    }
    navigate('/levels')
  }
  
  // 重试关卡
  const handleRetry = () => {
    audioService.play(SoundType.MENU_CLICK)
    window.location.reload()
  }
  
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-pixel-black flex items-center justify-center">
        <div className="font-pixel text-pixel-white">加载中...</div>
      </div>
    )
  }
  
  const currentWord = words[currentWordIndex]
  const progress = ((currentWordIndex + 1) / words.length) * 100
  
  return (
    <div className="min-h-screen bg-pixel-black p-4">
      {/* 游戏背景 */}
      <div className="fixed inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-b from-pixel-dark-blue to-pixel-black" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* 顶部状态栏 */}
        <div className="flex items-center justify-between mb-4">
          <HPBar current={userProfile.currentHP} max={userProfile.maxHP} size="sm" />
          
          <div className="font-pixel text-xs text-pixel-white">
            <span className="text-pixel-yellow">得分: {score}</span>
            {' | '}
            <span className="text-pixel-green">正确: {correctCount}</span>
            {' | '}
            <span className="text-pixel-red">错误: {wrongCount}</span>
          </div>
          
          <PixelButton size="sm" variant="secondary" onClick={handleBack}>
            暂停
          </PixelButton>
        </div>
        
        {/* 进度条 */}
        <PixelProgress value={progress} color="green" size="sm" className="mb-6" />
        
        {/* 游戏主区域 */}
        {!isGameOver ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：游戏场景 */}
            <div className="relative h-[400px] bg-pixel-dark-gray border-4 border-pixel-white p-8">
              {/* 英雄 */}
              <div className={`
                absolute bottom-8 left-8 w-16 h-16 bg-pixel-blue border-2 border-pixel-white
                ${heroAnimation === 'shoot' && 'animate-pulse'}
                ${heroAnimation === 'hurt' && 'animate-shake bg-pixel-red'}
              `}>
                <div className="text-2xl text-center mt-2">🎮</div>
              </div>
              
              {/* 敌人（单词） */}
              <div className={`
                absolute top-1/2 right-8 transform -translate-y-1/2
                ${enemyAnimation === 'hit' && 'animate-shake'}
                ${enemyAnimation === 'explode' && 'animate-ping'}
              `}>
                <div className="bg-pixel-dark-red border-2 border-pixel-red p-4">
                  <div className="font-pixel text-pixel-white text-xl">
                    {currentWord.word}
                  </div>
                  {currentWord.phonetic && (
                    <div className="font-pixel text-pixel-yellow text-xs mt-1">
                      {currentWord.phonetic}
                    </div>
                  )}
                </div>
              </div>
              
              {/* 伤害提示 */}
              {showDamage && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="font-pixel text-pixel-red text-3xl animate-ping">
                    -1 HP
                  </div>
                </div>
              )}
              
              {/* 子弹效果 */}
              {heroAnimation === 'shoot' && (
                <div className="absolute bottom-12 left-24 w-8 h-1 bg-pixel-yellow animate-pulse" />
              )}
            </div>
            
            {/* 右侧：选项 */}
            <div className="space-y-4">
              <div className="font-pixel text-pixel-yellow text-lg mb-4">
                选择正确的中文释义：
              </div>
              
              {options.map((option) => (
                <PixelButton
                  key={option.id}
                  variant={
                    isAnswered
                      ? option.isCorrect
                        ? 'success'
                        : selectedOption === option.id
                        ? 'danger'
                        : 'secondary'
                      : 'primary'
                  }
                  size="lg"
                  className={`
                    w-full text-left
                    ${isAnswered && !option.isCorrect && selectedOption !== option.id && 'opacity-50'}
                  `}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isAnswered}
                >
                  {option.text}
                </PixelButton>
              ))}
              
              <div className="text-center font-pixel text-xs text-pixel-gray mt-4">
                第 {currentWordIndex + 1} / {words.length} 题
              </div>
            </div>
          </div>
        ) : (
          /* 游戏结束画面 */
          <PixelCard className="p-8 text-center">
            <h2 className={`font-pixel text-3xl mb-4 ${isVictory ? 'text-pixel-green' : 'text-pixel-red'}`}>
              {isVictory ? '任务完成！' : '任务失败！'}
            </h2>
            
            <div className="space-y-2 mb-6">
              <div className="font-pixel text-pixel-white">
                最终得分: <span className="text-pixel-yellow text-xl">{score}</span>
              </div>
              <div className="font-pixel text-pixel-white text-sm">
                正确: {correctCount} / {words.length}
              </div>
              <div className="font-pixel text-pixel-white text-sm">
                准确率: {Math.round((correctCount / words.length) * 100)}%
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              {userProfile.currentHP > 0 && (
                <PixelButton variant="primary" size="lg" onClick={handleRetry}>
                  重新挑战
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