import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../api/axiosConfig'
import ProductCard from '../../components/customer/ProductCard'
import Reveal from '../../components/common/Reveal'

const categories = ['All', 'Eau de Parfum', 'Eau de Toilette']
const genders = ['All', 'Women', 'Men', 'Unisex']

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [gender, setGender] = useState('All')
  const [search, setSearch] = useState('')

  const category = params.get('category') || 'All'

  useEffect(() => {
    setLoading(true)
    const query = {}
    if (category !== 'All') query.category = category
    if (search) query.q = search
    api.get('/products', { params: query })
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }, [category, search])

  const filtered = gender === 'All' ? products : products.filter(p => p.gender === gender)

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <Reveal className="mb-12">
        <p className="uppercase text-xs tracking-widest2 text-gold mb-2">Shop</p>
        <h1 className="font-display text-5xl text-cream">All Fragrances</h1>
      </Reveal>

      <Reveal delay={0.08} className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-10">
        <div className="flex flex-wrap gap-3">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setParams(c === 'All' ? {} : { category: c })}
              className={`relative px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${category === c ? 'text-ink border-gold' : 'border-white/20 text-cream/90 hover:border-gold hover:text-gold'}`}
            >
              {category === c && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 bg-gold -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="bg-panel border border-white/20 text-cream/90 text-sm px-3 py-2 focus:border-gold outline-none transition-colors"
          >
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <input
            type="search"
            placeholder="Search fragrances..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-panel border border-white/20 text-cream/90 text-sm px-3 py-2 w-56 focus:border-gold outline-none transition-colors"
          />
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted"
          >
            Loading fragrances…
          </motion.p>
        ) : filtered.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-muted"
          >
            No fragrances match your filters yet. Try a different category.
          </motion.p>
        ) : (
          <motion.div
            key={`${category}-${gender}-${search}`}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {filtered.map(p => (
              <motion.div
                key={p.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
