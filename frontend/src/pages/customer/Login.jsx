import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="font-display text-4xl text-cream mb-2 text-center">Sign In</h1>
      <p className="text-cream/50 text-sm text-center mb-10">Welcome back to Lumera</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Email</label>
          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Password</label>
          <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gold text-ink uppercase text-xs tracking-widest py-3 hover:bg-gold-light transition-colors disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-cream/50 text-sm mt-8">
        New to Lumera? <Link to="/register" className="text-gold hover:underline">Create an account</Link>
      </p>
      <p className="text-center text-cream/30 text-xs mt-3">
        <Link to="/admin/login" className="hover:text-gold">Admin sign in</Link>
      </p>
    </div>
  )
}
