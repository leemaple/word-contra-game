import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  UserProfile,
  WordState,
  GameState,
  Settings,
  GameSession,
  BossSession
} from '@/types'
import {
  WordStatus,
  DEFAULT_USER_PROFILE,
  DEFAULT_GAME_STATE,
  DEFAULT_SETTINGS
} from '@/types'
import { storageService } from '@/services/storage'

interface GameStore {
  // 状态
  userProfile: UserProfile
  wordStates: Record<string, WordState>
  gameState: GameState
  settings: Settings
  currentSession: GameSession | BossSession | null
  isInitialized: boolean

  // 初始化
  initialize: () => void
  reset: () => void

  // 用户档案相关
  updateHP: (amount: number) => void
  restoreHP: () => void
  addAchievement: (achievementId: string) => void

  // 单词状态相关
  updateWordStatus: (wordId: string, status: WordStatus) => void
  recordWordError: (wordId: string) => void
  getWordStatus: (wordId: string) => WordStatus

  // 游戏进度相关
  unlockLevel: (levelId: string) => void
  completeLevel: (levelId: string) => void
  unlockBoss: (bossId: string) => void
  completeBoss: (bossId: string) => void
  setCurrentLevel: (listId: string, levelId: string) => void

  // 会话相关
  startGameSession: (levelId: string, wordIds: string[]) => void
  updateGameSession: (update: Partial<GameSession>) => void
  endGameSession: () => void
  startBossSession: (bossId: string, wordIds: string[]) => void
  updateBossSession: (update: Partial<BossSession>) => void
  endBossSession: () => void

  // 设置相关
  updateSettings: (settings: Partial<Settings>) => void
  toggleSound: () => void
  toggleMusic: () => void

  // 数据管理
  exportData: () => string
  importData: (jsonString: string) => boolean
}

