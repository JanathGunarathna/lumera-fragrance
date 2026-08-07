import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axiosConfig'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return }
    setLoading(true)
    try {
      const res = await api.get('/cart')
      setItems(res.data)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => { refresh() }, [refresh])

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart', { productId, quantity })
    await refresh()
  }

  const updateQuantity = async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}`, { quantity })
    await refresh()
  }

  const removeFromCart = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`)
    await refresh()
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = items.reduce((sum, i) => {
    const price = i.product.discountPrice ?? i.product.price
    return sum + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{ items, loading, refresh, addToCart, updateQuantity, removeFromCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
