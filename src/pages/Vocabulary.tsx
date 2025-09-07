import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '@/stores/useGameStore'
import { PixelCard, PixelButton, PixelInput } from '@/components/pixel'
import { getAllWords, wordLists } from '@/data/vocabulary'
import { audioService } from '@/services/audio'
import { SoundType, WordStatus } from '@/types'
import type { Word } from '@/types'

type FilterType = 'all' | 'new' | 'learning' | 'mastered' | 'error'

export const Vocabulary: React.FC = () => {
  const navigate = useNavigate()
  const { wordStates, getWordStatus } = useGameStore()
  
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedList, setSelectedList] = useState<string>('all')
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [_showTraining, setShowTraining] = useState(false)
  
  // 获取所有单词
  const allWords = getAllWords()
  
  // 统计数据
  const getStatistics = () => {
    let newCount = 0
    let learningCount = 0
    let masteredCount = 0
    let errorCount = 0
    
    allWords.forEach(word => {
      const status = getWordStatus(word.id)
      const state = wordStates[word.id]
      
      switch (status) {
        case WordStatus.NEW:
          newCount++
          break
        case WordStatus.LEARNING:
          learningCount++
          break
        case WordStatus.MASTERED:
          masteredCount++
          break
      }
      
      if (state?.errors > 0) {
        errorCount++
      }
    })
    
    return { newCount, learningCount, masteredCount, errorCount }
  }
  
  const stats = getStatistics()
  
  // 过滤单词
  const getFilteredWords = () => {
    let filtered = allWords
    
    // 按单元过滤
    if (selectedList !== 'all') {
      const list = wordLists.find(l => l.id === selectedList)
      filtered = list ? list.words : []
    }
    
    // 按状态过滤
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(word => {
        const status = getWordStatus(word.id)
        const state = wordStates[word.id]
        
        switch (selectedFilter) {
          case 'new':
            return status === WordStatus.NEW
          case 'learning':
            return status === WordStatus.LEARNING
          case 'mastered':
            return status === WordStatus.MASTERED
          case 'error':
            return state?.errors > 0
          default:
            return true
        }
      })
    }
    
    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(word => 
        word.word.toLowerCase().includes(term) ||
        word.meaning.toLowerCase().includes(term)
      )
    }
    
    return filtered
  }
  
  const filteredWords = getFilteredWords()
  
  // 处理返回
  const handleBack = () => {
    audioService.play(SoundType.MENU_CLICK)
    navigate('/')
  }
  
  // 处理单词点击
  const handleWordClick = (word: Word) => {
    audioService.play(SoundType.MENU_CLICK)
    setSelectedWord(word)
  }
  
  // 处理强化训练
  const handleStartTraining = () => {
    audioService.play(SoundType.MENU_CLICK)
    setShowTraining(true)
    // TODO: 实现强化训练功能
    alert('强化训练功能开发中...')
  }
  
  // 获取状态颜色
  const getStatusColor = (wordId: string) => {
    const status = getWordStatus(wordId)
    switch (status) {
      case WordStatus.MASTERED:
        return 'text-pixel-green'
      case WordStatus.LEARNING:
        return 'text-pixel-yellow'
      default:
        return 'text-pixel-gray'
    }
  }
  
  // 获取状态文字
  const getStatusText = (wordId: string) => {
    const status = getWordStatus(wordId)
    
    switch (status) {
      case WordStatus.MASTERED:
        return '已掌握'
      case WordStatus.LEARNING:
        return '学习中'
      default:
        return '未学习'
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
              #00FF00,
              #00FF00 10px,
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
          
          <h1 className="font-pixel text-pixel-green text-2xl">
            单词兵工厂
          </h1>
          
          <PixelButton 
            size="sm" 
            variant="primary"
            onClick={handleStartTraining}
          >
            强化训练
          </PixelButton>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <PixelCard className="p-4 text-center">
            <div className="font-pixel text-pixel-gray text-xs mb-1">未学习</div>
            <div className="font-pixel text-pixel-white text-2xl">{stats.newCount}</div>
          </PixelCard>
          
          <PixelCard className="p-4 text-center">
            <div className="font-pixel text-pixel-yellow text-xs mb-1">学习中</div>
            <div className="font-pixel text-pixel-white text-2xl">{stats.learningCount}</div>
          </PixelCard>
          
          <PixelCard className="p-4 text-center">
            <div className="font-pixel text-pixel-green text-xs mb-1">已掌握</div>
            <div className="font-pixel text-pixel-white text-2xl">{stats.masteredCount}</div>
          </PixelCard>
          
          <PixelCard className="p-4 text-center">
            <div className="font-pixel text-pixel-red text-xs mb-1">错题集</div>
            <div className="font-pixel text-pixel-white text-2xl">{stats.errorCount}</div>
          </PixelCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：筛选器 */}
          <div className="lg:col-span-1">
            <PixelCard className="p-4">
              {/* 搜索框 */}
              <div className="mb-4">
                <PixelInput
                  type="text"
                  placeholder="搜索单词..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>
              
              {/* 状态筛选 */}
              <div className="mb-4">
                <div className="font-pixel text-pixel-green text-xs mb-2">
                  状态筛选
                </div>
                <div className="space-y-1">
                  {[
                    { value: 'all', label: '全部', color: 'text-pixel-white' },
                    { value: 'new', label: '未学习', color: 'text-pixel-gray' },
                    { value: 'learning', label: '学习中', color: 'text-pixel-yellow' },
                    { value: 'mastered', label: '已掌握', color: 'text-pixel-green' },
                    { value: 'error', label: '错题集', color: 'text-pixel-red' }
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
              </div>
              
              {/* 单元筛选 */}
              <div>
                <div className="font-pixel text-pixel-green text-xs mb-2">
                  单元筛选
                </div>
                <select
                  value={selectedList}
                  onChange={(e) => setSelectedList(e.target.value)}
                  className="w-full p-2 bg-pixel-dark-gray border-2 border-pixel-white font-pixel text-xs text-pixel-white"
                >
                  <option value="all">全部单元</option>
                  {wordLists.slice(0, 7).map(list => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
            </PixelCard>
          </div>
          
          {/* 右侧：单词列表 */}
          <div className="lg:col-span-3">
            <PixelCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-pixel text-pixel-white text-sm">
                  共 {filteredWords.length} 个单词
                </div>
                <div className="font-pixel text-pixel-gray text-xs">
                  点击查看详情
                </div>
              </div>
              
              {/* 单词表格 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-pixel-gray">
                      <th className="text-left p-2 font-pixel text-pixel-green text-xs">单词</th>
                      <th className="text-left p-2 font-pixel text-pixel-green text-xs">释义</th>
                      <th className="text-left p-2 font-pixel text-pixel-green text-xs">难度</th>
                      <th className="text-left p-2 font-pixel text-pixel-green text-xs">状态</th>
                      <th className="text-left p-2 font-pixel text-pixel-green text-xs">错误</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWords.slice(0, 50).map(word => {
                      const state = wordStates[word.id]
                      return (
                        <tr 
                          key={word.id}
                          onClick={() => handleWordClick(word)}
                          className="border-b border-pixel-dark-gray hover:bg-pixel-dark-gray cursor-pointer transition-colors"
                        >
                          <td className="p-2">
                            <div className="font-pixel text-pixel-white text-sm">
                              {word.word}
                            </div>
                            {word.phonetic && (
                              <div className="font-pixel text-pixel-gray text-xs">
                                {word.phonetic}
                              </div>
                            )}
                          </td>
                          <td className="p-2 font-pixel text-pixel-white text-xs">
                            {word.meaning}
                          </td>
                          <td className="p-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span 
                                  key={i}
                                  className={i < word.difficulty ? 'text-pixel-yellow' : 'text-pixel-dark-gray'}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-2">
                            <span className={`font-pixel text-xs ${getStatusColor(word.id)}`}>
                              {getStatusText(word.id)}
                            </span>
                          </td>
                          <td className="p-2 font-pixel text-pixel-red text-xs">
                            {state?.errors || 0}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {filteredWords.length > 50 && (
                <div className="mt-4 text-center font-pixel text-pixel-gray text-xs">
                  仅显示前50个单词
                </div>
              )}
              
              {filteredWords.length === 0 && (
                <div className="text-center py-8 font-pixel text-pixel-gray">
                  没有找到匹配的单词
                </div>
              )}
            </PixelCard>
          </div>
        </div>
        
        {/* 单词详情弹窗 */}
        {selectedWord && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <PixelCard className="p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-pixel text-pixel-yellow text-xl">
                  {selectedWord.word}
                </h3>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="text-pixel-white hover:text-pixel-red"
                >
                  ✕
                </button>
              </div>
              
              {selectedWord.phonetic && (
                <div className="font-pixel text-pixel-white text-sm mb-2">
                  {selectedWord.phonetic}
                </div>
              )}
              
              <div className="font-pixel text-pixel-white text-sm mb-4">
                {selectedWord.meaning}
              </div>
              
              {selectedWord.example && (
                <div className="p-3 bg-pixel-black border-2 border-pixel-gray">
                  <div className="font-pixel text-pixel-green text-xs mb-1">
                    例句：
                  </div>
                  <div className="font-pixel text-pixel-white text-xs">
                    {selectedWord.example}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-between">
                <div className="font-pixel text-xs">
                  <span className="text-pixel-gray">难度：</span>
                  <span className="text-pixel-yellow">
                    {'★'.repeat(selectedWord.difficulty)}
                  </span>
                </div>
                <div className="font-pixel text-xs">
                  <span className="text-pixel-gray">状态：</span>
                  <span className={getStatusColor(selectedWord.id)}>
                    {getStatusText(selectedWord.id)}
                  </span>
                </div>
              </div>
            </PixelCard>
          </div>
        )}
      </div>
    </div>
  )
}