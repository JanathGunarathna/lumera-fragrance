import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { toast } from 'react-toastify'

export default function Cart() {
  const { items, loading, updateQuantity, removeFromCart, cartTotal } = useCart()
  const navigate = useNavigate()

  const handleRemove = async (id) => {
    await removeFromCart(id)
    toast.info('Removed from bag')
  }

  if (loading) return <div className="max-w-5xl mx-auto px-6 py-24 text-cream/50">Loading your bag…</div>

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream mb-10">Your Bag</h1>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-cream/50 mb-6">Your bag is empty.</p>
          <Link to="/products" className="bg-gold text-ink px-8 py-3 uppercase text-xs tracking-widest hover:bg-gold-light">
            Browse Fragrances
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6">
            {items.map(item => {
              const price = item.product.discountPrice ?? item.product.price
              return (
                <div key={item.id} className="flex gap-5 border-b border-white/10 pb-6">
                  <div className="w-24 h-24 bg-panel border border-white/10 flex items-center justify-center flex-shrink-0">
                    {item.product.imageUrl
                      ? <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      : <span className="font-display text-2xl text-gold/30">L</span>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-cream">{item.product.name}</h3>
                    <p className="text-cream/40 text-xs">{item.product.volume}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-white/20">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 text-cream/70 hover:text-gold">−</button>
                        <span className="px-3 text-cream text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-cream/70 hover:text-gold">+</button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} className="text-xs text-cream/40 hover:text-gold uppercase tracking-widest">
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-gold font-medium">${(price * item.quantity).toFixed(2)}</p>
                </div>
              )
            })}
          </div>

          <div className="bg-panel border border-white/10 p-8 h-fit">
            <h2 className="font-display text-2xl text-cream mb-6">Order Summary</h2>
            <div className="flex justify-between text-cream/70 text-sm mb-3">
              <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-cream/70 text-sm mb-6">
              <span>Shipping</span><span>{cartTotal >= 75 ? 'Free' : '$8.00'}</span>
            </div>
            <div className="flex justify-between text-cream font-medium text-lg border-t border-white/10 pt-4 mb-6">
              <span>Total</span><span>${(cartTotal + (cartTotal >= 75 ? 0 : 8)).toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-gold text-ink uppercase text-xs tracking-widest py-3 hover:bg-gold-light transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
