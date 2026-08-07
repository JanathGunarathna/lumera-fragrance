import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import AdminLayout from '../../components/admin/AdminLayout'

const emptyForm = { name: '', brand: 'Lumera', category: 'Eau de Parfum', gender: 'Unisex', description: '', price: '', discountPrice: '', stock: '', imageUrl: '', volume: '50ml', active: true }

export default function ProductsManage() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = () => api.get('/admin/products').then(res => setProducts(res.data))
  useEffect(() => { load() }, [])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (p) => { setForm({ ...p, price: p.price, discountPrice: p.discountPrice || '' }); setEditingId(p.id); setShowForm(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock) || 0,
    }
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, payload)
        toast.success('Product updated')
      } else {
        await api.post('/admin/products', payload)
        toast.success('Product created')
      }
      setShowForm(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save product')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this product? It will be hidden from the store.')) return
    await api.delete(`/admin/products/${id}`)
    toast.info('Product deactivated')
    load()
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Products</h2>
        <button className="btn btn-dark" onClick={openNew}><i className="bi bi-plus-lg me-1"></i>Add Product</button>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>${p.discountPrice || p.price}</td>
                  <td>{p.stock}</td>
                  <td><span className={`badge ${p.active ? 'bg-success' : 'bg-secondary'}`}>{p.active ? 'Active' : 'Inactive'}</span></td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openEdit(p)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Deactivate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowForm(false)}>
          <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">{editingId ? 'Edit Product' : 'New Product'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label small">Name</label>
                    <input required className="form-control" value={form.name} onChange={update('name')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Brand</label>
                    <input className="form-control" value={form.brand} onChange={update('brand')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Category</label>
                    <select className="form-select" value={form.category} onChange={update('category')}>
                      <option>Eau de Parfum</option>
                      <option>Eau de Toilette</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Gender</label>
                    <select className="form-select" value={form.gender} onChange={update('gender')}>
                      <option>Women</option><option>Men</option><option>Unisex</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Volume</label>
                    <input className="form-control" value={form.volume} onChange={update('volume')} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Description</label>
                    <textarea className="form-control" rows={3} value={form.description} onChange={update('description')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Price ($)</label>
                    <input required type="number" step="0.01" className="form-control" value={form.price} onChange={update('price')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Discount Price ($)</label>
                    <input type="number" step="0.01" className="form-control" value={form.discountPrice} onChange={update('discountPrice')} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small">Stock</label>
                    <input required type="number" className="form-control" value={form.stock} onChange={update('stock')} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Image URL</label>
                    <input className="form-control" value={form.imageUrl} onChange={update('imageUrl')} placeholder="https://..." />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-dark">{editingId ? 'Save Changes' : 'Create Product'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
