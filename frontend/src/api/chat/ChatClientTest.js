import * as constants from '@/components/ChatRenderer/constants'
import * as chat from '.'
import * as chatModels from './models'

const NAMES = [
  '光羊',
  '黑炎',
  '孤梦星影',
  '博丽灵梦',
  '雾雨魔理沙',
  '空條承太郎',
  'ディオ・ブランドー',
  'ジョセフ・ジョースター',
  'ジョナサン・ジョースター',
  'Simon',
  'Misty',
  'Kinori',
  'shugen',
  '3Shain',
  'yuyuyzl',
  'xfgryujk',
  'Il Harper',
  'Rick Astley',
]

const CONTENTS = [
  '草',
  '让我看看',
  '不要停下来啊',
  '我不做人了，JOJO',
  '已经没有什么好怕的了',
  '我柜子动了，我不玩了',
  '老板大气，老板身体健康',
  '我醉提酒游寒山，爽滑慢舔',
  '[dog]文本[比心]表情[喝彩]',
  '無駄無駄無駄無駄無駄無駄無駄無駄',
  '欧啦欧啦欧啦欧啦欧啦欧啦欧啦欧啦',
  '所有没好全部康复呀，我的癌也全部康复呀',
  '嚯，朝我走过来了吗，没有选择逃跑而是主动接近我么',
  '有一说一，这件事大家懂的都懂，不懂的，说了你也不明白，不如不说',
  '如来来了吗？如来嘛~他真来了吗？如~来~到底来没来？如来~如来他真来了吗？如来~你看看，来没来？如~来~',
  '迷えば、敗れる',
  '逃げるんだよォ！',
  '竜神の剣を喰らえ！',
  '竜が我が敌を喰らう！',
  '言いたいことがあるんだよ！',
  '知らず知らず隠してた 本当の声を響かせてよほら',
  'kksk',
  '8888888888',
  'text[吃瓜]emoticon',
  'Never gonna give you up',
  'Never gonna let you down',
  '888888888888888888888888888888',
  'I am the storm that is approaching',
  "I can eat glass, it doesn't hurt me",
  'The quick brown fox jumps over the lazy dog',
  'Farewell, ashen one. May the flame guide thee',
  'I am the bone of my sword. Steel is my body, and fire is my blood.',
]

const EMOTICONS = [
  '233',
  'miaoa',
  'lipu',
  'huangdou_xihuan',
  'sakaban_jiayu_yutou',
].map(name => `/static/img/emoticons/${name}.png`)

const AUTHOR_TYPES = [
  { weight: 10, value: constants.AUTHOR_TYPE_NORMAL },
  { weight: 5, value: constants.AUTHOR_TYPE_MEMBER },
  { weight: 2, value: constants.AUTHOR_TYPE_ADMIN },
  { weight: 1, value: constants.AUTHOR_TYPE_OWNER }
]

function randGuardInfo() {
  let authorType = randomChoose(AUTHOR_TYPES)
  let privilegeType
  if (authorType === constants.AUTHOR_TYPE_MEMBER) {
    privilegeType = randInt(1, 3)
  } else if (authorType === constants.AUTHOR_TYPE_ADMIN) {
    privilegeType = randInt(0, 3)
  } else {
    privilegeType = 0
  }
  return { authorType, privilegeType }
}

const GIFT_INFO_LIST = [
  { giftName: '辣条', totalFreeCoin: 1000, num: 10 },
  { giftName: 'B坷垃', totalCoin: 9900 },
  { giftName: '礼花', totalCoin: 28000 },
  { giftName: '花式夸夸', totalCoin: 39000 },
  { giftName: '天空之翼', totalCoin: 100000 },
  { giftName: '摩天大楼', totalCoin: 450000 },
  { giftName: '小电视飞船', totalCoin: 1245000 }
]

const SC_PRICES = [
  30, 50, 100, 200, 500, 1000
]

