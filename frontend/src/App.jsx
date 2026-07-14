import { Routes, Route } from 'react-router-dom'

import Navbar from './components/customer/Navbar'
import Footer from './components/customer/Footer'
import ProtectedRoute from './components/customer/ProtectedRoute'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'

import Home from './pages/customer/Home'
import About from './pages/customer/About'
import Products from './pages/customer/Products'
import ProductDetail from './pages/customer/ProductDetail'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import Payment from './pages/customer/Payment'
import Login from './pages/customer/Login'
import Register from './pages/customer/Register'
import Profile from './pages/customer/Profile'
import Orders from './pages/customer/Orders'
import Feedback from './pages/customer/Feedback'
import Contact from './pages/customer/Contact'

import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ProductsManage from './pages/admin/ProductsManage'
import OrdersManage from './pages/admin/OrdersManage'
import FeedbackManage from './pages/admin/FeedbackManage'
import UsersManage from './pages/admin/UsersManage'

function CustomerLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Admin routes — Bootstrap-driven console, no shared Navbar/Footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
      <Route path="/admin/products" element={<AdminProtectedRoute><ProductsManage /></AdminProtectedRoute>} />
      <Route path="/admin/orders" element={<AdminProtectedRoute><OrdersManage /></AdminProtectedRoute>} />
      <Route path="/admin/feedback" element={<AdminProtectedRoute><FeedbackManage /></AdminProtectedRoute>} />
      <Route path="/admin/users" element={<AdminProtectedRoute><UsersManage /></AdminProtectedRoute>} />

      {/* Customer-facing storefront — Tailwind-driven */}
      <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
      <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
      <Route path="/products/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
      <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/checkout" element={<CustomerLayout><ProtectedRoute><Checkout /></ProtectedRoute></CustomerLayout>} />
      <Route path="/payment/:orderId" element={<CustomerLayout><ProtectedRoute><Payment /></ProtectedRoute></CustomerLayout>} />
      <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
      <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
      <Route path="/profile" element={<CustomerLayout><ProtectedRoute><Profile /></ProtectedRoute></CustomerLayout>} />
      <Route path="/orders" element={<CustomerLayout><ProtectedRoute><Orders /></ProtectedRoute></CustomerLayout>} />
      <Route path="/feedback" element={<CustomerLayout><Feedback /></CustomerLayout>} />
      <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
    </Routes>
  )
}
