import { Link, useSearchParams } from 'react-router-dom'

export default function PaymentResult({ cancelled = false }) {
  const [params] = useSearchParams()
  const orderId = params.get('orderId')

  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="bg-panel border border-white/10 p-10">
        <p className={`text-xs uppercase tracking-[0.25em] mb-4 ${cancelled ? 'text-red-300' : 'text-gold'}`}>
          {cancelled ? 'Payment cancelled' : 'Payment submitted'}
        </p>
        <h1 className="font-display text-4xl text-cream mb-4">
          {cancelled ? 'Your payment was cancelled' : 'Thank you for your order'}
        </h1>
        <p className="text-cream/50 text-sm leading-6">
          {cancelled
            ? 'No payment was completed. You can return to your orders and try PayHere again.'
            : 'PayHere sends the final payment status to Lumera securely. Check your order status below.'}
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            to={orderId ? `/orders` : '/products'}
            className="bg-gold text-ink px-7 py-3 uppercase text-xs tracking-widest"
          >
            {orderId ? 'View my orders' : 'Continue shopping'}
          </Link>
          <Link
            to="/products"
            className="border border-white/20 text-cream px-7 py-3 uppercase text-xs tracking-widest"
          >
            Shop fragrances
          </Link>
        </div>
      </div>
    </div>
  )
}
