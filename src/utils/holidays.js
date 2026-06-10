import dayjs from 'dayjs'

/**
 * 2026 年中国法定节假日数据库
 * 包含调休工作日、法定假期
 */
export const HOLIDAYS_2026 = {
  // 法定节假日（放假日期）
  holidays: [
    // 元旦
    { start: '2026-01-01', end: '2026-01-03', name: '元旦', days: 3 },
    // 春节
    { start: '2026-01-26', end: '2026-02-01', name: '春节', days: 7 },
    // 清明节
    { start: '2026-04-04', end: '2026-04-06', name: '清明节', days: 3 },
    // 劳动节
    { start: '2026-05-01', end: '2026-05-05', name: '劳动节', days: 5 },
    // 端午节
    { start: '2026-06-19', end: '2026-06-21', name: '端午节', days: 3 },
    // 中秋节
    { start: '2026-09-25', end: '2026-09-27', name: '中秋节', days: 3 },
    // 国庆节
    { start: '2026-10-01', end: '2026-10-07', name: '国庆节', days: 7 },
  ],
  // 调休工作日（周末需上班）
  workdays: [
    '2026-01-24', // 春节调休
    '2026-02-08', // 春节调休
    '2026-04-26', // 劳动节调休
    '2026-06-28', // 端午节调休
    '2026-09-19', // 中秋节调休
    '2026-10-10', // 国庆节调休
  ],
}

/**
 * 判断某天是否为休息日（周末或法定假日，且不是调休工作日）
 */
export function isRestDay(dateStr) {
  const date = dayjs(dateStr)
  const day = date.day() // 0=周日, 6=周六

  // 调休工作日 → 不是休息日
  if (HOLIDAYS_2026.workdays.includes(dateStr)) return false

  // 法定假日
  for (const h of HOLIDAYS_2026.holidays) {
    if (dateStr >= h.start && dateStr <= h.end) return true
  }

  // 周末
  return day === 0 || day === 6
}

/**
 * AI 拼假算法
 * 输入：可用年假天数、偏好月份、是否避开财年节点
 * 输出：Top 5 拼假方案，按性价比排序
 */
export function calculatePinjia({ availableDays, months, avoidFiscal, maxConsecutive = 5 }) {
  const results = generatePlans(availableDays, months, avoidFiscal, maxConsecutive)

  // 如果偏好月份过滤后无结果，取消月份限制重新计算
  if (results.length === 0 && months.length > 0) {
    console.log('[拼假] 偏好月份无方案，取消月份限制重算')
    return generatePlans(availableDays, [], avoidFiscal, maxConsecutive)
  }

  return results
}

function generatePlans(availableDays, months, avoidFiscal, maxConsecutive) {
  const results = []

  // 遍历每个法定假日，尝试前后拼接
  HOLIDAYS_2026.holidays.forEach((holiday) => {
    const holidayStart = dayjs(holiday.start)
    const holidayEnd = dayjs(holiday.end)
    const holidayMonth = holidayStart.month() + 1

    // 如果设了偏好月份且不匹配，跳过
    if (months.length > 0 && !months.includes(holidayMonth)) return

    // 避开财年节点（3/6/9/12月）
    if (avoidFiscal && [3, 6, 9, 12].includes(holidayMonth)) return

    // 尝试不同的请假天数组合
    for (let leaveDays = 1; leaveDays <= Math.min(availableDays, maxConsecutive); leaveDays++) {
      // 前拼
      const beforeStart = holidayStart.subtract(leaveDays, 'day')
      const beforeResult = expandToWeekends(beforeStart, holidayEnd, leaveDays)
      if (beforeResult) {
        results.push({
          ...beforeResult,
          holidayName: holiday.name,
          direction: '前拼',
        })
      }

      // 后拼
      const afterEnd = holidayEnd.add(leaveDays, 'day')
      const afterResult = expandToWeekends(holidayStart, afterEnd, leaveDays)
      if (afterResult) {
        results.push({
          ...afterResult,
          holidayName: holiday.name,
          direction: '后拼',
        })
      }

      // 前后各拼
      if (leaveDays >= 2) {
        const half = Math.floor(leaveDays / 2)
        const rest = leaveDays - half
        const bothStart = holidayStart.subtract(half, 'day')
        const bothEnd = holidayEnd.add(rest, 'day')
        const bothResult = expandToWeekends(bothStart, bothEnd, leaveDays)
        if (bothResult) {
          results.push({
            ...bothResult,
            holidayName: holiday.name,
            direction: '前后拼',
          })
        }
      }
    }
  })

  // 计算性价比并排序
  results.forEach((r) => {
    r.ratio = ((r.totalDays - r.leaveDays) / r.leaveDays).toFixed(2)
  })

  // 去重 + 排序
  const unique = removeDuplicates(results)
  unique.sort((a, b) => b.ratio - a.ratio)

  return unique.slice(0, 5)
}

/**
 * 向两侧扩展到周末
 */
function expandToWeekends(start, end, leaveDays) {
  let s = start
  let e = end
  let guard = 0

  // 向前扩展到非工作日（加安全上限防止死循环）
  while (guard < 30 && isRestDay(s.subtract(1, 'day').format('YYYY-MM-DD'))) {
    s = s.subtract(1, 'day')
    guard++
  }

  guard = 0
  // 向后扩展到非工作日
  while (guard < 30 && isRestDay(e.add(1, 'day').format('YYYY-MM-DD'))) {
    e = e.add(1, 'day')
    guard++
  }

  const totalDays = e.diff(s, 'day') + 1

  return {
    startDate: s.format('YYYY-MM-DD'),
    endDate: e.format('YYYY-MM-DD'),
    startDisplay: s.format('M.D'),
    endDisplay: e.format('M.D'),
    totalDays,
    leaveDays,
  }
}

/**
 * 去除重复方案
 */
function removeDuplicates(results) {
  const seen = new Set()
  return results.filter((r) => {
    const key = `${r.startDate}-${r.endDate}-${r.leaveDays}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * 获取某天在拼假方案中的类型
 * @returns 'leave' | 'holiday' | 'adjust' | 'work'
 */
export function getDayType(dateStr, plan) {
  const date = dayjs(dateStr)
  const day = date.day()

  // 调休工作日
  if (HOLIDAYS_2026.workdays.includes(dateStr)) return 'adjust'

  // 法定假日
  for (const h of HOLIDAYS_2026.holidays) {
    if (dateStr >= h.start && dateStr <= h.end) return 'holiday'
  }

  // 周末
  if (day === 0 || day === 6) return 'holiday'

  // 工作日在方案范围内 → 请假
  if (dateStr >= plan.startDate && dateStr <= plan.endDate) return 'leave'

  return 'work'
}

/**
 * 推荐目的地（根据假期长度）
 */
export function suggestDestinations(totalDays) {
  if (totalDays >= 10) return ['欧洲深度游', '新西兰南岛', '日本全境']
  if (totalDays >= 7) return ['日本关西', '泰国清迈', '新疆伊犁']
  if (totalDays >= 5) return ['云南大理', '厦门鼓浪屿', '成都重庆']
  return ['杭州西湖', '苏州园林', '周边短途']
}
