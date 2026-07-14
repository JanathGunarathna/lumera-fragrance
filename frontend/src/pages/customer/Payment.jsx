import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'

export default function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [method, setMethod] = useState('CARD')
  const [card, setCard] = useState({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' })
  const [submitting, setSubmitting] = useState(false)

  const update = (field) => (e) => setCard({ ...card, [field]: e.target.value })

  const handlePay = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/payments/pay', {
        orderId: Number(orderId),
        paymentMethod: method,
        ...card,
      })
      if (res.data.success) {
        toast.success('Payment confirmed!')
        navigate('/orders')
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream mb-3">Payment</h1>
      <p className="text-cream/50 text-sm mb-10">Order #{orderId} — this is a simulated gateway for demo purposes.</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {['CARD', 'UPI', 'COD'].map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`py-3 text-sm uppercase tracking-widest border ${method === m ? 'bg-gold text-ink border-gold' : 'border-white/20 text-cream/70 hover:border-gold'}`}
          >
            {m === 'COD' ? 'Cash' : m}
          </button>
        ))}
      </div>

      <form onSubmit={handlePay} className="space-y-5">
        {method === 'CARD' && (
          <>
            <div>
              <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Card Number</label>
              <input required value={card.cardNumber} onChange={update('cardNumber')} maxLength={19} placeholder="4242 4242 4242 4242"
                className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Cardholder Name</label>
              <input required value={card.cardHolder} onChange={update('cardHolder')}
                className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Expiry</label>
                <input required value={card.expiry} onChange={update('expiry')} placeholder="MM/YY"
                  className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">CVV</label>
                <input required value={card.cvv} onChange={update('cvv')} maxLength={4} type="password"
                  className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
              </div>
            </div>
          </>
        )}

        {method === 'UPI' && (
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">UPI ID</label>
            <input required placeholder="yourname@upi"
              className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
          </div>
        )}

        {method === 'COD' && (
          <p className="text-cream/60 text-sm">Pay in cash when your order arrives. No card details needed.</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-ink uppercase text-xs tracking-widest py-4 hover:bg-gold-light transition-colors disabled:opacity-50 mt-4"
        >
          {submitting ? 'Processing…' : method === 'COD' ? 'Confirm Order' : 'Pay Now'}
        </button>
      </form>
    </div>
  )
}
