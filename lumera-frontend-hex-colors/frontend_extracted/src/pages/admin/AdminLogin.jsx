import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { adminLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminLogin(form.email, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-shell d-flex align-items-center justify-content-center">
      <div className="card shadow-sm p-4" style={{ width: 380 }}>
        <h3 className="text-center mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8E6F35' }}>Lumera Admin</h3>
        <p className="text-center text-muted small mb-4">Sign in to manage the store</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small">Email</label>
            <input required type="email" className="form-control" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-4">
            <label className="form-label small">Password</label>
            <input required type="password" className="form-control" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn btn-dark w-100">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
