import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const SHIPPING_FEE = 8

export default function Checkout() {
  const { user } = useAuth()
  const { items, cartTotal, refresh } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    shippingAddress: user?.address || '',
    shippingPhone: user?.phone || '',
    paymentMethod: 'PAYHERE',
  })
  const [submitting, setSubmitting] = useState(false)

  const shippingFee = cartTotal >= 75 ? 0 : SHIPPING_FEE
  const total = cartTotal + shippingFee

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.shippingAddress.trim()) {
      toast.error('Please add a shipping address')
      return
    }

    if (!form.shippingPhone.trim()) {
      toast.error('Please add a phone number')
      return
    }

    setSubmitting(true)

    try {
      const res = await api.post('/orders', form)
      await refresh()

      if (form.paymentMethod === 'COD') {
        toast.success('Order placed successfully')
        navigate('/orders')
      } else {
        navigate(`/payment/${res.data.id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-cream/50">
        Your bag is empty. <a href="/products" className="text-gold">Browse fragrances</a>.
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">
            Shipping Address
          </label>
          <textarea
            required
            value={form.shippingAddress}
            onChange={update('shippingAddress')}
            rows={3}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none"
            placeholder="Street, city, district, postal code"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">
            Phone Number
          </label>
          <input
            required
            value={form.shippingPhone}
            onChange={update('shippingPhone')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none"
            placeholder="For delivery updates"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-3">
            Payment Method
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                value: 'PAYHERE',
                title: 'PayHere',
                description: 'Cards and supported PayHere payment methods',
              },
              {
                value: 'COD',
                title: 'Cash on Delivery',
                description: 'Pay when your fragrance arrives',
              },
            ].map(method => (
              <button
                type="button"
                key={method.value}
                onClick={() => setForm({ ...form, paymentMethod: method.value })}
                className={`text-left p-4 border transition-colors ${
                  form.paymentMethod === method.value
                    ? 'bg-gold/10 border-gold'
                    : 'border-white/20 hover:border-gold/60'
                }`}
              >
                <span className="block text-sm uppercase tracking-widest text-cream">
                  {method.title}
                </span>
                <span className="block text-xs text-cream/40 mt-1">
                  {method.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-panel border border-white/10 p-6">
          <div className="flex justify-between text-cream/70 text-sm mb-2">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-cream/70 text-sm mb-3">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between text-cream font-medium border-t border-white/10 pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-ink uppercase text-xs tracking-widest py-4 hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {submitting
            ? 'Processing…'
            : form.paymentMethod === 'PAYHERE'
              ? 'Continue to PayHere'
              : 'Place Cash on Delivery Order'}
        </button>
      </form>
    </div>
  )
}
