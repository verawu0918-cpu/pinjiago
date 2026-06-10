import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import './NavBar.css'

export default function NavBar({ title, showBack = false, action, onAction }) {
  const navigate = useNavigate()

  return (
    <header className="nav-bar">
      <div className="nav-left">
        {showBack && (
          <button className="nav-back" onClick={() => navigate(-1)}>
            <ChevronLeft size={22} />
          </button>
        )}
      </div>
      <span className="nav-title">{title}</span>
      <div className="nav-right">
        {action && (
          <button className="nav-action" onClick={onAction}>
            {action}
          </button>
        )}
      </div>
    </header>
  )
}
