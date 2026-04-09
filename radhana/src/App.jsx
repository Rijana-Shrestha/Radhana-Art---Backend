import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedAuthRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import AdminHomeGuard from './components/AdminHomeGuard'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import Products from './pages/Products'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import AdminDashboard from './pages/AdminDashboard'
import Footer from './components/Footer'
import { AdminProvider } from './context/AdminContext'

const App = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin-dashboard'

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <NavBar />}
        <Routes>
          <Route path="/" element={<AdminHomeGuard><Home /></AdminHomeGuard>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<ProtectedAuthRoute><Login /></ProtectedAuthRoute>} />
          <Route path="/register" element={<ProtectedAuthRoute><Register /></ProtectedAuthRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminProvider><AdminDashboard /></AdminProvider></ProtectedAdminRoute>} />
        </Routes>
        {!isAuthPage && <Footer />}
    </div>
  )
}

export default App