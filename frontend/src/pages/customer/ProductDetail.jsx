import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [qty, setQty] = useState(1)

  useEffect(() => {
    api.get(`/products/${id}`).then(res => setProduct(res.data))
    api.get(`/feedback/public/product/${id}`).then(res => setReviews(res.data)).catch(() => {})
  }, [id])

  if (!product) return <div className="max-w-7xl mx-auto px-6 py-24 text-cream/50">Loading…</div>

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
    <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
      <div className="aspect-square bg-panel border border-white/10 flex items-center justify-center">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-8xl text-gold/30">L</span>
        )}
      </div>

      <div>
        <p className="uppercase text-xs tracking-widest2 text-cream/40">{product.brand || 'Lumera'}</p>
        <h1 className="font-display text-4xl text-cream mt-2">{product.name}</h1>
        {avgRating && <p className="text-gold text-sm mt-2">★ {avgRating} ({reviews.length} reviews)</p>}

        <div className="mt-6 flex items-baseline gap-3">
          {hasDiscount ? (
            <>
              <span className="text-2xl text-gold font-medium">${product.discountPrice}</span>
              <span className="line-through text-cream/40">${product.price}</span>
            </>
          ) : (
            <span className="text-2xl text-gold font-medium">${product.price}</span>
          )}
          <span className="text-cream/40 text-sm">/ {product.volume}</span>
        </div>

        <p className="text-cream/70 leading-relaxed mt-6">{product.description}</p>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center border border-white/20">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-cream/70 hover:text-gold">−</button>
            <span className="px-4 text-cream">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="px-3 py-2 text-cream/70 hover:text-gold">+</button>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="flex-1 bg-gold text-ink uppercase text-xs tracking-widest py-3 hover:bg-gold-light transition-colors disabled:opacity-40"
          >
            {product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <p className="text-xs text-gold/70 mt-3">Only {product.stock} left in this batch.</p>
        )}

        <div className="mt-16 border-t border-white/10 pt-8">
          <h2 className="font-display text-2xl text-cream mb-6">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-cream/50 text-sm">No reviews yet for this fragrance.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-white/5 pb-4">
                  <p className="text-gold text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                  <p className="text-cream/70 text-sm mt-2">{r.comment}</p>
                  <p className="text-cream/40 text-xs mt-1">{r.user?.fullName || 'Verified customer'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
