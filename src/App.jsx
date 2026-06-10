import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAppStore } from '@store'
import PhoneFrame from '@components/common/PhoneFrame'
import StatusBar from '@components/common/StatusBar'
import TabBar from '@components/common/TabBar'

// Pages
import HomePage from '@pages/HomePage'
import PinjiaPage from '@pages/PinjiaPage'
import PinjiaResultPage from '@pages/PinjiaResultPage'
import PlanPage from '@pages/PlanPage'
import PlanResultPage from '@pages/PlanResultPage'
import PartnerPage from '@pages/PartnerPage'
import ProfilePage from '@pages/ProfilePage'

// Loading overlay
function LoadingOverlay() {
  const { loading } = useAppStore()
  if (!loading) return null

  return (
    <div className="loading-overlay show">
      <div className="loading-spinner" />
      <div className="loading-text">AI 正在规划中...</div>
      <div className="loading-sub">正在分析假期数据，生成最优方案</div>
    </div>
  )
}

// Toast notification
function Toast() {
  const { toast } = useAppStore()
  if (!toast) return null

  return (
    <div className="toast-notification">
      <span className="toast-icon">✓</span>
      <span>{toast}</span>
    </div>
  )
}

// Pages that show tab bar
const TAB_PATHS = ['/', '/pinjia', '/partner', '/profile']

function AppContent() {
  const location = useLocation()
  const showTab = TAB_PATHS.includes(location.pathname)

  return (
    <div className="page active">
      <StatusBar />
      <div className={`content ${showTab ? '' : 'no-tab'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pinjia" element={<PinjiaPage />} />
          <Route path="/pinjia/result" element={<PinjiaResultPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/plan/result" element={<PlanResultPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {showTab && <TabBar />}
      <LoadingOverlay />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <PhoneFrame>
      <AppContent />
    </PhoneFrame>
  )
}
