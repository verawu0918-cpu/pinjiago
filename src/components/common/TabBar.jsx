import { useNavigate, useLocation } from 'react-router-dom'
import './TabBar.css'

const HomeIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
    <circle cx="20" cy="20" r="17" fill="#E8F5E9"/>
    <path d="M20 9L9 18v12a2 2 0 002 2h18a2 2 0 002-2V18L20 9z" fill="#43A047"/>
    <path d="M17 32v-7a3 3 0 016 0v7" fill="#fff"/>
    <ellipse cx="27" cy="29" rx="3.5" ry="2.5" fill="#81C784"/>
    <circle cx="29" cy="27" r="2" fill="#66BB6A"/>
  </svg>
)

const PinjiaIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
    <rect x="5" y="9" width="30" height="24" rx="4" fill="#E8F5E9" stroke="#43A047" strokeWidth="1.2"/>
    <rect x="12" y="5" width="2.5" height="6" rx="1.2" fill="#43A047"/>
    <rect x="25.5" y="5" width="2.5" height="6" rx="1.2" fill="#43A047"/>
    <line x1="20" y1="11" x2="20" y2="31" stroke="#66BB6A" strokeDasharray="2.5 2" strokeWidth="1"/>
    <circle cx="27" cy="16" r="2.5" fill="#FFA726"/>
    <path d="M27 30c-2 0-2.5-1.2-2.5-3s2.5-5.5 2.5-5.5 2.5 3.7 2.5 5.5-0.5 3-2.5 3z" fill="#43A047"/>
    <path d="M27 22.5c-0.8 0-1.5 0.5-2 1.2" stroke="#81C784" strokeWidth="0.8"/>
    <path d="M10 20l2.5-2.5 2.5 2.5 2.5-2.5" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PartnerIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
    <circle cx="20" cy="20" r="17" fill="#E8F5E9" opacity="0.6"/>
    <circle cx="14" cy="16" r="5" fill="#FFCCBC"/>
    <ellipse cx="14" cy="12.5" rx="5" ry="3.5" fill="#43A047"/>
    <circle cx="14" cy="11" r="1" fill="#43A047"/>
    <circle cx="26" cy="16" r="5" fill="#FFCCBC"/>
    <ellipse cx="26" cy="12.5" rx="5" ry="3.5" fill="#FFC107"/>
    <circle cx="12.5" cy="17" r="0.8" fill="#333"/>
    <circle cx="15.5" cy="17" r="0.8" fill="#333"/>
    <circle cx="24.5" cy="17" r="0.8" fill="#333"/>
    <circle cx="27.5" cy="17" r="0.8" fill="#333"/>
    <path d="M20 32l-1.5-4a1.5 1.5 0 011.5-1h0a1.5 1.5 0 011.5 1L20 32z" fill="#43A047"/>
    <circle cx="20" cy="27" r="2.2" fill="#43A047"/>
    <circle cx="20" cy="27" r="1" fill="#fff"/>
  </svg>
)

const ProfileIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" width="30" height="30">
    <circle cx="20" cy="20" r="17" fill="#E8F5E9"/>
    <circle cx="20" cy="15" r="5.5" fill="#A5D6A7"/>
    <path d="M10 34c0-6 4.5-10 10-10s10 4 10 10" fill="#A5D6A7"/>
    <ellipse cx="28" cy="27" rx="2.5" ry="4" fill="#43A047" transform="rotate(-15 28 27)"/>
    <ellipse cx="30" cy="24.5" rx="2" ry="3" fill="#66BB6A" transform="rotate(-35 30 24.5)"/>
  </svg>
)

const tabs = [
  { key: 'home', label: '首页', path: '/', Icon: HomeIcon },
  { key: 'pinjia', label: '拼假', path: '/pinjia', Icon: PinjiaIcon },
  { key: 'partner', label: '搭子', path: '/partner', Icon: PartnerIcon },
  { key: 'me', label: '我的', path: '/profile', Icon: ProfileIcon },
]

export default function TabBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-item ${isActive(tab.path) ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          <span className="tab-icon">
            <tab.Icon />
          </span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
