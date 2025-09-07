export interface Word {
  id: string
  word: string
  meaning: string
  phonetic?: string
  example?: string
  difficulty: 1 | 2 | 3 | 4 | 5
}

export interface WordList {
  id: string
  name: string
  description: string
  words: Word[]
}

// 高考3500词汇 - 示例数据（第一批100个词）
const gaokao3500Words: Word[] = [
  // List 1 - 基础词汇 (100个)
  { id: 'w001', word: 'abandon', meaning: '放弃，抛弃', phonetic: '/əˈbændən/', difficulty: 2 },
  { id: 'w002', word: 'ability', meaning: '能力，才能', phonetic: '/əˈbɪləti/', difficulty: 1 },
  { id: 'w003', word: 'able', meaning: '能够的，有能力的', phonetic: '/ˈeɪbl/', difficulty: 1 },
  { id: 'w004', word: 'about', meaning: '关于，大约', phonetic: '/əˈbaʊt/', difficulty: 1 },
  { id: 'w005', word: 'above', meaning: '在...上面', phonetic: '/əˈbʌv/', difficulty: 1 },
  { id: 'w006', word: 'abroad', meaning: '在国外，到国外', phonetic: '/əˈbrɔːd/', difficulty: 2 },
  { id: 'w007', word: 'absent', meaning: '缺席的，缺少的', phonetic: '/ˈæbsənt/', difficulty: 2 },
  { id: 'w008', word: 'absolute', meaning: '绝对的，完全的', phonetic: '/ˈæbsəluːt/', difficulty: 3 },
  { id: 'w009', word: 'absorb', meaning: '吸收，吸引', phonetic: '/əbˈzɔːb/', difficulty: 3 },
  { id: 'w010', word: 'abstract', meaning: '抽象的，摘要', phonetic: '/ˈæbstrækt/', difficulty: 4 },
  { id: 'w011', word: 'abundant', meaning: '丰富的，充裕的', phonetic: '/əˈbʌndənt/', difficulty: 3 },
  { id: 'w012', word: 'abuse', meaning: '滥用，虐待', phonetic: '/əˈbjuːz/', difficulty: 3 },
  { id: 'w013', word: 'academic', meaning: '学术的，学院的', phonetic: '/ˌækəˈdemɪk/', difficulty: 2 },
  { id: 'w014', word: 'accept', meaning: '接受，接纳', phonetic: '/əkˈsept/', difficulty: 1 },
  { id: 'w015', word: 'access', meaning: '通道，接近', phonetic: '/ˈækses/', difficulty: 2 },
  { id: 'w016', word: 'accident', meaning: '事故，意外', phonetic: '/ˈæksɪdənt/', difficulty: 1 },
  { id: 'w017', word: 'accompany', meaning: '陪伴，伴随', phonetic: '/əˈkʌmpəni/', difficulty: 2 },
  { id: 'w018', word: 'accomplish', meaning: '完成，实现', phonetic: '/əˈkʌmplɪʃ/', difficulty: 3 },
  { id: 'w019', word: 'according', meaning: '根据，按照', phonetic: '/əˈkɔːdɪŋ/', difficulty: 2 },
  { id: 'w020', word: 'account', meaning: '账户，描述', phonetic: '/əˈkaʊnt/', difficulty: 2 },
  { id: 'w021', word: 'accurate', meaning: '准确的，精确的', phonetic: '/ˈækjərət/', difficulty: 3 },
  { id: 'w022', word: 'accuse', meaning: '指责，控告', phonetic: '/əˈkjuːz/', difficulty: 3 },
  { id: 'w023', word: 'achieve', meaning: '达到，完成', phonetic: '/əˈtʃiːv/', difficulty: 2 },
  { id: 'w024', word: 'acknowledge', meaning: '承认，确认', phonetic: '/əkˈnɒlɪdʒ/', difficulty: 3 },
  { id: 'w025', word: 'acquire', meaning: '获得，取得', phonetic: '/əˈkwaɪə/', difficulty: 3 },
  { id: 'w026', word: 'across', meaning: '穿过，横过', phonetic: '/əˈkrɒs/', difficulty: 1 },
  { id: 'w027', word: 'act', meaning: '行动，表演', phonetic: '/ækt/', difficulty: 1 },
  { id: 'w028', word: 'action', meaning: '行动，行为', phonetic: '/ˈækʃn/', difficulty: 1 },
  { id: 'w029', word: 'active', meaning: '积极的，活跃的', phonetic: '/ˈæktɪv/', difficulty: 1 },
  { id: 'w030', word: 'activity', meaning: '活动，活跃', phonetic: '/ækˈtɪvəti/', difficulty: 1 },
  { id: 'w031', word: 'actor', meaning: '演员', phonetic: '/ˈæktə/', difficulty: 1 },
  { id: 'w032', word: 'actress', meaning: '女演员', phonetic: '/ˈæktrəs/', difficulty: 1 },
  { id: 'w033', word: 'actual', meaning: '实际的，真实的', phonetic: '/ˈæktʃuəl/', difficulty: 2 },
  { id: 'w034', word: 'adapt', meaning: '适应，改编', phonetic: '/əˈdæpt/', difficulty: 3 },
  { id: 'w035', word: 'add', meaning: '添加，增加', phonetic: '/æd/', difficulty: 1 },
  { id: 'w036', word: 'addition', meaning: '加法，增加', phonetic: '/əˈdɪʃn/', difficulty: 2 },
  { id: 'w037', word: 'address', meaning: '地址，演讲', phonetic: '/əˈdres/', difficulty: 1 },
  { id: 'w038', word: 'adequate', meaning: '充足的，适当的', phonetic: '/ˈædɪkwət/', difficulty: 3 },
  { id: 'w039', word: 'adjust', meaning: '调整，适应', phonetic: '/əˈdʒʌst/', difficulty: 2 },
  { id: 'w040', word: 'administration', meaning: '管理，行政', phonetic: '/ədˌmɪnɪˈstreɪʃn/', difficulty: 3 },
  { id: 'w041', word: 'admire', meaning: '钦佩，赞美', phonetic: '/ədˈmaɪə/', difficulty: 2 },
  { id: 'w042', word: 'admit', meaning: '承认，准许进入', phonetic: '/ədˈmɪt/', difficulty: 2 },
  { id: 'w043', word: 'adopt', meaning: '采用，收养', phonetic: '/əˈdɒpt/', difficulty: 3 },
  { id: 'w044', word: 'adult', meaning: '成年人', phonetic: '/ˈædʌlt/', difficulty: 1 },
  { id: 'w045', word: 'advance', meaning: '前进，进步', phonetic: '/ədˈvɑːns/', difficulty: 2 },
  { id: 'w046', word: 'advantage', meaning: '优势，有利条件', phonetic: '/ədˈvɑːntɪdʒ/', difficulty: 2 },
  { id: 'w047', word: 'adventure', meaning: '冒险，奇遇', phonetic: '/ədˈventʃə/', difficulty: 2 },
  { id: 'w048', word: 'advertise', meaning: '做广告，宣传', phonetic: '/ˈædvətaɪz/', difficulty: 2 },
  { id: 'w049', word: 'advice', meaning: '建议，忠告', phonetic: '/ədˈvaɪs/', difficulty: 1 },
  { id: 'w050', word: 'advise', meaning: '建议，劝告', phonetic: '/ədˈvaɪz/', difficulty: 2 },
  { id: 'w051', word: 'affair', meaning: '事务，事情', phonetic: '/əˈfeə/', difficulty: 2 },
  { id: 'w052', word: 'affect', meaning: '影响，感动', phonetic: '/əˈfekt/', difficulty: 2 },
  { id: 'w053', word: 'afford', meaning: '负担得起', phonetic: '/əˈfɔːd/', difficulty: 2 },
  { id: 'w054', word: 'afraid', meaning: '害怕的，担心的', phonetic: '/əˈfreɪd/', difficulty: 1 },
  { id: 'w055', word: 'after', meaning: '在...之后', phonetic: '/ˈɑːftə/', difficulty: 1 },
  { id: 'w056', word: 'afternoon', meaning: '下午', phonetic: '/ˌɑːftəˈnuːn/', difficulty: 1 },
  { id: 'w057', word: 'again', meaning: '再次，又', phonetic: '/əˈgen/', difficulty: 1 },
  { id: 'w058', word: 'against', meaning: '反对，对着', phonetic: '/əˈgenst/', difficulty: 2 },
  { id: 'w059', word: 'age', meaning: '年龄，时代', phonetic: '/eɪdʒ/', difficulty: 1 },
  { id: 'w060', word: 'agency', meaning: '代理，机构', phonetic: '/ˈeɪdʒənsi/', difficulty: 3 },
  { id: 'w061', word: 'agent', meaning: '代理人，特工', phonetic: '/ˈeɪdʒənt/', difficulty: 2 },
  { id: 'w062', word: 'aggressive', meaning: '侵略的，好斗的', phonetic: '/əˈgresɪv/', difficulty: 3 },
  { id: 'w063', word: 'ago', meaning: '以前', phonetic: '/əˈgəʊ/', difficulty: 1 },
  { id: 'w064', word: 'agree', meaning: '同意，赞成', phonetic: '/əˈgriː/', difficulty: 1 },
  { id: 'w065', word: 'agreement', meaning: '协议，同意', phonetic: '/əˈgriːmənt/', difficulty: 2 },
  { id: 'w066', word: 'agriculture', meaning: '农业', phonetic: '/ˈægrɪkʌltʃə/', difficulty: 3 },
  { id: 'w067', word: 'ahead', meaning: '在前面，提前', phonetic: '/əˈhed/', difficulty: 2 },
  { id: 'w068', word: 'aid', meaning: '援助，帮助', phonetic: '/eɪd/', difficulty: 2 },
  { id: 'w069', word: 'aim', meaning: '目标，瞄准', phonetic: '/eɪm/', difficulty: 2 },
  { id: 'w070', word: 'air', meaning: '空气，空中', phonetic: '/eə/', difficulty: 1 },
  { id: 'w071', word: 'aircraft', meaning: '飞机，航空器', phonetic: '/ˈeəkrɑːft/', difficulty: 2 },
  { id: 'w072', word: 'airline', meaning: '航空公司', phonetic: '/ˈeəlaɪn/', difficulty: 2 },
  { id: 'w073', word: 'airplane', meaning: '飞机', phonetic: '/ˈeəpleɪn/', difficulty: 1 },
  { id: 'w074', word: 'airport', meaning: '机场', phonetic: '/ˈeəpɔːt/', difficulty: 1 },
  { id: 'w075', word: 'alarm', meaning: '警报，惊慌', phonetic: '/əˈlɑːm/', difficulty: 2 },
  { id: 'w076', word: 'album', meaning: '相册，专辑', phonetic: '/ˈælbəm/', difficulty: 2 },
  { id: 'w077', word: 'alcohol', meaning: '酒精，酒', phonetic: '/ˈælkəhɒl/', difficulty: 2 },
  { id: 'w078', word: 'alike', meaning: '相似的，同样地', phonetic: '/əˈlaɪk/', difficulty: 2 },
  { id: 'w079', word: 'alive', meaning: '活着的，活泼的', phonetic: '/əˈlaɪv/', difficulty: 1 },
  { id: 'w080', word: 'all', meaning: '全部，所有', phonetic: '/ɔːl/', difficulty: 1 },
  { id: 'w081', word: 'allow', meaning: '允许，准许', phonetic: '/əˈlaʊ/', difficulty: 2 },
  { id: 'w082', word: 'almost', meaning: '几乎，差不多', phonetic: '/ˈɔːlməʊst/', difficulty: 1 },
  { id: 'w083', word: 'alone', meaning: '独自，单独', phonetic: '/əˈləʊn/', difficulty: 1 },
  { id: 'w084', word: 'along', meaning: '沿着，一起', phonetic: '/əˈlɒŋ/', difficulty: 1 },
  { id: 'w085', word: 'alongside', meaning: '在...旁边', phonetic: '/əˌlɒŋˈsaɪd/', difficulty: 3 },
  { id: 'w086', word: 'aloud', meaning: '大声地', phonetic: '/əˈlaʊd/', difficulty: 2 },
  { id: 'w087', word: 'already', meaning: '已经', phonetic: '/ɔːlˈredi/', difficulty: 1 },
  { id: 'w088', word: 'also', meaning: '也，同样', phonetic: '/ˈɔːlsəʊ/', difficulty: 1 },
  { id: 'w089', word: 'alternative', meaning: '可选择的，替代的', phonetic: '/ɔːlˈtɜːnətɪv/', difficulty: 3 },
  { id: 'w090', word: 'although', meaning: '虽然，尽管', phonetic: '/ɔːlˈðəʊ/', difficulty: 2 },
  { id: 'w091', word: 'altogether', meaning: '完全，总共', phonetic: '/ˌɔːltəˈgeðə/', difficulty: 3 },
  { id: 'w092', word: 'always', meaning: '总是，永远', phonetic: '/ˈɔːlweɪz/', difficulty: 1 },
  { id: 'w093', word: 'amazing', meaning: '令人惊奇的', phonetic: '/əˈmeɪzɪŋ/', difficulty: 2 },
  { id: 'w094', word: 'ambition', meaning: '雄心，抱负', phonetic: '/æmˈbɪʃn/', difficulty: 3 },
  { id: 'w095', word: 'ambulance', meaning: '救护车', phonetic: '/ˈæmbjələns/', difficulty: 2 },
  { id: 'w096', word: 'among', meaning: '在...之中', phonetic: '/əˈmʌŋ/', difficulty: 2 },
  { id: 'w097', word: 'amount', meaning: '数量，总额', phonetic: '/əˈmaʊnt/', difficulty: 2 },
  { id: 'w098', word: 'amuse', meaning: '使娱乐，使发笑', phonetic: '/əˈmjuːz/', difficulty: 3 },
  { id: 'w099', word: 'analyze', meaning: '分析', phonetic: '/ˈænəlaɪz/', difficulty: 3 },
  { id: 'w100', word: 'ancient', meaning: '古代的，古老的', phonetic: '/ˈeɪnʃənt/', difficulty: 2 },
]

