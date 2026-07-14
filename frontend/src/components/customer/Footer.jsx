import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-panel border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl text-gold mb-3">Lumera</h3>
          <p className="text-cream/60 text-sm leading-relaxed">
            Fragrances composed around the night-blooming cereus — fleeting, radiant, unforgettable.
          </p>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-widest2 text-cream/50 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/products" className="hover:text-gold">All Fragrances</Link></li>
            <li><Link to="/products?category=Eau%20de%20Parfum" className="hover:text-gold">Eau de Parfum</Link></li>
            <li><Link to="/products?category=Eau%20de%20Toilette" className="hover:text-gold">Eau de Toilette</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-widest2 text-cream/50 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/feedback" className="hover:text-gold">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase text-xs tracking-widest2 text-cream/50 mb-4">Account</h4>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/login" className="hover:text-gold">Sign In</Link></li>
            <li><Link to="/register" className="hover:text-gold">Create Account</Link></li>
            <li><Link to="/orders" className="hover:text-gold">Order History</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} Lumera Fragrance. All rights reserved.
      </div>
    </footer>
  )
}
