import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axiosConfig'
import ProductCard from '../../components/customer/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products').then(res => setProducts(res.data.slice(0, 4)))
  }, [])

  return (
    <div>
      {/* Hero — the flower is the thesis */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase text-xs tracking-widest2 text-gold/80 mb-6">The Night-Blooming Collection</p>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-cream">
              A flower that <span className="text-gold italic">blooms once,</span> a scent that lasts.
            </h1>
            <p className="mt-6 text-cream/60 max-w-md leading-relaxed">
              Lumera fragrances are composed around the cereus blossom — opening only under moonlight,
              gone by dawn. We bottle that fleeting hour.
            </p>
            <div className="mt-10 flex gap-4">
              <Link to="/products" className="bg-gold text-ink px-8 py-3 uppercase text-xs tracking-widest hover:bg-gold-light transition-colors">
                Shop Fragrances
              </Link>
              <Link to="/about" className="border border-cream/30 text-cream px-8 py-3 uppercase text-xs tracking-widest hover:border-gold hover:text-gold transition-colors">
                Our Story
              </Link>
            </div>
          </div>

          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gold/5 blur-3xl" aria-hidden="true" />
            <div className="relative w-full h-full border border-gold/20 rounded-full flex items-center justify-center">
              <span className="font-display text-[10rem] md:text-[13rem] text-gold leading-none select-none">L</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-2">Featured</p>
            <h2 className="font-display text-4xl text-cream">This Season's Bottles</h2>
          </div>
          <Link to="/products" className="bloom-underline text-sm text-cream/70 hover:text-gold hidden md:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Signature strip */}
      <section className="border-y border-white/10 bg-panel">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="font-display text-2xl text-gold mb-2">Hand-Blended</h3>
            <p className="text-cream/60 text-sm">Every batch composed in small runs, never mass-produced.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-gold mb-2">Cruelty-Free</h3>
            <p className="text-cream/60 text-sm">No animal testing, ever — certified across our full range.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl text-gold mb-2">Free Shipping</h3>
            <p className="text-cream/60 text-sm">Complimentary delivery on every order over $75.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
