import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '@components/common/NavBar'
import { useAppStore } from '@store'
import { Mountain, Utensils, Camera, Palmtree, Baby, Heart, Compass, Tent } from 'lucide-react'
import './PlanPage.css'

const STYLE_OPTIONS = [
  { label: '深度文化', icon: Mountain },
  { label: '自然风光', icon: Palmtree },
  { label: '美食探店', icon: Utensils },
  { label: '休闲度假', icon: Palmtree },
  { label: '摄影之旅', icon: Camera },
  { label: '亲子出行', icon: Baby },
  { label: '蜜月旅行', icon: Heart },
  { label: '户外探险', icon: Compass },
]

const BUDGET_LABELS = ['经济', '舒适', '品质', '豪华']
const BUDGET_VALUES = ['3k以下', '3-8k', '8-15k', '15k+']

export default function PlanPage() {
  const navigate = useNavigate()
  const { setPlanParam, setPlanResult, setLoading } = useAppStore()
  const [destination, setDestination] = useState('日本关西')
  const [duration, setDuration] = useState(9)
  const [styles, setStyles] = useState(['深度文化', '美食探店'])
  const [budgetIdx, setBudgetIdx] = useState(1)
  const [preferences, setPreferences] = useState('')

  const toggleStyle = (s) => {
    setStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  const handleGenerate = () => {
    setPlanParam('destination', destination)
    setPlanParam('duration', duration)
    setPlanParam('style', styles)
    setPlanParam('budget', `${BUDGET_LABELS[budgetIdx]} (${BUDGET_VALUES[budgetIdx]})`)
    setPlanParam('preferences', preferences)

    setLoading(true)
    setTimeout(() => {
      const mockPlan = generateMockPlan(destination, duration, styles)
      setPlanResult(mockPlan)
      setLoading(false)
      navigate('/plan/result')
    }, 1500)
  }

  return (
    <div className="plan-page">
      <NavBar title="AI 行程规划" showBack />

      <div className="plan-hero">
        <h2>AI 行程规划</h2>
        <p>智能生成个性化旅行路线</p>
      </div>

      <div className="plan-form">
        <div className="form-section">
          <label className="form-label">目的地</label>
          <input
            className="form-input"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="输入目的地城市或地区"
          />
        </div>

        <div className="form-section">
          <label className="form-label">出行天数</label>
          <div className="stepper">
            <button className="step-btn" onClick={() => setDuration(Math.max(1, duration - 1))}>-</button>
            <span className="step-value">{duration} 天</span>
            <button className="step-btn" onClick={() => setDuration(Math.min(30, duration + 1))}>+</button>
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">旅行风格（可多选）</label>
          <div className="style-grid">
            {STYLE_OPTIONS.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className={`style-card ${styles.includes(s.label) ? 'active' : ''}`}
                  onClick={() => toggleStyle(s.label)}
                >
                  <div className="ic"><Icon size={28} /></div>
                  <div className="nm">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">预算区间</label>
          <div className="budget-slider">
            <div className="budget-display">
              <span>{BUDGET_LABELS[budgetIdx]}</span>
              <b>{BUDGET_VALUES[budgetIdx]}</b>
            </div>
            <input
              type="range"
              className="slider"
              min="0"
              max="3"
              value={budgetIdx}
              onChange={(e) => setBudgetIdx(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">特殊偏好</label>
          <textarea
            className="pref-input"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="例如：想看寺庙和红叶、避开人多的景点..."
            rows={3}
          />
        </div>

        <div className="plan-cta-btn" onClick={handleGenerate}>
          AI 一键生成行程
        </div>
      </div>
    </div>
  )
}

/**
 * Mock plan generator — 按天分配不重复景点
 */
function generateMockPlan(dest, days, styles) {
  const isJapan = dest.includes('日本') || dest.includes('关西')

  // 按区域/主题分组的每日行程模板（每天 3 个不重复景点，每个带 imageKey 匹配场景图）
  const dayTemplates = isJapan
    ? [
        { theme: '抵达 & 初探大阪', pois: [
          { name: '道顿堀', type: '美食', duration: '2h', cost: '300', time: '12:00', rating: 4.6, tip: '大阪必去美食街，章鱼烧和拉面不可错过', imageKey: 'neon' },
          { name: '心斋桥', type: '购物', duration: '2h', cost: '自费', time: '15:00', rating: 4.3, tip: '药妆购物首选，记得带护照退税', imageKey: 'modern' },
          { name: '法善寺横丁', type: '文化', duration: '1h', cost: '免费', time: '18:00', rating: 4.4, tip: '古朴小巷，适合傍晚散步', imageKey: 'oldtown' },
        ]},
        { theme: '京都经典巡礼', pois: [
          { name: '伏见稻荷大社', type: '景点', duration: '2h', cost: '免费', time: '08:00', rating: 4.8, tip: '千本鸟居清晨人少，建议早到', imageKey: 'shrine' },
          { name: '锦市场', type: '美食', duration: '1.5h', cost: '200', time: '11:30', rating: 4.5, tip: '必尝玉子烧和抹茶甜品', imageKey: 'market' },
          { name: '清水寺', type: '景点', duration: '2h', cost: '25', time: '14:30', rating: 4.9, tip: '秋季红叶绝景，春季樱花同样壮观', imageKey: 'zen' },
        ]},
        { theme: '岚山自然之旅', pois: [
          { name: '岚山竹林', type: '自然', duration: '1.5h', cost: '免费', time: '08:30', rating: 4.7, tip: '清晨最有意境，光影效果绝美', imageKey: 'bamboo' },
          { name: '天龙寺', type: '文化', duration: '1.5h', cost: '35', time: '10:30', rating: 4.6, tip: '世界文化遗产，庭院精美', imageKey: 'golden' },
          { name: '渡月桥', type: '自然', duration: '1h', cost: '免费', time: '13:00', rating: 4.5, tip: '岚山地标，适合拍照留念', imageKey: 'bridge' },
        ]},
        { theme: '金阁寺 & 二条城', pois: [
          { name: '金阁寺', type: '景点', duration: '1.5h', cost: '30', time: '09:00', rating: 4.9, tip: '晴天金色倒影绝美', imageKey: 'lake' },
          { name: '龙安寺', type: '文化', duration: '1h', cost: '30', time: '11:00', rating: 4.5, tip: '枯山水庭院代表作', imageKey: 'zen' },
          { name: '二条城', type: '景点', duration: '2h', cost: '50', time: '14:00', rating: 4.7, tip: '德川幕府的权力象征', imageKey: 'castle' },
        ]},
        { theme: '奈良一日游', pois: [
          { name: '奈良公园', type: '景点', duration: '2h', cost: '免费', time: '09:00', rating: 4.8, tip: '可以喂小鹿，买鹿饼 ¥15', imageKey: 'park' },
          { name: '东大寺', type: '文化', duration: '1.5h', cost: '40', time: '11:30', rating: 4.8, tip: '世界最大木造建筑', imageKey: 'shrine' },
          { name: '春日大社', type: '文化', duration: '1.5h', cost: '免费', time: '14:00', rating: 4.6, tip: '万灯笼神社，氛围神圣', imageKey: 'bamboo' },
        ]},
        { theme: '大阪城 & 天王寺', pois: [
          { name: '大阪城', type: '景点', duration: '2h', cost: '50', time: '09:00', rating: 4.5, tip: '天守阁值得登顶俯瞰全城', imageKey: 'castle' },
          { name: '天王寺动物园', type: '亲子', duration: '2h', cost: '35', time: '12:00', rating: 4.2, tip: '适合亲子，可看考拉', imageKey: 'park' },
          { name: '新世界 & 通天阁', type: '美食', duration: '2h', cost: '200', time: '15:00', rating: 4.4, tip: '炸串一条街，复古风情', imageKey: 'neon' },
        ]},
        { theme: '宇治 & 茶文化', pois: [
          { name: '平等院', type: '文化', duration: '1.5h', cost: '40', time: '09:30', rating: 4.7, tip: '十円硬币上的凤凰堂', imageKey: 'golden' },
          { name: '宇治抹茶体验', type: '体验', duration: '2h', cost: '250', time: '12:00', rating: 4.8, tip: '正宗抹茶产地，体验茶道', imageKey: 'tea' },
          { name: '中村藤吉本店', type: '美食', duration: '1h', cost: '150', time: '15:00', rating: 4.9, tip: '百年抹茶老店，必吃抹茶荞麦面', imageKey: 'market' },
        ]},
        { theme: '神户港湾散策', pois: [
          { name: '北野异人馆', type: '文化', duration: '2h', cost: '免费', time: '09:00', rating: 4.4, tip: '西洋风情建筑群，适合拍照', imageKey: 'oldtown' },
          { name: '神户牛排午餐', type: '美食', duration: '1.5h', cost: '800', time: '12:00', rating: 4.9, tip: 'A5 神户牛，来一次必吃', imageKey: 'market' },
          { name: '神户港夜景', type: '自然', duration: '1.5h', cost: '免费', time: '17:30', rating: 4.7, tip: '日本三大夜景之一', imageKey: 'harbor' },
        ]},
        { theme: '返程 & 最后购物', pois: [
          { name: '黑门市场', type: '美食', duration: '1.5h', cost: '250', time: '09:00', rating: 4.6, tip: '大阪厨房，最后补货海鲜', imageKey: 'market' },
          { name: '临空奥特莱斯', type: '购物', duration: '2h', cost: '自费', time: '12:00', rating: 4.3, tip: '关西机场旁，最后血拼机会', imageKey: 'modern' },
          { name: '关西机场', type: '交通', duration: '—', cost: '—', time: '16:00', rating: null, tip: '建议提前 3 小时到达办退税', imageKey: 'modern' },
        ]},
      ]
    : [
        { theme: '抵达大理', pois: [
          { name: '大理古城', type: '景点', duration: '3h', cost: '免费', time: '14:00', rating: 4.5, tip: '傍晚最有氛围，人民路逛吃', imageKey: 'oldtown' },
          { name: '洋人街', type: '美食', duration: '1.5h', cost: '80', time: '17:30', rating: 4.3, tip: '各国美食汇聚，酒吧氛围好', imageKey: 'neon' },
          { name: '古城夜景', type: '自然', duration: '1h', cost: '免费', time: '20:00', rating: 4.4, tip: '五华楼夜景值得一看', imageKey: 'harbor' },
        ]},
        { theme: '洱海环湖', pois: [
          { name: '洱海骑行', type: '自然', duration: '4h', cost: '80', time: '08:00', rating: 4.8, tip: '环湖最美路线，租电动车省力', imageKey: 'lake' },
          { name: '双廊古镇', type: '景点', duration: '2h', cost: '免费', time: '13:00', rating: 4.6, tip: '面朝洱海的安静小镇', imageKey: 'oldtown' },
          { name: '双廊日落', type: '自然', duration: '1h', cost: '免费', time: '18:00', rating: 4.9, tip: '最佳日落观赏点，提前占位', imageKey: 'sunset' },
        ]},
        { theme: '苍山探秘', pois: [
          { name: '苍山缆车', type: '自然', duration: '3h', cost: '180', time: '09:00', rating: 4.7, tip: '天气好能看到雪山全景', imageKey: 'snowmtn' },
          { name: '感通寺', type: '文化', duration: '1h', cost: '免费', time: '13:00', rating: 4.3, tip: '千年古刹，清幽宁静', imageKey: 'shrine' },
          { name: '三塔倒影公园', type: '景点', duration: '1.5h', cost: '75', time: '16:00', rating: 4.6, tip: '崇圣寺三塔倒影，摄影绝佳', imageKey: 'golden' },
        ]},
        { theme: '喜洲田园', pois: [
          { name: '喜洲古镇', type: '文化', duration: '2h', cost: '免费', time: '09:00', rating: 4.4, tip: '白族建筑群落，喜洲粑粑必吃', imageKey: 'oldtown' },
          { name: '稻田风光', type: '自然', duration: '1.5h', cost: '免费', time: '11:30', rating: 4.7, tip: '稻田旁骑行，出片神器', imageKey: 'ricefield' },
          { name: '海舌生态公园', type: '自然', duration: '2h', cost: '免费', time: '14:30', rating: 4.5, tip: '洱海半岛湿地，野趣十足', imageKey: 'park' },
        ]},
        { theme: '丽江古城', pois: [
          { name: '丽江古城', type: '景点', duration: '3h', cost: '免费', time: '10:00', rating: 4.5, tip: '四方街出发，小巷深处有惊喜', imageKey: 'oldtown' },
          { name: '木府', type: '文化', duration: '1.5h', cost: '40', time: '14:00', rating: 4.6, tip: '纳西族土司府邸，了解纳西文化', imageKey: 'castle' },
          { name: '酒吧街', type: '娱乐', duration: '2h', cost: '100', time: '20:00', rating: 4.2, tip: '民谣酒吧氛围好，手鼓声声入耳', imageKey: 'neon' },
        ]},
        { theme: '玉龙雪山', pois: [
          { name: '玉龙雪山', type: '自然', duration: '4h', cost: '280', time: '08:00', rating: 4.8, tip: '海拔高注意防寒，提前买氧气瓶', imageKey: 'snowmtn' },
          { name: '蓝月谷', type: '自然', duration: '1.5h', cost: '免费', time: '13:30', rating: 4.9, tip: '蓝绿色湖水如宝石，雪山下的仙境', imageKey: 'bluevalley' },
          { name: '束河古镇', type: '景点', duration: '2h', cost: '免费', time: '16:30', rating: 4.4, tip: '比丽江更安静的古镇，适合发呆', imageKey: 'bridge' },
        ]},
        { theme: '泸沽湖', pois: [
          { name: '泸沽湖观景台', type: '自然', duration: '1h', cost: '70', time: '09:00', rating: 4.9, tip: '第一眼惊艳，蓝得不真实', imageKey: 'lugulake' },
          { name: '里格半岛', type: '自然', duration: '2h', cost: '免费', time: '11:00', rating: 4.8, tip: '湖光山色最美的半岛', imageKey: 'lake' },
          { name: '猪槽船日落', type: '体验', duration: '1.5h', cost: '50', time: '17:00', rating: 4.7, tip: '坐摩梭人猪槽船看日落', imageKey: 'sunset' },
        ]},
        { theme: '返程', pois: [
          { name: '忠义市场', type: '美食', duration: '1.5h', cost: '60', time: '08:00', rating: 4.5, tip: '当地人的菜市场，鲜花饼伴手礼', imageKey: 'market' },
          { name: '黑龙潭公园', type: '自然', duration: '1.5h', cost: '免费', time: '10:00', rating: 4.3, tip: '拍雪山倒影的经典机位', imageKey: 'snowmtn' },
          { name: '丽江机场', type: '交通', duration: '—', cost: '—', time: '14:00', rating: null, tip: '提前 2 小时到达', imageKey: 'modern' },
        ]},
      ]

  const dailyPlan = []
  for (let i = 0; i < days; i++) {
    // 取对应模板，超出则循环使用最后几天的备选
    const tpl = dayTemplates[Math.min(i, dayTemplates.length - 1)]
    // 第一天和最后一天使用固定主题
    let theme = tpl.theme
    if (i === 0) theme = dayTemplates[0].theme
    if (i === days - 1 && days > 1) theme = dayTemplates[dayTemplates.length - 1].theme

    // 如果天数多于模板数，为中间多出的天生成自由活动日
    let pois
    if (i < dayTemplates.length) {
      pois = tpl.pois
    } else {
      // 额外天数使用自由活动
      pois = [
        { name: '酒店周边自由探索', type: '自由', duration: '半天', cost: '免费', time: '09:00', rating: null, tip: '睡到自然醒，享受慢旅行', imageKey: 'park' },
        { name: '当地市场采购', type: '购物', duration: '2h', cost: '自费', time: '14:00', rating: 4.3, tip: '买些当地特产和伴手礼', imageKey: 'market' },
      ]
      theme = '自由活动日'
    }

    dailyPlan.push({
      day: i + 1,
      title: `Day ${i + 1}`,
      theme,
      pois,
      tips: i === 0 ? '建议提前兑换当地货币' : '',
    })
  }

  return {
    destination: dest,
    duration: days,
    styles,
    dailyPlan,
    totalBudget: isJapan ? '8,500 - 12,000' : '3,000 - 5,000',
  }
}
