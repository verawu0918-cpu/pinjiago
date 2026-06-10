import { useNavigate } from 'react-router-dom'
import './HomePage.css'

/* ---- 自定义 SVG 图标（与 HTML 原型完全一致）---- */

const LanternIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="26" height="26">
    <ellipse cx="20" cy="15" rx="8.5" ry="11" fill="#FFC107"/>
    <ellipse cx="17" cy="11" rx="2" ry="3.5" fill="rgba(255,255,255,0.35)" transform="rotate(-12 17 11)"/>
    <path d="M17.5 25.5L20 28l2.5-2.5" fill="#F9A825"/>
    <path d="M20 28c0 0-2 3-4 5" stroke="#EF5350" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M20 28c0 0 0 3.5-1 6" stroke="#42A5F5" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M20 28c0 0 2 3 3.5 5" stroke="#66BB6A" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="26" height="26">
    <rect x="8" y="11" width="24" height="21" rx="3" fill="#42A5F5"/>
    <rect x="8" y="11" width="24" height="7" rx="3" fill="#1E88E5"/>
    <rect x="8" y="15" width="24" height="3" fill="#1E88E5"/>
    <rect x="13" y="8" width="2" height="5" rx="1" fill="#1565C0"/>
    <rect x="25" y="8" width="2" height="5" rx="1" fill="#1565C0"/>
    <rect x="12" y="21" width="4" height="3" rx=".8" fill="#E3F2FD"/>
    <rect x="18" y="21" width="4" height="3" rx=".8" fill="#E3F2FD"/>
    <rect x="24" y="21" width="4" height="3" rx=".8" fill="#E3F2FD"/>
    <rect x="12" y="26" width="4" height="3" rx=".8" fill="#E3F2FD"/>
    <rect x="18" y="26" width="4" height="3" rx=".8" fill="#EF5350"/>
    <rect x="24" y="26" width="4" height="3" rx=".8" fill="#E3F2FD"/>
  </svg>
)

const MapIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="26" height="26">
    <path d="M7 11l8.5-3.5v22L7 33V11z" fill="#81C784"/>
    <path d="M15.5 7.5l9 3.5v22l-9-3.5V7.5z" fill="#E8F5E9"/>
    <path d="M24.5 11l8.5-3.5v22L24.5 33V11z" fill="#A5D6A7"/>
    <line x1="15.5" y1="7.5" x2="15.5" y2="29.5" stroke="#43A047" strokeWidth=".5" opacity=".5"/>
    <line x1="24.5" y1="11" x2="24.5" y2="33" stroke="#43A047" strokeWidth=".5" opacity=".5"/>
    <circle cx="22" cy="14" r="4" fill="#EF5350"/>
    <circle cx="22" cy="13.5" r="1.5" fill="#fff"/>
  </svg>
)

const PeopleIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="26" height="26">
    <circle cx="14.5" cy="13" r="4.5" fill="#FFB74D"/>
    <path d="M6 32c0-5 3.8-9 8.5-9s8.5 4 8.5 9H6z" fill="#FF9800"/>
    <circle cx="26" cy="15" r="3.5" fill="#81C784"/>
    <path d="M19.5 32c0-4 2.9-7 6.5-7s6.5 3 6.5 7h-13z" fill="#43A047"/>
  </svg>
)

/* ---- 推荐卡片数据（与 HTML 原型一致）---- */
const RECOMMEND_CARDS = [
  {
    id: 1,
    title: '日本 9 日 · 关西文化深度游',
    tag: '🔥 拼假神选',
    days: 9,
    leaveDays: 3,
    location: '📍 东京·京都·大阪',
    price: '12,800',
    coverClass: 'photo-kansai',
  },
  {
    id: 2,
    title: '冰岛 8 日 · 极光环岛自驾',
    tag: '⭐ 出片首选',
    days: 8,
    leaveDays: 4,
    location: '📍 雷克雅未克',
    price: '18,500',
    coverClass: 'photo-iceland',
  },
  {
    id: 3,
    title: '大理丽江 5 日 · 慢游云南',
    tag: '💰 高性价比',
    days: 5,
    leaveDays: 2,
    location: '📍 大理·丽江',
    price: '3,200',
    coverClass: 'photo-dali',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      {/* 顶部导航标签 */}
      <div className="home-nav">
        {['精选', '周末', '端午', '中秋', '国庆'].map((tab, i) => (
          <span key={tab} className={`hn-tab ${i === 0 ? 'active' : ''}`}>{tab}</span>
        ))}
      </div>

      {/* 假期 Banner */}
      <div className="holiday-banner" onClick={() => navigate('/pinjia')}>
        <span className="holiday-icon">
          <LanternIcon />
        </span>
        <div className="holiday-text">
          <div className="t1">距国庆+中秋还有 112 天</div>
          <div className="t2">最优拼假方案：请 3 休 13 · 性价比 ★★★★★</div>
        </div>
        <span className="holiday-arrow">›</span>
      </div>

      {/* 快捷入口 */}
      <div className="quick-entries">
        <div className="qe-item" onClick={() => navigate('/pinjia')}>
          <div className="qe-icon">
            <CalendarIcon />
          </div>
          <div className="qe-label">AI 拼假</div>
        </div>
        <div className="qe-item" onClick={() => navigate('/plan')}>
          <div className="qe-icon">
            <MapIcon />
          </div>
          <div className="qe-label">AI 规划</div>
        </div>
        <div className="qe-item" onClick={() => navigate('/partner')}>
          <div className="qe-icon">
            <PeopleIcon />
          </div>
          <div className="qe-label">找搭子</div>
        </div>
      </div>

      {/* 推荐行程 */}
      <div className="section-title">
        <span>热门拼假目的地</span>
        <span className="more">查看更多 ›</span>
      </div>

      <div className="recommend-list">
        {RECOMMEND_CARDS.map((card) => (
          <div key={card.id} className="rec-card" onClick={() => navigate('/plan-result')}>
            <div className={`rec-cover ${card.coverClass}`}>
              <span className="tag">{card.tag}</span>
              <div>
                <div className="title">{card.title}</div>
              </div>
            </div>
            <div className="rec-info">
              <div className="rec-info-row">
                <span><span className="num">{card.days}</span> 天</span>
                <span>请假 <span className="num">{card.leaveDays}</span> 天</span>
                <span>{card.location}</span>
              </div>
              <div className="rec-cta">
                <div className="rec-price">人均 <b>¥{card.price}</b> 起</div>
                <div className="rec-btn">查看行程</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