export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        userProfile: DEFAULT_USER_PROFILE,
        wordStates: {},
        gameState: DEFAULT_GAME_STATE,
        settings: DEFAULT_SETTINGS,
        currentSession: null,
        isInitialized: false,

        // 初始化
        initialize: () => {
          const state = storageService.getAppState()
          // 更新登录状态和HP
          const updatedProfile = storageService.updateLoginStatus()
          
          set({
            userProfile: updatedProfile,
            wordStates: state.wordStates,
            gameState: state.gameState,
            settings: state.settings,
            currentSession: state.currentSession,
            isInitialized: true
          })
        },

        // 重置游戏
        reset: () => {
          storageService.resetAll()
          set({
            userProfile: DEFAULT_USER_PROFILE,
            wordStates: {},
            gameState: DEFAULT_GAME_STATE,
            settings: DEFAULT_SETTINGS,
            currentSession: null
          })
        },

        // 更新HP
        updateHP: (amount: number) => {
          set((state) => {
            const newHP = Math.max(0, Math.min(state.userProfile.maxHP, state.userProfile.currentHP + amount))
            const newProfile = { ...state.userProfile, currentHP: newHP }
            storageService.setUserProfile(newProfile)
            return { userProfile: newProfile }
          })
        },

        // 恢复HP
        restoreHP: () => {
          const updatedProfile = storageService.updateLoginStatus()
          set({ userProfile: updatedProfile })
        },

        // 添加成就
        addAchievement: (achievementId: string) => {
          set((state) => {
            if (state.userProfile.achievements.includes(achievementId)) {
              return state
            }
            const newProfile = {
              ...state.userProfile,
              achievements: [...state.userProfile.achievements, achievementId]
            }
            storageService.setUserProfile(newProfile)
            return { userProfile: newProfile }
          })
        },

        // 更新单词状态
        updateWordStatus: (wordId: string, status: WordStatus) => {
          set((state) => {
            const wordState: WordState = state.wordStates[wordId] || {
              wordId,
              status: WordStatus.NEW,
              errors: 0,
              lastReviewed: null
            }

            const updatedState: WordState = {
              ...wordState,
              status,
              lastReviewed: new Date().toISOString(),
              ...(status === WordStatus.MASTERED ? { masteredAt: new Date().toISOString() } : {})
            }

            const newWordStates = {
              ...state.wordStates,
              [wordId]: updatedState
            }

            storageService.setWordStates(newWordStates)

            // 更新统计
            if (status === WordStatus.LEARNING && wordState.status === WordStatus.NEW) {
              storageService.updateWordCounts(1, 0)
            } else if (status === WordStatus.MASTERED && wordState.status !== WordStatus.MASTERED) {
              storageService.updateWordCounts(0, 1)
            }

            return { wordStates: newWordStates }
          })
        },

        // 记录单词错误
        recordWordError: (wordId: string) => {
          set((state) => {
            const wordState: WordState = state.wordStates[wordId] || {
              wordId,
              status: WordStatus.NEW,
              errors: 0,
              lastReviewed: null
            }

            const updatedState: WordState = {
              ...wordState,
              errors: wordState.errors + 1,
              lastReviewed: new Date().toISOString()
            }

            const newWordStates = {
              ...state.wordStates,
              [wordId]: updatedState
            }

            storageService.setWordStates(newWordStates)
            return { wordStates: newWordStates }
          })
        },

        // 获取单词状态
        getWordStatus: (wordId: string) => {
          const state = get()
          return state.wordStates[wordId]?.status || WordStatus.NEW
        },

        // 解锁关卡
        unlockLevel: (levelId: string) => {
          set((state) => {
            if (state.gameState.unlockedLevels.includes(levelId)) {
              return state
            }
            const newGameState = {
              ...state.gameState,
              unlockedLevels: [...state.gameState.unlockedLevels, levelId]
            }
            storageService.setGameState(newGameState)
            return { gameState: newGameState }
          })
        },

        // 完成关卡
        completeLevel: (levelId: string) => {
          set((_state) => {
            // 自动解锁下一关
            storageService.unlockNextLevel(levelId)
            const updatedGameState = storageService.getGameState()

            return { gameState: updatedGameState }
          })
        },

        // 解锁Boss
        unlockBoss: (bossId: string) => {
          set((state) => {
            if (state.gameState.unlockedBosses.includes(bossId)) {
              return state
            }
            const newGameState = {
              ...state.gameState,
              unlockedBosses: [...state.gameState.unlockedBosses, bossId]
            }
            storageService.setGameState(newGameState)
            return { gameState: newGameState }
          })
        },

        // 完成Boss
        completeBoss: (bossId: string) => {
          set((_state) => {
            // 解锁下一个单元
            const listNum = parseInt(bossId.split('_')[1])
            storageService.unlockNextList(listNum)
            const updatedGameState = storageService.getGameState()

            return { gameState: updatedGameState }
          })
        },

        // 设置当前关卡
        setCurrentLevel: (listId: string, levelId: string) => {
          set((state) => {
            const newGameState = {
              ...state.gameState,
              currentListId: listId,
              currentLevelId: levelId
            }
            storageService.setGameState(newGameState)
            return { gameState: newGameState }
          })
        },

        // 开始游戏会话
        startGameSession: (levelId: string, wordIds: string[]) => {
          const session: GameSession = {
            levelId,
            currentWordIndex: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            startTime: new Date().toISOString(),
            score: 0,
            wordsInSession: wordIds,
            mistakes: []
          }
          storageService.setCurrentSession(session)
          set({ currentSession: session })
        },

        // 更新游戏会话
        updateGameSession: (update: Partial<GameSession>) => {
          set((state) => {
            if (!state.currentSession || !('levelId' in state.currentSession)) {
              return state
            }
            const updatedSession = {
              ...state.currentSession,
              ...update
            } as GameSession
            storageService.setCurrentSession(updatedSession)
            return { currentSession: updatedSession }
          })
        },

        // 结束游戏会话
        endGameSession: () => {
          storageService.clearCurrentSession()
          set({ currentSession: null })
        },

        // 开始Boss会话
        startBossSession: (bossId: string, wordIds: string[]) => {
          const session: BossSession = {
            bossId,
            currentWordIndex: 0,
            totalWords: wordIds.length,
            correctSpellings: 0,
            wrongAttempts: 0,
            startTime: new Date().toISOString(),
            wordsInSession: wordIds,
            masteredWords: []
          }
          storageService.setCurrentSession(session)
          set({ currentSession: session })
        },

        // 更新Boss会话
        updateBossSession: (update: Partial<BossSession>) => {
          set((state) => {
            if (!state.currentSession || !('bossId' in state.currentSession)) {
              return state
            }
            const updatedSession = {
              ...state.currentSession,
              ...update
            } as BossSession
            storageService.setCurrentSession(updatedSession)
            return { currentSession: updatedSession }
          })
        },

        // 结束Boss会话
        endBossSession: () => {
          storageService.clearCurrentSession()
          set({ currentSession: null })
        },

        // 更新设置
        updateSettings: (settings: Partial<Settings>) => {
          set((state) => {
            const newSettings = { ...state.settings, ...settings }
            storageService.setSettings(newSettings)
            return { settings: newSettings }
          })
        },

        // 切换音效
        toggleSound: () => {
          set((state) => {
            const newSettings = { ...state.settings, soundOn: !state.settings.soundOn }
            storageService.setSettings(newSettings)
            return { settings: newSettings }
          })
        },

        // 切换音乐
        toggleMusic: () => {
          set((state) => {
            const newSettings = { ...state.settings, musicOn: !state.settings.musicOn }
            storageService.setSettings(newSettings)
            return { settings: newSettings }
          })
        },

        // 导出数据
        exportData: () => {
          return storageService.exportData()
        },

        // 导入数据
        importData: (jsonString: string) => {
          const success = storageService.importData(jsonString)
          if (success) {
            get().initialize()
          }
          return success
        }
      }),
      {
        name: 'word-contra-game-store',
        partialize: (state) => ({
          // 只持久化必要的数据
          userProfile: state.userProfile,
          wordStates: state.wordStates,
          gameState: state.gameState,
          settings: state.settings
        })
      }
    )
  )
)