// 将3500个单词分成35个List，每个List 100个单词
export const wordLists: WordList[] = []

// 生成35个List
for (let i = 0; i < 35; i++) {
  const startIdx = i * 100
  const endIdx = Math.min(startIdx + 100, gaokao3500Words.length)
  
  wordLists.push({
    id: `list_${i + 1}`,
    name: `单元 ${i + 1}`,
    description: `第${startIdx + 1}-${endIdx}个高频词汇`,
    words: gaokao3500Words.slice(startIdx, endIdx)
  })
}

// 获取所有单词
export const getAllWords = (): Word[] => {
  return gaokao3500Words
}

// 根据List ID获取单词列表
export const getWordsByListId = (listId: string): Word[] => {
  const list = wordLists.find(l => l.id === listId)
  return list ? list.words : []
}

// 根据单词ID获取单词
export const getWordById = (wordId: string): Word | undefined => {
  return gaokao3500Words.find(w => w.id === wordId)
}

// 生成干扰项
export const generateDistractors = (targetWord: Word, count: number = 3): string[] => {
  const allWords = getAllWords()
  const distractors: string[] = []
  
  // 排除目标单词
  const candidates = allWords.filter(w => w.id !== targetWord.id)
  
  // 优先选择相似难度的单词
  const similarDifficulty = candidates.filter(
    w => Math.abs(w.difficulty - targetWord.difficulty) <= 1
  )
  
  // 随机选择干扰项
  const pool = similarDifficulty.length >= count ? similarDifficulty : candidates
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  
  for (let i = 0; i < count && i < shuffled.length; i++) {
    distractors.push(shuffled[i].meaning)
  }
  
  return distractors
}