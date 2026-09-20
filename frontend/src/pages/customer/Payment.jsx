import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'

export default function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const startPayment = async () => {
      try {
        const res = await api.post(`/payments/payhere/initiate/${orderId}`)
        if (cancelled) return

        const fields = res.data
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = fields.action
        form.style.display = 'none'

        Object.entries(fields).forEach(([name, value]) => {
          if (name === 'action' || value === null || value === undefined) return
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = name
          input.value = value
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      } catch (err) {
        if (!cancelled) {
          toast.error(err.response?.data?.message || 'Unable to start PayHere payment')
          navigate('/orders')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    startPayment()

    return () => {
      cancelled = true
    }
  }, [orderId, navigate])

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="bg-panel border border-white/10 p-10">
        <div className="w-12 h-12 mx-auto mb-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <h1 className="font-display text-3xl text-cream mb-3">Secure payment</h1>
        <p className="text-cream/50 text-sm">
          {loading
            ? 'Connecting you to PayHere…'
            : 'Redirecting to the secure PayHere checkout…'}
        </p>
        <p className="text-cream/30 text-xs mt-6">
          Your card details are entered directly on PayHere. Lumera does not store your card number or CVV.
        </p>
      </div>
    </div>
  )
}
