import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState({ fullName: user.fullName, phone: user.phone || '', address: user.address || '' })
  const [saving, setSaving] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/users/me', form)
      toast.success('Profile updated')
    } catch {
      toast.error('Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-cream mb-2">My Account</h1>
      <p className="text-cream/50 text-sm mb-10">{user.email}</p>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Full Name</label>
          <input value={form.fullName} onChange={update('fullName')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Phone</label>
          <input value={form.phone} onChange={update('phone')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Address</label>
          <textarea rows={3} value={form.address} onChange={update('address')}
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
        </div>
        <button type="submit" disabled={saving}
          className="w-full bg-gold text-ink uppercase text-xs tracking-widest py-3 hover:bg-gold-light transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-white/10 flex justify-between text-sm">
        <a href="/orders" className="text-cream/60 hover:text-gold">View order history</a>
        <button onClick={logout} className="text-cream/60 hover:text-gold">Sign out</button>
      </div>
    </div>
  )
}
