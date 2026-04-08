import { ShoppingCart, User, LogOut } from 'lucide-react'
import React, { useState } from 'react'
import { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CartContext, CartProvider } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

const NavBar = () => {
  const {getCartTotal, getCartCount}= useContext(CartContext)
  const { user, isLoggedIn, logout, loading } = useContext(AuthContext)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path) => location.pathname === path

  return (
    <div className='w-full'>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee {
          animation: marquee 50s linear infinite;
          white-space: nowrap;
        }
      `}</style>



      {/* Top Banner - Marquee */}
      <div className='bg-yellow-400 text-sm py-2 px-4 overflow-hidden'>
        <p className='marquee'>
          🛍️ Premium Products | 🎁 Perfect Gifts | 📞 +977 9823939106 | 🚚 Fast Delivery Kathmandu | 💳 eSewa - Khalti - FonePay Accepted | ⚡ Premium Laser Engraving | 🎨 Custom Wooden & Acrylic Products
        </p>
      </div>

      {/* Main Navbar */}
      <div className='flex items-center justify-between px-6 py-4 bg-white shadow-md'>
        {/* Logo Section */}
        <Link to="/" className='flex items-center gap-3 flex-shrink-0'>
          <div className='bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-xl p-3 font-bold text-xl w-12 h-12 flex items-center justify-center'>
            RA
          </div>
          <div className='flex flex-col'>
            <h1 className='font-bold text-lg text-gray-800'>Radhana Art</h1>
            <p className='text-xs text-gray-600'>Laser Engraving - Kathmandu</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div className='flex-1 mx-8'>
          <div className='flex gap-2 bg-[#F9FAFB] p-1 rounded-xl border-2 border-gray-300 focus-within:border-blue-600 focus-within:bg-blue-50'>
            <input
              type='text'
              placeholder='Search products, categories...'
              className='flex-1 px-4 py-2 bg-transparent rounded-lg focus:outline-none text-gray-700'
            />
            <button className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold'>
              Search
            </button>
          </div>
        </div>

        {/* Right Icons */}
        <div className='flex items-center gap-4 ml-4'>
          {/* Profile Icon / User Menu */}
          {loading ? (
            // Loading skeleton while fetching user data
            <div className='flex items-center gap-2 bg-gray-300 rounded-full px-3 py-2 animate-pulse w-32 h-10'>
              <div className='w-6 h-6 bg-gray-400 rounded-full'></div>
              <div className='w-16 h-3 bg-gray-400 rounded'></div>
            </div>
          ) : isLoggedIn && user ? (
            <div className='relative'>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className='flex items-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full px-3 py-2 hover:from-blue-600 hover:to-blue-700 transition'
              >
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.name} className='w-6 h-6 rounded-full object-cover' />
                ) : (
                  <User size={20} />
                )}
                <span className='text-sm font-medium max-w-[80px] truncate'>{user.name}</span>
              </button>
              
              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50'>
                  <div className='px-4 py-2 border-b border-gray-200'>
                    <p className='text-sm font-bold text-gray-800'>{user.name}</p>
                    <p className='text-xs text-gray-600'>{user.email}</p>
                  </div>
                  <Link 
                    to='/profile' 
                    onClick={() => setShowProfileMenu(false)}
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50'
                  >
                    View Profile
                  </Link>
                  {user.roles && user.roles.includes('ADMIN') && (
                    <Link 
                      to='/admin-dashboard' 
                      onClick={() => setShowProfileMenu(false)}
                      className='block px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-semibold'
                    >
                      📊 Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => {
                      logout()
                      setShowProfileMenu(false)
                      navigate('/login')
                    }}
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2'
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : !loading && (
            <button onClick={() => navigate("/login")} className='text-gray-700 bg-gray-200 rounded-full p-1 text-2xl hover:text-blue-600'>
              <User size={24} />
            </button>
          )}

          {/* WhatsApp */}
          <a href='https://wa.me/9779823939106' target='_blank' rel='noopener noreferrer' className='text-green-600  font-semibold hover:text-green-700 '>
            +977-9823939106
          </a>

          {/* Cart Icon */}
          <div className='relative'>
            <button onClick={()=>navigate("/cart")} className='text-gray-700 text-2xl hover:text-blue-600'>
              <ShoppingCart size={24} />
            </button>
           {getCartCount()>0 &&  <span className='bg-red-600  absolute -top-3  left-3 rounded-full px-2 text-[15px] text-white'>
                {getCartCount()}
            </span>}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className='flex justify-center gap-8 px-6 py-3 bg-white border-b border-gray-200'>
        <Link
          to='/'
          className={`font-semibold transition-colors ${
            isActive('/') ? 'text-red-500 border-b-2 border-red-500 pb-2' : 'text-gray-700 hover:text-red-500'
          }`}
        >
          Home
        </Link>
        <Link
          to='/products'
          className={`font-semibold transition-colors ${
            isActive('/products') ? 'text-red-500 border-b-2 border-red-500 pb-2' : 'text-gray-700 hover:text-red-500'
          }`}
        >
          Products
        </Link>
        <Link
          to='/gallery'
          className={`font-semibold transition-colors ${
            isActive('/gallery') ? 'text-red-500 border-b-2 border-red-500 pb-2' : 'text-gray-700 hover:text-red-500'
          }`}
        >
          Gallery
        </Link>
        <Link
          to='/about'
          className={`font-semibold transition-colors ${
            isActive('/about') ? 'text-red-500 border-b-2 border-red-500 pb-2' : 'text-gray-700 hover:text-red-500'
          }`}
        >
          About Us
        </Link>
        <Link
          to='/faq'
          className={`font-semibold transition-colors ${
            isActive('/faq') ? 'text-red-500 border-b-2 border-red-500 pb-2' : 'text-gray-700 hover:text-red-500'
          }`}
        >
          FAQ
        </Link>
        <Link
          to='/contact'
          className={`font-semibold transition-colors ${
            isActive('/contact') ? 'text-red-500 border-b-2 border-red-500 pb-2' : 'text-gray-700 hover:text-red-500'
          }`}
        >
          Contact
        </Link>
      </div>
    </div>
  )
}

export default NavBar