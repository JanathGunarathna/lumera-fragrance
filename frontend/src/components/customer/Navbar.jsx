import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Fragrances' },
  { to: '/about', label: 'About' },
  { to: '/feedback', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 bg-ink/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="font-display text-3xl tracking-wide text-gold flex items-baseline gap-1">
          Lumera
          <span className="text-[10px] tracking-widest2 text-cream/60 font-body uppercase ml-2 hidden sm:inline">Fragrance</span>
        </Link>

        <nav className="hidden md:flex gap-10 font-body text-sm uppercase tracking-[0.15em] text-cream/80">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `bloom-underline pb-1 transition-colors ${isActive ? 'text-gold' : 'hover:text-gold'}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/cart" aria-label="Cart" className="relative text-cream hover:text-gold transition-colors">
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/profile" className="text-cream/80 hover:text-gold text-sm flex items-center gap-1">
                <FiUser /> {user.fullName?.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); navigate('/') }} className="text-sm text-cream/60 hover:text-gold">
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-block text-sm uppercase tracking-widest text-cream/80 hover:text-gold">
              Sign in
            </Link>
          )}

          <button className="md:hidden text-cream" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-panel border-t border-white/10 px-6 py-6 flex flex-col gap-4 font-body uppercase tracking-widest text-sm">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-cream/80 hover:text-gold">
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-cream/80 hover:text-gold">My account</Link>
              <button onClick={() => { logout(); setOpen(false); navigate('/') }} className="text-left text-cream/60 hover:text-gold">Sign out</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-cream/80 hover:text-gold">Sign in</Link>
          )}
        </div>
      )}
    </header>
  )
}
