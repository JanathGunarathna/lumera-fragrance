import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Checkout() {
  const { user } = useAuth()
  const { items, cartTotal, refresh } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    shippingAddress: user?.address || '',
    shippingPhone: user?.phone || '',
    paymentMethod: 'CARD',
  })
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.shippingAddress) { toast.error('Please add a shipping address'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/orders', form)
      await refresh()
      toast.success('Order created — continue to payment')
      navigate(`/payment/${res.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-cream/50">Your bag is empty. <a href="/products" className="text-gold">Browse fragrances</a>.</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream mb-10">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Shipping Address</label>
          <textarea
            required
            value={form.shippingAddress}
            onChange={update('shippingAddress')}
            rows={3}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none"
            placeholder="Street, city, state, ZIP"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Phone Number</label>
          <input
            required
            value={form.shippingPhone}
            onChange={update('shippingPhone')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none"
            placeholder="For delivery updates"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-3">Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            {['CARD', 'UPI', 'COD'].map(m => (
              <button
                type="button"
                key={m}
                onClick={() => setForm({ ...form, paymentMethod: m })}
                className={`py-3 text-sm uppercase tracking-widest border ${form.paymentMethod === m ? 'bg-gold text-ink border-gold' : 'border-white/20 text-cream/70 hover:border-gold'}`}
              >
                {m === 'COD' ? 'Cash on Delivery' : m}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-panel border border-white/10 p-6">
          <div className="flex justify-between text-cream/70 text-sm mb-2">
            <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-cream font-medium border-t border-white/10 pt-3">
            <span>Total</span><span>${(cartTotal + (cartTotal >= 75 ? 0 : 8)).toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-ink uppercase text-xs tracking-widest py-4 hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {submitting ? 'Placing order…' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
