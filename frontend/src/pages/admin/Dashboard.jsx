import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import AdminLayout from '../../components/admin/AdminLayout'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard/summary'),
      api.get('/admin/dashboard/analytics'),
    ]).then(([summary, trends]) => {
      setStats(summary.data)
      setAnalytics(trends.data)
    })
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
      {analytics && (
        <>
          <div className="row g-4 mt-1">
            {[
              ['Daily', analytics.daily],
              ['Weekly', analytics.weekly],
              ['Monthly', analytics.monthly],
            ].map(([title, data]) => (
              <div className="col-12 col-xl-4" key={title}>
                <TrendChart title={`${title} performance`} data={data} />
              </div>
            ))}
          </div>
          <div className="row g-4 mt-1">
            <div className="col-12 col-lg-7">
              <ProductChart products={analytics.topProducts || []} />
            </div>
            <div className="col-12 col-lg-5">
              <StatusChart statuses={analytics.orderStatuses || {}} />
            </div>
          </div>
        </>
      )}
      {!stats && <p className="text-muted mt-4">Loading summary…</p>}
    </AdminLayout>
  )
}

function TrendChart({ title, data }) {
  const maxRevenue = Math.max(...data.map(point => Number(point.revenue)), 1)
  const maxUnits = Math.max(...data.map(point => Number(point.units)), 1)

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>
          <span className="text-muted small">Revenue / units</span>
        </div>
        <div className="d-flex align-items-end gap-2" style={{ height: 150 }}>
          {data.map(point => (
            <div className="flex-fill d-flex align-items-center flex-column h-100 justify-content-end" key={point.label}>
              <div className="w-100 d-flex align-items-end justify-content-center gap-1" style={{ height: 120 }}>
                <div className="bg-success rounded-top" title={`$${Number(point.revenue).toFixed(2)}`} style={{ width: '42%', height: `${Math.max(Number(point.revenue) / maxRevenue * 100, point.revenue > 0 ? 4 : 1)}%` }} />
                <div className="bg-warning rounded-top" title={`${point.units} units`} style={{ width: '42%', height: `${Math.max(Number(point.units) / maxUnits * 100, point.units > 0 ? 4 : 1)}%` }} />
              </div>
              <small className="text-muted text-nowrap mt-2" style={{ fontSize: 10 }}>{point.label}</small>
            </div>
          ))}
        </div>
        <div className="small text-muted mt-3">Orders: {data.reduce((sum, point) => sum + point.orders, 0)} · Revenue: ${data.reduce((sum, point) => sum + Number(point.revenue), 0).toFixed(2)}</div>
      </div>
    </div>
  )
}

function ProductChart({ products }) {
  const maxUnits = Math.max(...products.map(product => product.units), 1)
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="mb-4">Top-selling products</h5>
        {products.length === 0 && <p className="text-muted mb-0">No paid product sales yet.</p>}
        {products.map(product => (
          <div className="mb-3" key={product.name}>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-truncate me-3">{product.name}</span>
              <strong>{product.units}</strong>
            </div>
            <div className="progress" style={{ height: 8 }}>
              <div className="progress-bar bg-success" style={{ width: `${product.units / maxUnits * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusChart({ statuses }) {
  const entries = Object.entries(statuses)
  const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body">
        <h5 className="mb-4">Order status distribution</h5>
        {entries.length === 0 && <p className="text-muted mb-0">No orders yet.</p>}
        {entries.map(([status, count]) => (
          <div className="d-flex align-items-center mb-3" key={status}>
            <span className="small text-muted" style={{ width: 100 }}>{status}</span>
            <div className="progress flex-grow-1" style={{ height: 8 }}>
              <div className="progress-bar bg-dark" style={{ width: `${count / total * 100}%` }} />
            </div>
            <strong className="small ms-2">{count}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
