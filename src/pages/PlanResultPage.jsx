import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '@components/common/NavBar'
import { useAppStore } from '@store'
import { Sparkles } from 'lucide-react'
import POI_IMAGES from '@utils/poiImages'
import './PlanResultPage.css'

export default function PlanResultPage() {
  const navigate = useNavigate()
  const { planResult, saveTripPlan, showToast } = useAppStore()
  const [activeDay, setActiveDay] = useState(0)
  const [saved, setSaved] = useState(false)

  if (!planResult) {
    return (
      <div className="plan-result-page">
        <NavBar title="行程详情" showBack />
        <div className="empty-state">
          <p>暂无行程，请先生成</p>
          <div className="pj-cta" onClick={() => navigate('/plan')} style={{margin:'0 40px',background:'linear-gradient(135deg,#3366FF,#1a47cc)'}}>去规划</div>
        </div>
      </div>
    )
  }

  const { destination, duration, dailyPlan, totalBudget } = planResult
  const currentDay = dailyPlan[activeDay]

  return (
    <div className="plan-result-page">
      <NavBar title={`${destination} ${duration}日`} showBack action={saved ? '✓ 已保存' : '保存行程'} onAction={() => {
        saveTripPlan(planResult)
        setSaved(true)
        showToast('行程已保存')
      }} />

      {/* Dark Hero */}
      <div className="itin-hero">
        <div className="itin-tag">AI 智能规划</div>
        <div className="itin-title">{destination}</div>
        <div className="itin-desc">{duration} 天深度旅行</div>
        <div className="itin-stats">
          <div className="itin-stat">
            <div className="v">{duration}</div>
            <div className="l">天</div>
          </div>
          <div className="itin-stat">
            <div className="v">{dailyPlan.reduce((sum, d) => sum + d.pois.length, 0)}</div>
            <div className="l">景点</div>
          </div>
          <div className="itin-stat">
            <div className="v">{totalBudget}</div>
            <div className="l">预算</div>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="day-tabs">
        {dailyPlan.map((day, idx) => (
          <div
            key={idx}
            className={`day-tab ${activeDay === idx ? 'active' : ''}`}
            onClick={() => setActiveDay(idx)}
          >
            <div className="d">{day.theme.slice(0, 4)}</div>
            <div className="n">D{day.day}</div>
          </div>
        ))}
      </div>

      {/* Day Content */}
      <div className="itin-day-content">
        <div className="itin-summary">
          <Sparkles size={16} />
          <span>Day {currentDay.day} · {currentDay.theme}</span>
        </div>

        {currentDay.pois.map((poi, pidx) => (
          <div key={pidx} className="poi-card">
            {poi.imageKey && POI_IMAGES[poi.imageKey] && (
              <div className="poi-img">
                <img src={POI_IMAGES[poi.imageKey]} alt={poi.name} />
              </div>
            )}
            <div className="poi-body">
              <div className="poi-time">
                <div className="t">{poi.time || `${9 + pidx * 3}:00`}</div>
                <div className="d">{poi.duration}</div>
              </div>
              <div className="poi-info">
                <div className="poi-name">{poi.name}</div>
                <div className="poi-meta">
                  <span>{poi.type}</span>
                  {poi.rating && <span className="rate">{'★'.repeat(Math.round(poi.rating))} {poi.rating}</span>}
                </div>
                {poi.tip && <div className="poi-tip">{poi.tip}</div>}
                <div className="poi-cost">{poi.cost === '免费' ? '免费' : `~ ¥${poi.cost}`}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Rewrite */}
      <div className="ai-rewrite-bar" onClick={() => alert('AI 已调整行程')}>
        <span className="ic"><Sparkles size={18} /></span>
        <span className="txt">对 AI 说：调整这天的行程...</span>
      </div>
    </div>
  )
}
