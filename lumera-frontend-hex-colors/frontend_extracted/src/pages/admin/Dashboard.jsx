import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import AdminLayout from '../../components/admin/AdminLayout'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/admin/dashboard/summary').then(res => setStats(res.data))
  }, [])

  const cards = stats ? [
    { label: 'Total Revenue', value: `$${Number(stats.totalRevenue).toFixed(2)}`, icon: 'bi-currency-dollar', color: '#C6A15B' },
    { label: 'Orders', value: stats.totalOrders, icon: 'bi-receipt', color: '#3F5B45' },
    { label: 'Products', value: stats.totalProducts, icon: 'bi-box-seam', color: '#8E6F35' },
    { label: 'Customers', value: stats.totalUsers, icon: 'bi-people', color: '#0B0B0C' },
  ] : []

  return (
    <AdminLayout>
      <h2 className="mb-4">Dashboard</h2>
      <div className="row g-4">
        {cards.map(c => (
          <div className="col-6 col-lg-3" key={c.label}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <i className={`bi ${c.icon} fs-3`} style={{ color: c.color }}></i>
                <h3 className="mt-3 mb-0">{c.value}</h3>
                <p className="text-muted small mb-0">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!stats && <p className="text-muted mt-4">Loading summary…</p>}
    </AdminLayout>
  )
}
