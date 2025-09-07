// 单词状态
export enum WordStatus {
  NEW = 'new',
  LEARNING = 'learning',
  MASTERED = 'mastered'
}

// 单词数据结构
export interface Word {
  id: string
  word: string
  meaning: string
  phonetic?: string
  example?: string
  difficulty: 1 | 2 | 3 | 4 | 5
}

// 单词学习状态
export interface WordState {
  wordId: string
  status: WordStatus
  errors: number
  lastReviewed: string | null
  masteredAt?: string
}

// 单词列表（单元）
export interface WordList {
  id: string
  name: string
  description: string
  words: Word[]
}

// 关卡信息
export interface Level {
  id: string
  listId: string
  levelNumber: number // 1-5
  name: string
  isUnlocked: boolean
  isCompleted: boolean
  highScore?: number
  completedAt?: string
}

// Boss关卡信息
export interface BossLevel {
  id: string
  listId: string
  name: string
  isUnlocked: boolean
  isCompleted: boolean
  completedAt?: string
}

// 用户档案
export interface UserProfile {
  currentHP: number
  maxHP: number
  lastLoginDate: string
  totalWordsLearned: number
  totalWordsMastered: number
  achievements: string[]
  createdAt: string
  totalScore?: number
}

// 游戏状态
export interface GameState {
  currentListId?: string
  currentLevelId?: string
  unlockedLevels: string[]
  unlockedBosses: string[]
  completedLevels: string[]
  completedBosses: string[]
  defeatedBosses: string[]
  perfectLevels?: string[]
  maxStreak?: number
}

// 设置
export interface Settings {
  soundOn: boolean
  musicOn: boolean
  volumeLevel: number
  soundVolume: number
  musicVolume: number
  vibration: boolean
  showPhonetic: boolean
  showExample: boolean
  autoPlaySound: boolean
}

// 成就
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  progress?: number
  maxProgress?: number
}

// 游戏会话（关卡进行中的状态）
export interface GameSession {
  levelId: string
  currentWordIndex: number
  correctAnswers: number
  wrongAnswers: number
  startTime: string
  endTime?: string
  score: number
  wordsInSession: string[] // 本次关卡的单词ID列表
  mistakes: string[] // 错误的单词ID列表
}

// Boss战会话
export interface BossSession {
  bossId: string
  currentWordIndex: number
  totalWords: number
  correctSpellings: number
  wrongAttempts: number
  startTime: string
  endTime?: string
  wordsInSession: string[]
  masteredWords: string[] // 第一次就拼对的单词
}

// 答题选项
export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

// 关卡选择题
export interface LevelQuiz {
  word: Word
  options: QuizOption[]
  timeLimit?: number
}

// 音效类型
export enum SoundType {
  SHOOT = 'shoot',
  EXPLOSION = 'explosion',
  HIT = 'hit',
  HURT = 'hurt',
  LEVEL_COMPLETE = 'level_complete',
  BOSS_DEFEAT = 'boss_defeat',
  GAME_OVER = 'game_over',
  ACHIEVEMENT = 'achievement',
  MENU_CLICK = 'menu_click'
}

// 精灵动画状态
export enum SpriteAnimation {
  IDLE = 'idle',
  RUN = 'run',
  SHOOT = 'shoot',
  HURT = 'hurt',
  DEATH = 'death',
  VICTORY = 'victory'
}

// 敌人类型
export enum EnemyType {
  SOLDIER = 'soldier',
  TURRET = 'turret',
  FLYING = 'flying',
  BOSS = 'boss'
}

// 场景背景
export enum SceneBackground {
  JUNGLE = 'jungle',
  BASE = 'base',
  WATERFALL = 'waterfall',
  BOSS_LAIR = 'boss_lair'
}

// 完整的应用状态
export interface AppState {
  userProfile: UserProfile
  wordStates: Record<string, WordState>
  gameState: GameState
  settings: Settings
  currentSession?: GameSession | BossSession
}

// localStorage键名
export const STORAGE_KEYS = {
  USER_PROFILE: 'wordContra_userProfile',
  WORD_STATES: 'wordContra_wordStates',
  GAME_STATE: 'wordContra_gameState',
  SETTINGS: 'wordContra_settings',
  CURRENT_SESSION: 'wordContra_currentSession'
} as const

// 成就ID常量
export const ACHIEVEMENT_IDS = {
  FIRST_BLOOD: 'first_blood', // 第一次通关
  PERFECT_SCORE: 'perfect_score', // 满分通关
  BOSS_SLAYER: 'boss_slayer', // 击败第一个Boss
  WORD_MASTER: 'word_master', // 掌握100个单词
  SPEED_DEMON: 'speed_demon', // 快速通关
  NO_DAMAGE: 'no_damage', // 无伤通关
  DAILY_WARRIOR: 'daily_warrior', // 连续7天登录
  VOCABULARY_KING: 'vocabulary_king' // 掌握1000个单词
} as const

// 默认设置
export const DEFAULT_SETTINGS: Settings = {
  soundOn: true,
  musicOn: true,
  volumeLevel: 0.7,
  soundVolume: 70,
  musicVolume: 50,
  vibration: false,
  showPhonetic: true,
  showExample: true,
  autoPlaySound: false
}

// 默认用户档案
export const DEFAULT_USER_PROFILE: UserProfile = {
  currentHP: 3,
  maxHP: 3,
  lastLoginDate: new Date().toISOString(),
  totalWordsLearned: 0,
  totalWordsMastered: 0,
  achievements: [],
  createdAt: new Date().toISOString()
}

// 默认游戏状态
export const DEFAULT_GAME_STATE: GameState = {
  unlockedLevels: ['list_1_level_1'], // 默认解锁第一关
  unlockedBosses: [],
  completedLevels: [],
  completedBosses: [],
  defeatedBosses: [],
  perfectLevels: [],
  maxStreak: 0
}