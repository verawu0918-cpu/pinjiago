import './StatusBar.css'

export default function StatusBar() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return (
    <div className="status-bar">
      <span className="status-time">{hours}:{minutes}</span>
      <div className="status-right">
        {/* Signal */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5"/>
          <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
          <rect x="9" y="2" width="3" height="10" rx="0.5"/>
          <rect x="13" y="0" width="3" height="12" rx="0.5"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM8 6c2.2 0 4.2.9 5.6 2.3l-1.4 1.5C11 8.7 9.6 8.1 8 8.1S5 8.7 3.8 9.8L2.4 8.3C3.8 6.9 5.8 6 8 6zm0-4c3.3 0 6.3 1.3 8.5 3.5L15 7C13.2 5.2 10.7 4.1 8 4.1S2.8 5.2 1 7L-.5 5.5C1.7 3.3 4.7 2 8 2z"/>
        </svg>
        {/* Battery */}
        <svg width="22" height="12" viewBox="0 0 22 12" fill="currentColor">
          <rect x="0" y="1" width="18" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/>
          <rect x="19" y="3.5" width="2" height="5" rx="0.5"/>
          <rect x="2" y="3" width="14" height="6" rx="1"/>
        </svg>
      </div>
    </div>
  )
}
