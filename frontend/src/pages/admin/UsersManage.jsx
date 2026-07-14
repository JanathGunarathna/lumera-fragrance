import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../../api/axiosConfig'
import AdminLayout from '../../components/admin/AdminLayout'

export default function UsersManage() {
  const [users, setUsers] = useState([])

  const load = () => api.get('/admin/users').then(res => setUsers(res.data))
  useEffect(() => { load() }, [])

  const toggleStatus = async (id, enabled) => {
    await api.patch(`/admin/users/${id}/status`, { enabled: !enabled })
    toast.success(!enabled ? 'Customer re-enabled' : 'Customer suspended')
    load()
  }

  return (
    <AdminLayout>
      <h2 className="mb-4">Customers</h2>
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td><span className="badge bg-light text-dark border">{u.role.replace('ROLE_', '')}</span></td>
                  <td><span className={`badge ${u.enabled ? 'bg-success' : 'bg-danger'}`}>{u.enabled ? 'Active' : 'Suspended'}</span></td>
                  <td className="text-end">
                    {u.role !== 'ROLE_ADMIN' && (
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleStatus(u.id, u.enabled)}>
                        {u.enabled ? 'Suspend' : 'Reactivate'}
                      </button>
                    )}
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
