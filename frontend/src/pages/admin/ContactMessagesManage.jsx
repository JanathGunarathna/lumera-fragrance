import { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import AdminLayout from '../../components/admin/AdminLayout'

export default function ContactMessagesManage() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/admin/contact-messages')
      .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Unable to load customer messages.'))
  }, [])

  return (
    <AdminLayout>
      <h2 className="mb-4">Customer Messages</h2>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="card shadow-sm"><div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light"><tr><th>From</th><th>Message</th><th>Received</th></tr></thead>
          <tbody>{messages.length === 0 ? (
            <tr><td colSpan={3} className="text-center text-muted py-4">No customer messages yet.</td></tr>
          ) : messages.map(message => (
            <tr key={message.id}>
              <td><strong>{message.name}</strong><span className="d-block text-muted small">{message.email}</span></td>
              <td className="text-break" style={{ minWidth: 260 }}>{message.message}</td>
              <td className="text-muted small">{message.createdAt ? new Date(message.createdAt).toLocaleString() : '—'}</td>
            </tr>
          ))}</tbody>
        </table>
      </div></div>
    </AdminLayout>
  )
}
