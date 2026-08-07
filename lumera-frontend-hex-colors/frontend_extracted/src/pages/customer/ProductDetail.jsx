import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import api from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Tilt3D from '../../components/common/Tilt3D'
import Reveal from '../../components/common/Reveal'
import logo from '../../assets/lumera-logo-transparent.png'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data)).catch(() => {})
    api.get(`/feedback/public/product/${id}`).then(res => setReviews(res.data)).catch(() => {})
  }, [id])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="flex justify-center">
          <img src={logo} alt="Lumera" className="w-56 opacity-80" draggable="false" />
        </div>
        <p className="text-muted">Loading this fragrance…</p>
      </div>
    )
  }

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const handleAdd = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      await addToCart(product.id, qty)
      toast.success('Added to bag')
    } catch {
      toast.error('Could not add to bag')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="text-xs text-muted2 mb-8">
        <Link to="/" className="hover:text-yellow-light">Home</Link> / <Link to="/products" className="hover:text-yellow-light">Fragrances</Link> / <span className="text-cream/70">{product.name}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-16">
        {/* image / brand plate */}
        <Reveal>
          <div className="relative aspect-square bg-gradient-to-b from-surface-2 to-surface border border-gold/15 flex items-center justify-center overflow-hidden rounded-sm">
            <span className="glow-pulse absolute inset-0 -m-10 rounded-full bg-yellow/10 blur-3xl" aria-hidden="true" />
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="relative w-full h-full object-cover" />
            ) : (
              <Tilt3D max={12} scale={1.02} className="relative p-10">
                <img src={logo} alt="Lumera Fragrance" className="w-full max-w-[260px] object-contain" draggable="false" />
              </Tilt3D>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="uppercase text-xs tracking-widest2 text-muted2">{product.brand || 'Lumera'}</p>
          <h1 className="font-display text-4xl text-cream mt-2">{product.name}</h1>
          {avgRating && <p className="text-yellow text-sm mt-2">★ {avgRating} ({reviews.length} reviews)</p>}

          <div className="mt-6 flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                <span className="text-2xl text-yellow-light font-medium">${product.discountPrice}</span>
                <span className="line-through text-muted2">${product.price}</span>
              </>
            ) : (
              <span className="text-2xl text-yellow-light font-medium">${product.price}</span>
            )}
            <span className="text-muted2 text-sm">/ {product.volume}</span>
          </div>

          <p className="text-cream/90 leading-relaxed mt-6">{product.description}</p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-gold/25">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-cream/90 hover:text-yellow-light">−</button>
              <span className="px-4 text-cream">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-cream/90 hover:text-yellow-light">+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-1 bg-yellow text-ink uppercase text-xs tracking-widest py-3 hover:bg-yellow-light transition-colors disabled:opacity-40 shadow-yellow-sm font-medium"
            >
              {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
            </button>
          </div>

          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-yellow mt-3">Only {product.stock} left in this batch.</p>
          )}

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-gold/10 pt-6">
            <div className="text-center">
              <FiTruck className="mx-auto text-yellow mb-1.5" size={18} />
              <p className="text-[11px] text-muted2 uppercase tracking-widest">Free Shipping</p>
            </div>
            <div className="text-center">
              <FiShield className="mx-auto text-yellow mb-1.5" size={18} />
              <p className="text-[11px] text-muted2 uppercase tracking-widest">Secure Checkout</p>
            </div>
            <div className="text-center">
              <FiRefreshCw className="mx-auto text-yellow mb-1.5" size={18} />
              <p className="text-[11px] text-muted2 uppercase tracking-widest">30-Day Returns</p>
            </div>
          </div>

          <div className="mt-16 border-t border-gold/10 pt-8">
            <h2 className="font-display text-2xl text-cream mb-6">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-muted text-sm">No reviews yet for this fragrance.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map(r => (
                  <div key={r.id} className="border-b border-white/5 pb-4">
                    <p className="text-yellow text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                    <p className="text-cream/90 text-sm mt-2">{r.comment}</p>
                    <p className="text-muted2 text-xs mt-1">{r.user?.fullName || 'Verified customer'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