const MESSAGE_GENERATORS = [
  // 文字
  {
    weight: 20,
    value() {
      return {
        type: constants.MESSAGE_TYPE_TEXT,
        message: new chatModels.AddTextMsg({
          ...randGuardInfo(),
          authorName: randomChoose(NAMES),
          content: randomChoose(CONTENTS),
          isGiftDanmaku: randInt(1, 10) <= 1,
          authorLevel: randInt(1, 60),
          isNewbie: randInt(1, 10) <= 1,
          isMobileVerified: randInt(1, 10) <= 9,
          medalLevel: randInt(0, 40),
        })
      }
    }
  },
  // 表情
  {
    weight: 5,
    value() {
      return {
        type: constants.MESSAGE_TYPE_TEXT,
        message: new chatModels.AddTextMsg({
          ...randGuardInfo(),
          authorName: randomChoose(NAMES),
          authorLevel: randInt(1, 60),
          isNewbie: randInt(1, 10) <= 1,
          isMobileVerified: randInt(1, 10) <= 9,
          medalLevel: randInt(0, 40),
          emoticon: randomChoose(EMOTICONS),
        })
      }
    }
  },
  // 礼物
  {
    weight: 1,
    value() {
      return {
        type: constants.MESSAGE_TYPE_GIFT,
        message: new chatModels.AddGiftMsg({
          ...randomChoose(GIFT_INFO_LIST),
          authorName: randomChoose(NAMES),
        })
      }
    }
  },
  // SC
  {
    weight: 3,
    value() {
      return {
        type: constants.MESSAGE_TYPE_SUPER_CHAT,
        message: new chatModels.AddSuperChatMsg({
          authorName: randomChoose(NAMES),
          price: randomChoose(SC_PRICES),
          content: randomChoose(CONTENTS),
        })
      }
    }
  },
  // 新舰长
  {
    weight: 1,
    value() {
      return {
        type: constants.MESSAGE_TYPE_MEMBER,
        message: new chatModels.AddMemberMsg({
          authorName: randomChoose(NAMES),
          privilegeType: randInt(1, 3)
        })
      }
    }
  }
]

function randomChoose(nodes) {
  if (nodes.length === 0) {
    return null
  }
  for (let node of nodes) {
    if (node.weight === undefined || node.value === undefined) {
      return nodes[randInt(0, nodes.length - 1)]
    }
  }

  let totalWeight = 0
  for (let node of nodes) {
    totalWeight += node.weight
  }
  let remainWeight = randInt(1, totalWeight)
  for (let node of nodes) {
    remainWeight -= node.weight
    if (remainWeight > 0) {
      continue
    }
    if (node.value instanceof Array) {
      return randomChoose(node.value)
    }
    return node.value
  }
  return null
}

function randInt(min, max) {
  return Math.floor(min + ((max - min + 1) * Math.random()))
}

export default class ChatClientTest {
  constructor() {
    this.msgHandler = chat.getDefaultMsgHandler()

    this.timerId = null
  }

  start() {
    this.refreshTimer()
  }

  stop() {
    if (this.timerId) {
      window.clearTimeout(this.timerId)
      this.timerId = null
    }
  }

  refreshTimer() {
    // 模仿B站的消息间隔模式
    let sleepTime
    if (randInt(0, 4) == 0) {
      sleepTime = randInt(1000, 2000)
    } else {
      sleepTime = randInt(0, 400)
    }
    if (this.timerId) {
      window.clearTimeout(this.timerId)
    }
    this.timerId = window.setTimeout(this.onTimeout.bind(this), sleepTime)
  }

  onTimeout() {
    this.refreshTimer()

    let { type, message } = randomChoose(MESSAGE_GENERATORS)()
    switch (type) {
    case constants.MESSAGE_TYPE_TEXT:
      this.msgHandler.onAddText(message)
      break
    case constants.MESSAGE_TYPE_GIFT:
      this.msgHandler.onAddGift(message)
      break
    case constants.MESSAGE_TYPE_MEMBER:
      this.msgHandler.onAddMember(message)
      break
    case constants.MESSAGE_TYPE_SUPER_CHAT:
      this.msgHandler.onAddSuperChat(message)
      break
    }
  }
}
