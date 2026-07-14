import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created — welcome to Lumera')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="font-display text-4xl text-cream mb-2 text-center">Create Account</h1>
      <p className="text-cream/50 text-sm text-center mb-10">Join Lumera for faster checkout and order tracking</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Full Name</label>
          <input required value={form.fullName} onChange={update('fullName')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Email</label>
          <input required type="email" value={form.email} onChange={update('email')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Password</label>
          <input required type="password" minLength={6} value={form.password} onChange={update('password')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Phone</label>
          <input value={form.phone} onChange={update('phone')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Address</label>
          <textarea rows={2} value={form.address} onChange={update('address')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gold text-ink uppercase text-xs tracking-widest py-3 hover:bg-gold-light transition-colors disabled:opacity-50">
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-cream/50 text-sm mt-8">
        Already have an account? <Link to="/login" className="text-gold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
