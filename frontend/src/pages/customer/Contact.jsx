import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent — we\'ll reply within 1 business day')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-2">Get in Touch</p>
      <h1 className="font-display text-5xl text-cream mb-12">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Email</label>
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Message</label>
            <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none" />
          </div>
          <button type="submit" className="bg-gold text-ink uppercase text-xs tracking-widest px-8 py-3 hover:bg-gold-light transition-colors">
            Send Message
          </button>
        </form>

        <div className="space-y-8 text-cream/70">
          <div>
            <h3 className="font-display text-xl text-gold mb-2">Customer Care</h3>
            <p className="text-sm">hello@lumera-fragrance.com</p>
            <p className="text-sm">+1 (800) 555-0134</p>
          </div>
          <div>
            <h3 className="font-display text-xl text-gold mb-2">Studio</h3>
            <p className="text-sm">128 Moonflower Lane<br/>Savannah, GA 31401</p>
          </div>
          <div>
            <h3 className="font-display text-xl text-gold mb-2">Hours</h3>
            <p className="text-sm">Mon–Fri, 9am–6pm EST</p>
          </div>
        </div>
      </div>
    </div>
  )
}
