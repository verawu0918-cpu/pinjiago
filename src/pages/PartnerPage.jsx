import { useState } from 'react'
import NavBar from '@components/common/NavBar'
import { MOCK_PARTNERS } from '@utils/matching'
import './PartnerPage.css'

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'match', label: '综合匹配' },
  { key: 'overlap', label: '行程重合' },
  { key: 'credit', label: '信用优先' },
]

const AVATAR_COLORS = ['', 'b', 'p', 'g']

export default function PartnerPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [sentGreetings, setSentGreetings] = useState(new Set())

  const sorted = [...MOCK_PARTNERS].sort((a, b) => {
    if (activeFilter === 'overlap') return b.itineraryOverlap - a.itineraryOverlap
    if (activeFilter === 'credit') return b.credit - a.credit
    return b.matchScore - a.matchScore
  })

  const handleGreet = (id) => {
    setSentGreetings((prev) => new Set([...prev, id]))
  }

  return (
    <div className="partner-page">
      <NavBar title="旅行搭子" action="发布行程" />

      {/* Purple Hero */}
      <div className="partner-hero">
        <h2>旅行搭子</h2>
        <p>找到志同道合的旅伴</p>
      </div>

      {/* My Trip Card */}
      <div className="my-trip-card">
        <div className="my-trip-head">
          <div className="my-trip-title">日本关西 9 日深度游</div>
          <span className="my-trip-status">匹配中</span>
        </div>
        <div className="my-trip-info">
          2026.06.19 - 06.27 · 深度文化 · 美食探店
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <div
            key={f.key}
            className={`filter-tag ${activeFilter === f.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </div>
        ))}
      </div>

      {/* Partner Cards */}
      {sorted.map((p, idx) => (
        <div key={p.id} className="partner-card">
          <div className="partner-head">
            <div className={`avatar ${AVATAR_COLORS[idx % 4]}`}>
              {p.name.charAt(0)}
            </div>
            <div className="partner-info">
              <div className="partner-name">
                {p.name}
                <span className="verified">已认证</span>
              </div>
              <div className="partner-meta">
                {p.age}岁 · {p.occupation} · {p.city}
              </div>
            </div>
            <div className="match-score">
              <div className="num">{p.matchScore}</div>
              <div className="lb">匹配</div>
            </div>
          </div>

          <div className="partner-tags">
            {p.tags.map((t) => (
              <span key={t} className="ptag-mini">{t}</span>
            ))}
          </div>

          <div className="partner-route">
            {p.overlapDetail}
          </div>

          <div className="partner-cta-row">
            <div className="partner-credit">
              信用 <span className="score">{p.credit}</span> · {p.tripCount} 次出行
            </div>
            <button
              className="btn-mini"
              onClick={() => handleGreet(p.id)}
              disabled={sentGreetings.has(p.id)}
              style={sentGreetings.has(p.id) ? { background: '#ccc' } : {}}
            >
              {sentGreetings.has(p.id) ? '已打招呼' : '打个招呼'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
