import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api/axiosConfig'
import ProductCard from '../../components/customer/ProductCard'

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
      <div className="mb-12">
        <p className="uppercase text-xs tracking-widest2 text-gold/70 mb-2">Shop</p>
        <h1 className="font-display text-5xl text-cream">All Fragrances</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-10">
        <div className="flex flex-wrap gap-3">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setParams(c === 'All' ? {} : { category: c })}
              className={`px-4 py-2 text-xs uppercase tracking-widest border ${category === c ? 'bg-gold text-ink border-gold' : 'border-white/20 text-cream/70 hover:border-gold hover:text-gold'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="bg-panel border border-white/20 text-cream/80 text-sm px-3 py-2"
          >
            {genders.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <input
            type="search"
            placeholder="Search fragrances..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-panel border border-white/20 text-cream/80 text-sm px-3 py-2 w-56"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-cream/50">Loading fragrances…</p>
      ) : filtered.length === 0 ? (
        <p className="text-cream/50">No fragrances match your filters yet. Try a different category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
