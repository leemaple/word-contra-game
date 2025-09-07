export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: {
    type: 'words_mastered' | 'levels_completed' | 'boss_defeated' | 'perfect_level' | 'streak' | 'total_score'
    value: number
  }
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const achievements: Achievement[] = [
  // 单词掌握成就
  {
    id: 'word_novice',
    name: '初学者',
    description: '掌握10个单词',
    icon: '📚',
    requirement: { type: 'words_mastered', value: 10 },
    points: 10,
    rarity: 'common'
  },
  {
    id: 'word_student',
    name: '好学生',
    description: '掌握50个单词',
    icon: '📖',
    requirement: { type: 'words_mastered', value: 50 },
    points: 25,
    rarity: 'common'
  },
  {
    id: 'word_scholar',
    name: '学者',
    description: '掌握100个单词',
    icon: '🎓',
    requirement: { type: 'words_mastered', value: 100 },
    points: 50,
    rarity: 'rare'
  },
  {
    id: 'word_expert',
    name: '词汇专家',
    description: '掌握200个单词',
    icon: '👨‍🎓',
    requirement: { type: 'words_mastered', value: 200 },
    points: 100,
    rarity: 'epic'
  },
  {
    id: 'word_master',
    name: '词汇大师',
    description: '掌握500个单词',
    icon: '🏆',
    requirement: { type: 'words_mastered', value: 500 },
    points: 200,
    rarity: 'legendary'
  },
  
  // 关卡完成成就
  {
    id: 'level_starter',
    name: '新兵',
    description: '完成第一个关卡',
    icon: '⭐',
    requirement: { type: 'levels_completed', value: 1 },
    points: 10,
    rarity: 'common'
  },
  {
    id: 'level_soldier',
    name: '战士',
    description: '完成5个关卡',
    icon: '🌟',
    requirement: { type: 'levels_completed', value: 5 },
    points: 25,
    rarity: 'common'
  },
  {
    id: 'level_veteran',
    name: '老兵',
    description: '完成10个关卡',
    icon: '✨',
    requirement: { type: 'levels_completed', value: 10 },
    points: 50,
    rarity: 'rare'
  },
  {
    id: 'level_hero',
    name: '英雄',
    description: '完成20个关卡',
    icon: '💫',
    requirement: { type: 'levels_completed', value: 20 },
    points: 100,
    rarity: 'epic'
  },
  
  // Boss战成就
  {
    id: 'boss_slayer_1',
    name: '屠龙者',
    description: '击败第一个Boss',
    icon: '🗡️',
    requirement: { type: 'boss_defeated', value: 1 },
    points: 20,
    rarity: 'common'
  },
  {
    id: 'boss_slayer_3',
    name: '勇者',
    description: '击败3个Boss',
    icon: '⚔️',
    requirement: { type: 'boss_defeated', value: 3 },
    points: 50,
    rarity: 'rare'
  },
  {
    id: 'boss_slayer_7',
    name: '传奇勇者',
    description: '击败7个Boss',
    icon: '🛡️',
    requirement: { type: 'boss_defeated', value: 7 },
    points: 100,
    rarity: 'epic'
  },
  
  // 完美通关成就
  {
    id: 'perfect_1',
    name: '完美主义者',
    description: '完美通关1个关卡（不受伤）',
    icon: '💯',
    requirement: { type: 'perfect_level', value: 1 },
    points: 30,
    rarity: 'rare'
  },
  {
    id: 'perfect_3',
    name: '精确射手',
    description: '完美通关3个关卡',
    icon: '🎯',
    requirement: { type: 'perfect_level', value: 3 },
    points: 75,
    rarity: 'epic'
  },
  
  // 连击成就
  {
    id: 'streak_5',
    name: '连击新手',
    description: '连续答对5题',
    icon: '🔥',
    requirement: { type: 'streak', value: 5 },
    points: 15,
    rarity: 'common'
  },
  {
    id: 'streak_10',
    name: '火力全开',
    description: '连续答对10题',
    icon: '💥',
    requirement: { type: 'streak', value: 10 },
    points: 30,
    rarity: 'rare'
  },
  {
    id: 'streak_20',
    name: '势不可挡',
    description: '连续答对20题',
    icon: '⚡',
    requirement: { type: 'streak', value: 20 },
    points: 60,
    rarity: 'epic'
  },
  
  // 分数成就
  {
    id: 'score_1000',
    name: '得分手',
    description: '累计获得1000分',
    icon: '🌟',
    requirement: { type: 'total_score', value: 1000 },
    points: 10,
    rarity: 'common'
  },
  {
    id: 'score_5000',
    name: '高分玩家',
    description: '累计获得5000分',
    icon: '💎',
    requirement: { type: 'total_score', value: 5000 },
    points: 25,
    rarity: 'rare'
  },
  {
    id: 'score_10000',
    name: '分数之王',
    description: '累计获得10000分',
    icon: '👑',
    requirement: { type: 'total_score', value: 10000 },
    points: 50,
    rarity: 'epic'
  },
  {
    id: 'score_50000',
    name: '传奇玩家',
    description: '累计获得50000分',
    icon: '🏅',
    requirement: { type: 'total_score', value: 50000 },
    points: 150,
    rarity: 'legendary'
  }
]

// 获取成就进度
export const getAchievementProgress = (
  achievement: Achievement,
  stats: {
    wordsMastered: number
    levelsCompleted: number
    bossesDefeated: number
    perfectLevels: number
    maxStreak: number
    totalScore: number
  }
): number => {
  const { type, value } = achievement.requirement
  
  switch (type) {
    case 'words_mastered':
      return Math.min(stats.wordsMastered / value, 1)
    case 'levels_completed':
      return Math.min(stats.levelsCompleted / value, 1)
    case 'boss_defeated':
      return Math.min(stats.bossesDefeated / value, 1)
    case 'perfect_level':
      return Math.min(stats.perfectLevels / value, 1)
    case 'streak':
      return Math.min(stats.maxStreak / value, 1)
    case 'total_score':
      return Math.min(stats.totalScore / value, 1)
    default:
      return 0
  }
}

// 检查是否解锁成就
export const checkAchievementUnlocked = (
  achievement: Achievement,
  stats: {
    wordsMastered: number
    levelsCompleted: number
    bossesDefeated: number
    perfectLevels: number
    maxStreak: number
    totalScore: number
  }
): boolean => {
  return getAchievementProgress(achievement, stats) >= 1
}

// 获取稀有度颜色
export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'text-pixel-white'
    case 'rare':
      return 'text-pixel-blue'
    case 'epic':
      return 'text-pixel-purple'
    case 'legendary':
      return 'text-pixel-yellow'
    default:
      return 'text-pixel-white'
  }
}

// 获取稀有度边框
export const getRarityBorder = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common':
      return 'border-pixel-gray'
    case 'rare':
      return 'border-pixel-blue'
    case 'epic':
      return 'border-pixel-purple'
    case 'legendary':
      return 'border-pixel-yellow'
    default:
      return 'border-pixel-gray'
  }
}