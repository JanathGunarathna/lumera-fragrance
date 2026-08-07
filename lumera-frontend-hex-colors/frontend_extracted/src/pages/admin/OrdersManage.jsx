import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import AdminLayout from '../../components/admin/AdminLayout'

const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function OrdersManage() {
  const [orders, setOrders] = useState([])
  const [expanded, setExpanded] = useState(null)

  const load = () => api.get('/admin/orders').then(res => setOrders(res.data))
  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status })
      toast.success('Order status updated')
      load()
    } catch {
      toast.error('Could not update status')
    }
  }

  return (
    <AdminLayout>
      <h2 className="mb-4">Orders</h2>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <>
                  <tr key={o.id}>
                    <td>#{o.id} <span className="text-muted small d-block">{o.transactionRef}</span></td>
                    <td>{o.user?.fullName}<span className="text-muted small d-block">{o.user?.email}</span></td>
                    <td>${o.totalAmount}</td>
                    <td><span className={`badge ${o.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>{o.paymentStatus}</span></td>
                    <td style={{ minWidth: 160 }}>
                      <select className="form-select form-select-sm" value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                        {expanded === o.id ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr>
                      <td colSpan={6} className="bg-light">
                        <div className="p-2">
                          <p className="mb-1 small"><strong>Ship to:</strong> {o.shippingAddress} ({o.shippingPhone})</p>
                          <ul className="mb-0 small">
                            {o.items.map(i => <li key={i.id}>{i.productName} × {i.quantity} — ${i.unitPrice}</li>)}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
