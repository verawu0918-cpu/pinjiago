import './Tag.css'

export default function Tag({ children, active = false, onClick, variant = 'default' }) {
  return (
    <span
      className={`tag tag-${variant} ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </span>
  )
}
