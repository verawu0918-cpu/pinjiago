import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '@components/common/NavBar'
import { useAppStore } from '@store'
import { calculatePinjia, suggestDestinations, getDayType } from '@utils/holidays'
import dayjs from 'dayjs'
import './PinjiaResultPage.css'

function PlanTimeline({ plan }) {
  const start = dayjs(plan.startDate)
  const end = dayjs(plan.endDate)
  const days = []
  let current = start
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    const type = getDayType(current.format('YYYY-MM-DD'), plan)
    days.push({
      date: current.format('D'),
      label: current.format('ddd'),
      type
    })
    current = current.add(1, 'day')
  }

  return (
    <div className="plan-timeline">
      {days.map((d, i) => (
        <div key={i} className={`day ${d.type}`}>
          <div className="d">{d.date}</div>
        </div>
      ))}
    </div>
  )
}

function StarRating({ ratio }) {
  const stars = Math.min(5, Math.round(ratio))
  return <div className="plan-stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
}

export default function PinjiaResultPage() {
  const navigate = useNavigate()
  const { pinjiaResults, pinjiaParams, setPinjiaResults, savePinjiaPlan, isPinjiaSaved, showToast } = useAppStore()
  const [error, setError] = useState(null)

  // 如果结果为空，自动重新计算（兼容页面刷新/HMR 等场景）
  useEffect(() => {
    if (!pinjiaResults.length) {
      try {
        const results = calculatePinjia(pinjiaParams)
        if (results.length > 0) {
          setPinjiaResults(results)
        }
      } catch (e) {
        console.error('拼假计算失败:', e)
        setError(e.message)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!pinjiaResults.length) {
    return (
      <div className="pinjia-result-page">
        <NavBar title="拼假方案" showBack />
        <div className="empty-state">
          <p>{error ? `计算出错: ${error}` : '暂无方案，请返回调整参数'}</p>
          <button className="pj-cta" onClick={() => navigate('/pinjia')}>重新计算</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pinjia-result-page">
      <NavBar title="拼假方案" showBack action="全部收藏" onAction={() => {
        pinjiaResults.forEach((p) => savePinjiaPlan(p))
        showToast('已收藏全部方案')
      }} />

      <div className="result-summary">
        <div className="big">找到 {pinjiaResults.length} 个拼假方案</div>
        <div className="sub">
          {pinjiaParams.availableDays} 天年假 · {pinjiaParams.preference} · 按性价比排序
        </div>
      </div>

      {pinjiaResults.map((plan, idx) => (
        <div key={idx} className={`plan-card ${idx === 0 ? 'best' : ''}`}>
          <div className="plan-head">
            <div>
              <div className="plan-title">
                {plan.holidayName} · {plan.direction}
                <small>{plan.startDisplay} — {plan.endDisplay}</small>
              </div>
              <StarRating ratio={parseFloat(plan.ratio)} />
            </div>
            {idx === 0 && <span className="plan-badge">最优</span>}
          </div>

          <PlanTimeline plan={plan} />

          <div className="plan-stats">
            <div className="plan-stat">
              <div className="v">{plan.leaveDays}</div>
              <div className="l">请假天数</div>
            </div>
            <div className="plan-stat">
              <div className="v">{plan.totalDays}</div>
              <div className="l">实际假期</div>
            </div>
            <div className="plan-stat">
              <div className="v">{plan.ratio}</div>
              <div className="l">性价比</div>
            </div>
          </div>

          <div className="plan-cta">
            <button
              className={`btn-ghost ${isPinjiaSaved(plan) ? 'saved' : ''}`}
              onClick={() => {
                savePinjiaPlan(plan)
                showToast('已收藏该方案')
              }}
            >
              {isPinjiaSaved(plan) ? '✓ 已收藏' : '收藏方案'}
            </button>
            <button className="btn-fill" onClick={() => navigate('/plan')}>
              规划行程 →
            </button>
          </div>
        </div>
      ))}

      <div className="plan-legend">
        <span className="lg-leave">请假</span>
        <span className="lg-holiday">法定假日</span>
        <span className="lg-adjust">调休</span>
        <span className="lg-work">工作日</span>
      </div>
    </div>
  )
}
