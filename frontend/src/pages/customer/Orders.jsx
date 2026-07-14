import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axiosConfig'

const statusColor = {
  PENDING: 'text-cream/50',
  PAID: 'text-gold',
  PROCESSING: 'text-gold',
  SHIPPED: 'text-gold',
  DELIVERED: 'text-fern',
  CANCELLED: 'text-red-400',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my').then(res => setOrders(res.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-24 text-cream/50">Loading your orders…</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream mb-10">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-cream/50 mb-6">You haven't placed any orders yet.</p>
          <Link to="/products" className="bg-gold text-ink px-8 py-3 uppercase text-xs tracking-widest hover:bg-gold-light">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border border-white/10 p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-cream font-medium">Order #{order.id} · {order.transactionRef}</p>
                  <p className="text-cream/40 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className={`uppercase text-xs tracking-widest ${statusColor[order.status] || 'text-cream/50'}`}>{order.status}</p>
                  <p className="text-gold font-medium mt-1">${order.totalAmount}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-cream/60">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.productName} × {item.quantity}</span>
                    <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {order.paymentStatus === 'UNPAID' && order.paymentMethod !== 'COD' && (
                <Link to={`/payment/${order.id}`} className="inline-block mt-4 text-xs text-gold hover:underline uppercase tracking-widest">
                  Complete Payment →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
