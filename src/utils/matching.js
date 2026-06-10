/**
 * 旅行搭子四维匹配算法
 *
 * 维度与权重：
 * 1. 行程重合度 40% — 日期/城市/POI 重合
 * 2. 兴趣/旅行风格 25% — 标签 cosine 相似度
 * 3. 性别/年龄/职业 20% — 偏好筛选 + 软匹配
 * 4. 预算区间 15% — 预算带宽重叠度
 */

const WEIGHTS = {
  itinerary: 0.4,
  interest: 0.25,
  demographic: 0.2,
  budget: 0.15,
}

/**
 * 计算行程重合度（0-100）
 */
export function calcItineraryOverlap(myTrip, theirTrip) {
  if (!myTrip || !theirTrip) return 0

  // 日期重合
  const myDays = new Set(myTrip.dates || [])
  const theirDays = new Set(theirTrip.dates || [])
  const dateOverlap = [...myDays].filter((d) => theirDays.has(d)).length
  const dateScore = myDays.size > 0 ? (dateOverlap / myDays.size) * 100 : 0

  // POI 重合
  const myPois = new Set(myTrip.pois || [])
  const theirPois = new Set(theirTrip.pois || [])
  const poiOverlap = [...myPois].filter((p) => theirPois.has(p)).length
  const poiScore = myPois.size > 0 ? (poiOverlap / myPois.size) * 100 : 0

  return Math.round(dateScore * 0.6 + poiScore * 0.4)
}

/**
 * 计算兴趣相似度（cosine similarity on tags）
 */
export function calcInterestSimilarity(myTags, theirTags) {
  if (!myTags?.length || !theirTags?.length) return 0

  const allTags = [...new Set([...myTags, ...theirTags])]
  const vecA = allTags.map((t) => (myTags.includes(t) ? 1 : 0))
  const vecB = allTags.map((t) => (theirTags.includes(t) ? 1 : 0))

  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))

  if (magA === 0 || magB === 0) return 0
  return Math.round((dot / (magA * magB)) * 100)
}

/**
 * 计算人口统计匹配度
 */
export function calcDemographicMatch(myProfile, theirProfile, preferences = {}) {
  let score = 50 // 基础分

  // 年龄差（5 岁以内加分）
  const ageDiff = Math.abs((myProfile.age || 0) - (theirProfile.age || 0))
  if (ageDiff <= 3) score += 30
  else if (ageDiff <= 5) score += 20
  else if (ageDiff <= 10) score += 10

  // 性别偏好
  if (preferences.preferSameGender && myProfile.gender === theirProfile.gender) {
    score += 20
  } else {
    score += 10
  }

  return Math.min(score, 100)
}

/**
 * 计算预算重叠度
 */
export function calcBudgetOverlap(myBudget, theirBudget) {
  if (!myBudget || !theirBudget) return 50

  const myMin = myBudget.min || 0
  const myMax = myBudget.max || Infinity
  const theirMin = theirBudget.min || 0
  const theirMax = theirBudget.max || Infinity

  const overlapMin = Math.max(myMin, theirMin)
  const overlapMax = Math.min(myMax, theirMax)

  if (overlapMin > overlapMax) return 0

  const overlapRange = overlapMax - overlapMin
  const totalRange = Math.max(myMax, theirMax) - Math.min(myMin, theirMin)

  return totalRange > 0 ? Math.round((overlapRange / totalRange) * 100) : 100
}

/**
 * 综合匹配分计算
 */
export function calculateMatchScore({ itinerary, interest, demographic, budget }) {
  return Math.round(
    itinerary * WEIGHTS.itinerary +
    interest * WEIGHTS.interest +
    demographic * WEIGHTS.demographic +
    budget * WEIGHTS.budget
  )
}

/**
 * 模拟搭子数据
 */
export const MOCK_PARTNERS = [
  {
    id: 1,
    name: '小鹿同学',
    age: 28,
    gender: '女',
    occupation: '设计师',
    city: '上海',
    credit: 762,
    tripCount: 7,
    rating: 4.95,
    tags: ['摄影发烧友', '寿司爱好者', '早起党', '不爱购物'],
    matchScore: 96,
    itineraryOverlap: 100,
    overlapDetail: '9.25-10.3 同行 · 已规划 26/28 个相同 POI',
  },
  {
    id: 2,
    name: '阿喵咪',
    age: 30,
    gender: '女',
    occupation: '程序员',
    city: '杭州',
    credit: 730,
    tripCount: 12,
    rating: 4.88,
    tags: ['美食搜寻者', '微醺青年', '夜猫子'],
    matchScore: 89,
    itineraryOverlap: 89,
    overlapDetail: '8/9 天同行 · 错开 D5 京都',
  },
  {
    id: 3,
    name: 'TonyLi',
    age: 32,
    gender: '男',
    occupation: '高中老师',
    city: '北京',
    credit: 801,
    tripCount: 4,
    rating: 5.0,
    tags: ['风光摄影', '文博深度', '不爱热闹'],
    matchScore: 84,
    itineraryOverlap: 78,
    overlapDetail: '7/9 天同行 · 偏好京都奈良',
  },
  {
    id: 4,
    name: '朵朵_趣旅行',
    age: 26,
    gender: '女',
    occupation: '自媒体',
    city: '成都',
    credit: 693,
    tripCount: 18,
    rating: 4.71,
    tags: ['探店达人', 'Vlog 拍摄', '爱购物'],
    matchScore: 81,
    itineraryOverlap: 70,
    overlapDetail: 'D6-D9 同行 · 重点大阪',
  },
]
