import type {
  UserProfile,
  WordState,
  GameState,
  Settings,
  AppState
} from '@/types'
import {
  STORAGE_KEYS,
  DEFAULT_USER_PROFILE,
  DEFAULT_GAME_STATE,
  DEFAULT_SETTINGS
} from '@/types'

class StorageService {
  // 通用的读取方法
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error)
      return null
    }
  }

  // 通用的写入方法
  private setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error)
      return false
    }
  }

  // 获取用户档案
  getUserProfile(): UserProfile {
    const profile = this.getItem<UserProfile>(STORAGE_KEYS.USER_PROFILE)
    if (!profile) {
      // 首次使用，创建默认档案
      const newProfile = { ...DEFAULT_USER_PROFILE }
      this.setUserProfile(newProfile)
      return newProfile
    }
    return profile
  }

  // 保存用户档案
  setUserProfile(profile: UserProfile): boolean {
    return this.setItem(STORAGE_KEYS.USER_PROFILE, profile)
  }

  // 获取单词状态
  getWordStates(): Record<string, WordState> {
    return this.getItem<Record<string, WordState>>(STORAGE_KEYS.WORD_STATES) || {}
  }

  // 保存单词状态
  setWordStates(states: Record<string, WordState>): boolean {
    return this.setItem(STORAGE_KEYS.WORD_STATES, states)
  }

  // 更新单个单词状态
  updateWordState(wordId: string, state: Partial<WordState>): boolean {
    const states = this.getWordStates()
    states[wordId] = {
      ...states[wordId],
      ...state,
      wordId
    }
    return this.setWordStates(states)
  }

  // 获取游戏状态
  getGameState(): GameState {
    const state = this.getItem<GameState>(STORAGE_KEYS.GAME_STATE)
    if (!state) {
      const newState = { ...DEFAULT_GAME_STATE }
      this.setGameState(newState)
      return newState
    }
    return state
  }

  // 保存游戏状态
  setGameState(state: GameState): boolean {
    return this.setItem(STORAGE_KEYS.GAME_STATE, state)
  }

  // 获取设置
  getSettings(): Settings {
    const settings = this.getItem<Settings>(STORAGE_KEYS.SETTINGS)
    if (!settings) {
      const newSettings = { ...DEFAULT_SETTINGS }
      this.setSettings(newSettings)
      return newSettings
    }
    return settings
  }

  // 保存设置
  setSettings(settings: Settings): boolean {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings)
  }

  // 获取当前会话
  getCurrentSession(): any {
    return this.getItem(STORAGE_KEYS.CURRENT_SESSION)
  }

  // 保存当前会话
  setCurrentSession(session: any): boolean {
    return this.setItem(STORAGE_KEYS.CURRENT_SESSION, session)
  }

  // 清除当前会话
  clearCurrentSession(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION)
  }

  // 获取完整的应用状态
  getAppState(): AppState {
    return {
      userProfile: this.getUserProfile(),
      wordStates: this.getWordStates(),
      gameState: this.getGameState(),
      settings: this.getSettings(),
      currentSession: this.getCurrentSession()
    }
  }

  // 导出所有数据（用于备份）
  exportData(): string {
    const appState = this.getAppState()
    return JSON.stringify(appState, null, 2)
  }

  // 导入数据（从备份恢复）
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as AppState
      
      // 验证数据结构
      if (!data.userProfile || !data.gameState || !data.settings) {
        throw new Error('Invalid data structure')
      }
      
      // 保存各个部分
      this.setUserProfile(data.userProfile)
      this.setWordStates(data.wordStates || {})
      this.setGameState(data.gameState)
      this.setSettings(data.settings)
      
      if (data.currentSession) {
        this.setCurrentSession(data.currentSession)
      }
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // 重置所有数据
  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE)
    localStorage.removeItem(STORAGE_KEYS.WORD_STATES)
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION)
  }

  // 检查是否是新用户
  isNewUser(): boolean {
    return !localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
  }

  // 更新登录时间和HP恢复
  updateLoginStatus(): UserProfile {
    const profile = this.getUserProfile()
    const now = new Date()
    const lastLogin = new Date(profile.lastLoginDate)
    
    // 检查是否是新的一天
    if (this.isDifferentDay(lastLogin, now)) {
      // 新的一天，恢复满血
      profile.currentHP = profile.maxHP
    } else {
      // 同一天，计算时间恢复
      const hoursPassed = Math.floor((now.getTime() - lastLogin.getTime()) / (6 * 60 * 60 * 1000))
      if (hoursPassed > 0) {
        profile.currentHP = Math.min(profile.maxHP, profile.currentHP + hoursPassed)
      }
    }
    
    profile.lastLoginDate = now.toISOString()
    this.setUserProfile(profile)
    return profile
  }

  // 判断是否是不同的日期
  private isDifferentDay(date1: Date, date2: Date): boolean {
    return date1.getDate() !== date2.getDate() ||
           date1.getMonth() !== date2.getMonth() ||
           date1.getFullYear() !== date2.getFullYear()
  }

  // 解锁下一关
  unlockNextLevel(currentLevelId: string): void {
    const gameState = this.getGameState()
    
    // 解析当前关卡ID（格式：list_1_level_1）
    const parts = currentLevelId.split('_')
    const listNum = parseInt(parts[1])
    const levelNum = parseInt(parts[3])
    
    if (levelNum < 5) {
      // 解锁同单元的下一关
      const nextLevelId = `list_${listNum}_level_${levelNum + 1}`
      if (!gameState.unlockedLevels.includes(nextLevelId)) {
        gameState.unlockedLevels.push(nextLevelId)
      }
    } else {
      // 第5关完成，解锁Boss
      const bossId = `list_${listNum}_boss`
      if (!gameState.unlockedBosses.includes(bossId)) {
        gameState.unlockedBosses.push(bossId)
      }
    }
    
    // 标记当前关卡为完成
    if (!gameState.completedLevels.includes(currentLevelId)) {
      gameState.completedLevels.push(currentLevelId)
    }
    
    this.setGameState(gameState)
  }

  // 解锁下一个单元
  unlockNextList(currentListNum: number): void {
    const gameState = this.getGameState()
    const nextListFirstLevel = `list_${currentListNum + 1}_level_1`
    
    if (!gameState.unlockedLevels.includes(nextListFirstLevel)) {
      gameState.unlockedLevels.push(nextListFirstLevel)
    }
    
    this.setGameState(gameState)
  }

  // 添加成就
  addAchievement(achievementId: string): void {
    const profile = this.getUserProfile()
    if (!profile.achievements.includes(achievementId)) {
      profile.achievements.push(achievementId)
      this.setUserProfile(profile)
    }
  }

  // 减少HP
  decreaseHP(amount: number = 1): number {
    const profile = this.getUserProfile()
    profile.currentHP = Math.max(0, profile.currentHP - amount)
    this.setUserProfile(profile)
    return profile.currentHP
  }

  // 增加学习/掌握单词数
  updateWordCounts(learned: number = 0, mastered: number = 0): void {
    const profile = this.getUserProfile()
    profile.totalWordsLearned += learned
    profile.totalWordsMastered += mastered
    this.setUserProfile(profile)
  }
}

// 导出单例
export const storageService = new StorageService()