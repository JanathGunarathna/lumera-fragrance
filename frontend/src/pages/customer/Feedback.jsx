import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Feedback() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadReviews = () => api.get('/feedback/public/site').then(res => setReviews(res.data))

  useEffect(() => { loadReviews() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    setSubmitting(true)
    try {
      await api.post('/feedback', { rating, comment })
      toast.success('Thank you for your feedback!')
      setComment('')
      setRating(5)
      loadReviews()
    } catch {
      toast.error('Could not submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-2">Customer Voices</p>
      <h1 className="font-display text-5xl text-cream mb-12">Reviews & Feedback</h1>

      <form onSubmit={handleSubmit} className="border border-white/10 p-8 mb-16">
        <h2 className="font-display text-2xl text-cream mb-6">Share Your Experience</h2>
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button type="button" key={n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? 'text-gold' : 'text-cream/20'}`}>★</button>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest text-cream/50 mb-2">Your Feedback</label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tell us about your Lumera experience..."
            className="w-full bg-panel border border-white/20 px-4 py-3 text-cream focus:border-gold outline-none"
          />
        </div>
        <button type="submit" disabled={submitting}
          className="bg-gold text-ink uppercase text-xs tracking-widest px-8 py-3 hover:bg-gold-light transition-colors disabled:opacity-50">
          {submitting ? 'Submitting…' : 'Submit Feedback'}
        </button>
        {!isAuthenticated && <p className="text-cream/40 text-xs mt-3">You'll need to sign in first.</p>}
      </form>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-cream/50">Be the first to leave feedback.</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} className="border-b border-white/10 pb-6">
              <p className="text-gold text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
              <p className="text-cream/70 mt-2">{r.comment}</p>
              <p className="text-cream/40 text-xs mt-2">{r.user?.fullName || 'Verified customer'} · {new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
