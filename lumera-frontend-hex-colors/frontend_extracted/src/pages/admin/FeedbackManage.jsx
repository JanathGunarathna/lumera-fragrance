import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import AdminLayout from '../../components/admin/AdminLayout'

export default function FeedbackManage() {
  const [feedback, setFeedback] = useState([])

  const load = () => api.get('/admin/feedback').then(res => setFeedback(res.data))
  useEffect(() => { load() }, [])

  const toggleApprove = async (id, approved) => {
    await api.patch(`/admin/feedback/${id}/approve?approved=${!approved}`)
    toast.success(!approved ? 'Feedback approved' : 'Feedback hidden')
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this feedback permanently?')) return
    await api.delete(`/admin/feedback/${id}`)
    toast.info('Feedback deleted')
    load()
  }

  return (
    <AdminLayout>
      <h2 className="mb-4">Customer Feedback</h2>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>Customer</th><th>Product</th><th>Rating</th><th>Comment</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {feedback.map(f => (
                <tr key={f.id}>
                  <td>{f.user?.fullName}</td>
                  <td>{f.product?.name || <span className="text-muted">General</span>}</td>
                  <td className="text-warning">{'★'.repeat(f.rating)}</td>
                  <td style={{ maxWidth: 320 }}>{f.comment}</td>
                  <td><span className={`badge ${f.approved ? 'bg-success' : 'bg-secondary'}`}>{f.approved ? 'Visible' : 'Hidden'}</span></td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => toggleApprove(f.id, f.approved)}>
                      {f.approved ? 'Hide' : 'Approve'}
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
