import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '@components/common/NavBar'
import Tag from '@components/common/Tag'
import { useAppStore } from '@store'
import { calculatePinjia } from '@utils/holidays'
import './PinjiaPage.css'

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const PREFERENCES = ['出境游', '国内长假', '周边游']

export default function PinjiaPage() {
  const navigate = useNavigate()
  const { pinjiaParams, setPinjiaParam, setPinjiaResults } = useAppStore()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleCalculate = () => {
    try {
      const results = calculatePinjia(pinjiaParams)
      console.log('[拼假] 计算完成, 方案数:', results.length, results)
      setPinjiaResults(results)
      navigate('/pinjia/result')
    } catch (e) {
      console.error('[拼假] 计算出错:', e)
      // 即使出错也跳转，让结果页面重新尝试计算
      navigate('/pinjia/result')
    }
  }

  const toggleMonth = (m) => {
    const months = [...pinjiaParams.months]
    const idx = months.indexOf(m)
    if (idx >= 0) months.splice(idx, 1)
    else months.push(m)
    setPinjiaParam('months', months)
  }

  return (
    <div className="pinjia-page">
      <NavBar title="AI 拼假神器" showBack />

      {/* Hero */}
      <div className="pj-hero">
        <h2>AI 拼假神器</h2>
        <p>算出最优方案，用最少的假，玩最多的天</p>
      </div>

      {/* 表单 */}
      <div className="pj-form">
        {/* 目标年份 */}
        <div className="form-row">
          <span className="form-label">目标年份</span>
          <span className="form-value set">{pinjiaParams.year}</span>
        </div>

        {/* 可用年假 */}
        <div className="form-row">
          <span className="form-label">可用年假天数</span>
          <div className="stepper">
            <button onClick={() => setPinjiaParam('availableDays', Math.max(1, pinjiaParams.availableDays - 1))}>−</button>
            <span className="stepper-value">{pinjiaParams.availableDays} 天</span>
            <button onClick={() => setPinjiaParam('availableDays', Math.min(20, pinjiaParams.availableDays + 1))}>+</button>
          </div>
        </div>

        {/* 出行偏好 */}
        <div className="form-row column">
          <span className="form-label">出行偏好</span>
          <div className="preference-tags">
            {PREFERENCES.map((p) => (
              <Tag key={p} active={pinjiaParams.preference === p} onClick={() => setPinjiaParam('preference', p)}>
                {p}
              </Tag>
            ))}
          </div>
        </div>

        {/* 偏好月份 */}
        <div className="form-row column">
          <span className="form-label">偏好月份（可多选）</span>
          <div className="month-grid">
            {MONTHS.map((m) => (
              <Tag key={m} active={pinjiaParams.months.includes(m)} onClick={() => toggleMonth(m)}>
                {m}月
              </Tag>
            ))}
          </div>
        </div>

        {/* 高级选项 */}
        <div className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
          高级选项 <span>{showAdvanced ? '收起 ‹' : '展开 ›'}</span>
        </div>

        {showAdvanced && (
          <div className="advanced-panel">
            <div className="form-row">
              <span className="form-label">避开财年关键节点</span>
              <div className="seg-control">
                <span className={`seg-opt ${!pinjiaParams.avoidFiscal ? 'active' : ''}`}
                      onClick={() => setPinjiaParam('avoidFiscal', false)}>不避开</span>
                <span className={`seg-opt ${pinjiaParams.avoidFiscal ? 'active' : ''}`}
                      onClick={() => setPinjiaParam('avoidFiscal', true)}>避开</span>
              </div>
            </div>
            <div className="form-row">
              <span className="form-label">单段最多连请</span>
              <div className="stepper">
                <button onClick={() => setPinjiaParam('maxConsecutive', Math.max(1, pinjiaParams.maxConsecutive - 1))}>−</button>
                <span className="stepper-value">{pinjiaParams.maxConsecutive} 天</span>
                <button onClick={() => setPinjiaParam('maxConsecutive', Math.min(15, pinjiaParams.maxConsecutive + 1))}>+</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="pj-cta" onClick={handleCalculate}>
        AI 一键算出最优方案
      </div>
      <p className="pj-tip">已内置 2026 年全部法定节假日与调休数据</p>
    </div>
  )
}
