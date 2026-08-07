import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axiosConfig'
import logo from '../../assets/lumera-logo-transparent.png'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const validate = () => {
    const next = {}
    if (!form.email) next.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.password) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })
      const { token } = res.data
      if (remember) localStorage.setItem('lumera_token', token)
      else sessionStorage.setItem('lumera_token', token)
      navigate('/')
    } catch (err) {
      setServerError(
        err?.response?.data?.message || 'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center border-r border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-panel via-ink to-ink" aria-hidden="true" />
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" aria-hidden="true" />

        <div className="relative z-10 max-w-md px-12 text-center">
          <img src={logo} alt="Lumera Fragrance" className="w-56 mx-auto mb-10 select-none" draggable="false" />
          <p className="uppercase text-xs tracking-widest2 text-gold mb-4">Welcome Back</p>
          <h1 className="font-display text-3xl text-cream leading-snug mb-4">
            Every login opens <span className="text-gold italic">one more hour</span> of bloom.
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Sign in to track your orders, revisit your favorite scents, and be first to know
            when the next cereus blossom opens.
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* mobile logo */}
          <img src={logo} alt="Lumera Fragrance" className="w-40 mx-auto mb-10 lg:hidden select-none" draggable="false" />

          <p className="uppercase text-xs tracking-widest2 text-gold mb-2 text-center lg:text-left">
            Sign In
          </p>
          <h2 className="font-display text-3xl text-cream mb-8 text-center lg:text-left">
            Access your account
          </h2>

          {serverError && (
            <div
              className="alert alert-danger py-2 px-3 mb-6 text-sm bg-red-950/40 border border-red-500/30 text-red-200 rounded-none"
              role="alert"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block uppercase text-xs tracking-widest text-muted mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`form-control bg-transparent border-0 border-b rounded-none px-0 py-3 text-cream placeholder:text-muted2 focus:shadow-none focus:ring-0 focus:outline-none transition-colors
                  ${errors.email ? 'border-red-400' : 'border-white/20 focus:border-gold'}`}
              />
              {errors.email && (
                <div className="invalid-feedback d-block text-red-400 text-xs mt-1">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="uppercase text-xs tracking-widest text-muted">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-gold hover:text-gold transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`form-control bg-transparent border-0 border-b rounded-none px-0 py-3 pr-10 text-cream placeholder:text-muted2 focus:shadow-none focus:ring-0 focus:outline-none transition-colors
                    ${errors.password ? 'border-red-400' : 'border-white/20 focus:border-gold'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-muted2 hover:text-gold text-xs uppercase tracking-wide transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block text-red-400 text-xs mt-1">{errors.password}</div>
              )}
            </div>

            {/* Remember me */}
            <div className="form-check flex items-center gap-2 mt-6 mb-8">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="form-check-input bg-transparent border-white/30 checked:bg-gold checked:border-gold focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="form-check-label text-sm text-muted cursor-pointer select-none">
                Keep me signed in
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-ink py-3 uppercase text-xs tracking-widest hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <span
                  className="spinner-border spinner-border-sm"
                  style={{ width: '0.9rem', height: '0.9rem', borderWidth: '2px' }}
                  role="status"
                  aria-hidden="true"
                />
              )}
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-8">
            New to Lumera?{' '}
            <Link to="/register" className="text-gold hover:text-gold-light transition-colors">
              Create an account
            </Link>
          </p>

          <p className="text-center mt-10">
            <Link to="/" className="text-xs uppercase tracking-widest text-muted2 hover:text-gold transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}