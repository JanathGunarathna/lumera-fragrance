import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const hasDiscount = product.discountPrice && product.discountPrice < product.price

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      await addToCart(product.id, 1)
      toast.success(`${product.name} added to bag`)
    } catch {
      toast.error('Could not add to bag')
    }
  }

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="aspect-[3/4] bg-panel border border-white/10 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <span className="font-display text-5xl text-gold/30">L</span>
        )}
      </div>
      <div className="pt-4 flex justify-between items-start">
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-cream/40">{product.brand || 'Lumera'}</p>
          <h3 className="font-display text-xl text-cream mt-1">{product.name}</h3>
          <p className="text-xs text-cream/50 mt-1">{product.volume}</p>
        </div>
        <div className="text-right">
          {hasDiscount ? (
            <>
              <p className="text-sm line-through text-cream/40">${product.price}</p>
              <p className="text-gold font-medium">${product.discountPrice}</p>
            </>
          ) : (
            <p className="text-gold font-medium">${product.price}</p>
          )}
        </div>
      </div>
      <button
        onClick={handleAdd}
        className="mt-3 w-full border border-gold/40 text-gold text-xs uppercase tracking-widest py-2 hover:bg-gold hover:text-ink transition-colors"
      >
        Add to Bag
      </button>
    </Link>
  )
}
