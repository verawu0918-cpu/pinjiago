import { useNavigate } from 'react-router-dom'
import NavBar from '@components/common/NavBar'
import { useAppStore } from '@store'
import {
  Calendar, MapPin, Users, Star, Shield,
  Settings, FileText, Bell, HelpCircle, ChevronRight, Heart, Bookmark
} from 'lucide-react'
import './ProfilePage.css'

const MENU_ITEMS = [
  { icon: FileText, label: '请假文案记录', value: '' },
  { icon: Users, label: '搭子评价', value: '4.9' },
  { icon: Bell, label: '消息通知', value: '5' },
  { icon: Shield, label: '信用中心', value: '极好' },
  { icon: Settings, label: '设置', value: '' },
  { icon: HelpCircle, label: '帮助与反馈', value: '' },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, leaveAccount, savedPinjiaPlans, savedTripPlans } = useAppStore()
  const usedPercent = (leaveAccount.used / leaveAccount.total) * 100

  return (
    <div className="profile-page">
      {/* Dark Hero */}
      <div className="me-hero">
        <div className="me-profile">
          <div className="me-avatar">{user.name.charAt(0)}</div>
          <div className="me-info">
            <div className="me-name">
              {user.name}
              <span className="me-credit">信用 {user.credit}</span>
            </div>
            <div className="me-id">ID: {user.id} · 加入 {user.registerDays} 天</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="me-stats">
        <div className="me-stat">
          <div className="v">{user.totalTrips}</div>
          <div className="l">旅行次数</div>
        </div>
        <div className="me-stat">
          <div className="v">{user.totalPartners}</div>
          <div className="l">搭子数</div>
        </div>
        <div className="me-stat">
          <div className="v">{user.partnerRating}</div>
          <div className="l">搭子评分</div>
        </div>
      </div>

      {/* Leave Card */}
      <div className="leave-card">
        <div className="lb">{leaveAccount.year} 年假账户</div>
        <div className="lv">{leaveAccount.remaining} <small>天剩余 / 共{leaveAccount.total}天</small></div>
        <div className="progress">
          <div style={{ width: `${usedPercent}%` }} />
        </div>
        <div className="lg">已用 {leaveAccount.used} 天 · {leaveAccount.expireDate} 前过期</div>
      </div>

      {/* 我的收藏 */}
      <div className="saved-section">
        <div className="saved-header">
          <Bookmark size={16} />
          <span>我的收藏</span>
        </div>
        <div className="saved-cards">
          {savedPinjiaPlans.length > 0 ? (
            savedPinjiaPlans.map((plan, idx) => (
              <div key={idx} className="saved-card" onClick={() => navigate('/pinjia/result')}>
                <div className="sc-icon"><Calendar size={18} /></div>
                <div className="sc-info">
                  <div className="sc-title">{plan.holidayName} · {plan.direction}</div>
                  <div className="sc-sub">{plan.startDisplay} — {plan.endDisplay} · 请假{plan.leaveDays}天休{plan.totalDays}天</div>
                </div>
                <ChevronRight size={16} className="menu-arrow" />
              </div>
            ))
          ) : null}
          {savedTripPlans.length > 0 ? (
            savedTripPlans.map((plan, idx) => (
              <div key={`trip-${idx}`} className="saved-card" onClick={() => navigate('/plan/result')}>
                <div className="sc-icon trip"><MapPin size={18} /></div>
                <div className="sc-info">
                  <div className="sc-title">{plan.destination} {plan.duration}日行程</div>
                  <div className="sc-sub">预算 ¥{plan.totalBudget}</div>
                </div>
                <ChevronRight size={16} className="menu-arrow" />
              </div>
            ))
          ) : null}
          {savedPinjiaPlans.length === 0 && savedTripPlans.length === 0 && (
            <div className="saved-empty">暂无收藏，去生成拼假方案或行程吧</div>
          )}
        </div>
      </div>

      {/* Menu List */}
      <div className="menu-list">
        {MENU_ITEMS.map((item) => (
          <div key={item.label} className="menu-item">
            <div className="menu-ic">
              <item.icon size={18} />
            </div>
            <div className="menu-lb">{item.label}</div>
            {item.value && <div className="menu-v">{item.value}</div>}
            <ChevronRight size={16} className="menu-arrow" />
          </div>
        ))}
      </div>
    </div>
  )
}
