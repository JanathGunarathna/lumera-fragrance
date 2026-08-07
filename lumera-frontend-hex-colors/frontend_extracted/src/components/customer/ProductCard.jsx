import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiShoppingBag } from 'react-icons/fi'
import logo from '../../assets/lumera-logo-transparent.png'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const hasDiscount = product.discountPrice && product.discountPrice < product.price

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      await addToCart(product.id, 1)
      toast.success(`${product.name} added to bag`)
    } catch {
      toast.error('Could not add to bag')
    }
  }

  return (
    <Link to={`/products/${product.id}`} className="group block card-anim rounded-sm">
      <div className="sheen relative aspect-[3/4] bg-gradient-to-b from-surface-2 to-surface border border-white/10 group-hover:border-gold/60 flex items-center justify-center overflow-hidden transition-colors duration-300 rounded-sm">
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 bg-yellow text-ink text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-sm shadow-yellow-sm">
            Sale
          </span>
        )}
        {product.stock > 0 && product.stock <= 10 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-widest text-yellow-light bg-ink/70 px-2 py-1 rounded-sm">
            Low stock
          </span>
        )}

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full p-8">
            <span className="absolute w-28 h-28 rounded-full bg-gold/10 blur-2xl group-hover:bg-yellow/20 transition-colors duration-500" aria-hidden="true" />
            <img
              src={logo}
              alt="Lumera"
              className="relative w-full max-w-[180px] object-contain drop-shadow-[0_6px_18px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
              draggable="false"
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="pt-4 flex justify-between items-start">
        <div>
          <p className="text-[11px] uppercase tracking-widest2 text-muted2">{product.brand || 'Lumera'}</p>
          <h3 className="font-display text-xl text-cream mt-1 group-hover:text-gold-light transition-colors">{product.name}</h3>
          <p className="text-xs text-muted mt-1">{product.volume}</p>
        </div>
        <div className="text-right">
          {hasDiscount ? (
            <>
              <p className="text-sm line-through text-muted2">${product.price}</p>
              <p className="text-yellow font-medium">${product.discountPrice}</p>
            </>
          ) : (
            <p className="text-gold-light font-medium">${product.price}</p>
          )}
        </div>
      </div>
      <button
        onClick={handleAdd}
        className="mt-3 w-full border border-gold/40 text-gold-light text-xs uppercase tracking-widest py-2 hover:bg-yellow hover:border-yellow hover:text-ink transition-colors flex items-center justify-center gap-2"
      >
        <FiShoppingBag size={13} /> Add to Bag
      </button>
    </Link>
  )
}
