import { createContext, useContext, useState } from 'react'
import api from '../api/axiosConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('lumera_user')
    return raw ? JSON.parse(raw) : null
  })

  const persist = (data) => {
    localStorage.setItem('lumera_token', data.token)
    localStorage.setItem('lumera_user', JSON.stringify(data))
    setUser(data)
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    persist(res.data)
    return res.data
  }

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload)
    persist(res.data)
    return res.data
  }

  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/admin/login', { email, password })
    persist(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('lumera_token')
    localStorage.removeItem('lumera_user')
    setUser(null)
  }

  const isAdmin = user?.role === 'ROLE_ADMIN'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, login, register, adminLogin, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
