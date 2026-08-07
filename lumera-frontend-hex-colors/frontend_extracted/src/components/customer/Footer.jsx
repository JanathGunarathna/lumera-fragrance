import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import logo from '../../assets/lumera-logo-transparent.png'

const perks = [
  { icon: FiTruck, label: 'Free shipping over $75' },
  { icon: FiShield, label: 'Secure encrypted checkout' },
  { icon: FiRefreshCw, label: '30-day easy returns' },
]

export default function Footer() {
  return (
    <footer className="relative bg-panel border-t border-gold/10 mt-27 overflow-hidden">
      {/* thin gold gradient hairline across the very top, echoes navbar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--color-gold) / 0.6), transparent)' }}
        aria-hidden="true"
      />

      {/* perk strip */}
      <div className="border-b border-white/10 bg-surface/40">
        <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {perks.map((p) => (
            <div key={p.label} className="flex items-center justify-center sm:justify-start gap-3 text-cream/90 text-sm">
              <p.icon className="text-gold shrink-0" size={18} />
              {p.label}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img src={logo} alt="Lumera Fragrance" className="h-16 w-auto object-contain mb-4" draggable="false" />
          <p className="text-muted text-sm leading-relaxed">
            Fragrances composed around the night-blooming cereus — fleeting, radiant, unforgettable.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a href="#" aria-label="Instagram" className="text-cream/70 hover:text-gold transition-colors"><FiInstagram size={18} /></a>
            <a href="#" aria-label="Twitter" className="text-cream/70 hover:text-gold transition-colors"><FiTwitter size={18} /></a>
            <a href="#" aria-label="Facebook" className="text-cream/70 hover:text-gold transition-colors"><FiFacebook size={18} /></a>
          </div>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-widest2 text-muted mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/90">
            <li><Link to="/products" className="hover:text-gold transition-colors">All Fragrances</Link></li>
            <li><Link to="/products?category=Eau%20de%20Parfum" className="hover:text-gold transition-colors">Eau de Parfum</Link></li>
            <li><Link to="/products?category=Eau%20de%20Toilette" className="hover:text-gold transition-colors">Eau de Toilette</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-widest2 text-muted mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-cream/90">
            <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/feedback" className="hover:text-gold transition-colors">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-widest2 text-muted mb-4">Account</h4>
          <ul className="space-y-2 text-sm text-cream/90">
            <li><Link to="/login" className="hover:text-gold transition-colors">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-gold transition-colors">Create Account</Link></li>
            <li><Link to="/orders" className="hover:text-gold transition-colors">Order History</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-muted2">
        © {new Date().getFullYear()} Lumera Fragrance. All rights reserved.
      </div>
    </footer>
  )
}
