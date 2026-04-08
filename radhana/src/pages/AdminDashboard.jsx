import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)

  return (
    <main className='flex-1 min-h-[calc(100vh-200px)]'>
      <div className='container mx-auto px-6 py-12'>
        <div className='bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-purple-200'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Admin Dashboard</h1>
          <p className='text-gray-600 mb-8'>Welcome, {user?.name}!</p>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Users Management */}
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-blue-600 hover:shadow-lg transition'>
              <h2 className='text-xl font-bold text-gray-800 mb-2'>👥 Users</h2>
              <p className='text-gray-600 text-sm mb-4'>Manage user accounts and permissions</p>
              <button className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
                Manage Users
              </button>
            </div>

            {/* Products Management */}
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-green-600 hover:shadow-lg transition'>
              <h2 className='text-xl font-bold text-gray-800 mb-2'>📦 Products</h2>
              <p className='text-gray-600 text-sm mb-4'>Add, edit, or remove products</p>
              <button className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition'>
                Manage Products
              </button>
            </div>

            {/* Orders Management */}
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-orange-600 hover:shadow-lg transition'>
              <h2 className='text-xl font-bold text-gray-800 mb-2'>📋 Orders</h2>
              <p className='text-gray-600 text-sm mb-4'>View and manage customer orders</p>
              <button className='w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition'>
                View Orders
              </button>
            </div>

            {/* Gallery Management */}
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-pink-600 hover:shadow-lg transition'>
              <h2 className='text-xl font-bold text-gray-800 mb-2'>🖼️ Gallery</h2>
              <p className='text-gray-600 text-sm mb-4'>Manage gallery images and albums</p>
              <button className='w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition'>
                Manage Gallery
              </button>
            </div>

            {/* Analytics */}
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-purple-600 hover:shadow-lg transition'>
              <h2 className='text-xl font-bold text-gray-800 mb-2'>📊 Analytics</h2>
              <p className='text-gray-600 text-sm mb-4'>View sales and user statistics</p>
              <button className='w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition'>
                View Analytics
              </button>
            </div>

            {/* Settings */}
            <div className='bg-white rounded-lg shadow p-6 border-l-4 border-red-600 hover:shadow-lg transition'>
              <h2 className='text-xl font-bold text-gray-800 mb-2'>⚙️ Settings</h2>
              <p className='text-gray-600 text-sm mb-4'>Configure system settings</p>
              <button className='w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition'>
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdminDashboard
