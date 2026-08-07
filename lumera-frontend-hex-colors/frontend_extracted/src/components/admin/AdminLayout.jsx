import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/admin/products', label: 'Products', icon: 'bi-box-seam' },
  { to: '/admin/orders', label: 'Orders', icon: 'bi-receipt' },
  { to: '/admin/feedback', label: 'Feedback', icon: 'bi-chat-square-text' },
  { to: '/admin/users', label: 'Customers', icon: 'bi-people' },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="admin-shell d-flex">
      <aside className="d-none d-md-flex flex-column bg-dark text-white p-4" style={{ width: 240, minHeight: '100vh' }}>
        <h4 className="mb-5" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C6A15B' }}>
          Lumera <span className="d-block fs-6 text-white-50">Admin</span>
        </h4>
        <nav className="nav flex-column gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link text-white-50 rounded px-3 py-2 ${isActive ? 'bg-secondary text-white' : ''}`}
            >
              <i className={`bi ${l.icon} me-2`}></i>{l.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="btn btn-outline-light btn-sm mt-auto"
          onClick={() => { logout(); navigate('/admin/login') }}
        >
          Sign out
        </button>
      </aside>

      <main className="flex-grow-1">
        <header className="bg-white border-bottom px-4 py-3 d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Admin Console</span>
          <span className="text-muted small">{user?.fullName}</span>
        </header>
        <div className="p-4">{children}</div>
      </main>
    </div>
  )
}
