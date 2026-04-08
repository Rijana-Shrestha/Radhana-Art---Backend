import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Wallet, CreditCard, Phone, Building, Lock, MessageCircle } from 'lucide-react'

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'esewa',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Order placed:', formData)
    setOrderPlaced(true)
  }

  if (orderPlaced) {
    return (
      <main>
        <section className='min-h-[calc(100vh-200px)] flex items-center justify-center px-6 md:px-8 lg:px-12 py-12 bg-gradient-to-br from-green-50 to-blue-50'>
          <div className='w-full max-w-md text-center'>
            <div className='inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6'>
              <Check size={60} className='text-green-600' />
            </div>
            <h1 className='text-3xl font-bold text-gray-800 mb-3'>Order Confirmed!</h1>
            <p className='text-gray-600 mb-2'>Thank you for your purchase</p>
            <p className='text-gray-500 text-sm mb-8'>
              We've sent a confirmation email to <span className='font-bold'>{formData.email}</span>
            </p>

            <div className='bg-white rounded-lg p-6 mb-6 border-2 border-green-200'>
              <p className='text-sm text-gray-600 mb-2'>Order #</p>
              <p className='text-2xl font-bold text-gray-800 font-mono'>RAD-' 2024-{Math.floor(Math.random() * 10000)}</p>
            </div>

            <p className='text-gray-600 mb-8'>We'll send you tracking details on WhatsApp shortly</p>

            <div className='space-y-3'>
              <Link to='/' className='w-full inline-block bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700'>
                Back to Home
              </Link>
              <a href='https://wa.me/9779823939106' className='w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700'>
                <MessageCircle size={18} />
                Chat with Us
              </a>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className='bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Checkout</h1>
          <p className='text-gray-600'>Complete your purchase</p>
        </div>
      </section>

      <section className='py-12 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto max-w-5xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* FORM */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-8'>Shipping Information</h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>First Name</label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>Last Name</label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-800 mb-2'>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-800 mb-2'>Phone</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                </div>

                <div>
                  <label className='block text-sm font-bold text-gray-800 mb-2'>Address</label>
                  <input
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>City</label>
                    <input
                      type='text'
                      name='city'
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-bold text-gray-800 mb-2'>Postal Code</label>
                    <input
                      type='text'
                      name='postalCode'
                      value={formData.postalCode}
                      onChange={handleChange}
                      className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                    />
                  </div>
                </div>

                <div className='mt-8 pt-8 border-t border-gray-200'>
                  <h3 className='text-lg font-bold text-gray-800 mb-4'>Payment Method</h3>

                  <div className='space-y-3'>
                    {[
                      { id: 'esewa', name: 'eSewa', icon: Wallet },
                      { id: 'khalti', name: 'Khalti', icon: CreditCard },
                      { id: 'fonepay', name: 'FonePay', icon: Phone },
                      { id: 'bank', name: 'Bank Transfer', icon: Building },
                    ].map((method) => {
                      const IconComponent = method.icon
                      return (
                        <label key={method.id} className='flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50'>
                          <input
                            type='radio'
                            name='paymentMethod'
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={handleChange}
                            className='w-4 h-4'
                          />
                          <IconComponent size={20} className='text-blue-600' />
                          <span className='font-medium text-gray-800'>{method.name}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition text-lg mt-8 flex items-center justify-center gap-2'
                >
                  <Lock size={20} />
                  Place Order - Rs. 1,300
                </button>
              </form>
            </div>

            {/* ORDER SUMMARY */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-8'>Order Summary</h2>

              <div className='bg-gray-50 rounded-lg p-6 sticky top-20 h-fit'>
                <div className='space-y-4 mb-6 pb-6 border-b border-gray-200'>
                  <div className='flex items-center gap-4'>
                    <img src='https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=100&auto=format&fit=crop' className='w-16 h-16 object-cover rounded' />
                    <div className='flex-1'>
                      <p className='font-bold text-gray-800'>Wooden Photo Frame</p>
                      <p className='text-sm text-gray-600'>Qty: 2</p>
                    </div>
                    <p className='font-bold'>Rs. 1,000</p>
                  </div>

                  <div className='flex items-center gap-4'>
                    <img src='https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=100&auto=format&fit=crop' className='w-16 h-16 object-cover rounded' />
                    <div className='flex-1'>
                      <p className='font-bold text-gray-800'>Custom Keyring</p>
                      <p className='text-sm text-gray-600'>Qty: 1</p>
                    </div>
                    <p className='font-bold'>Rs. 300</p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-bold'>Rs. 1,300</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Delivery</span>
                    <span className='text-green-600 font-bold'>FREE</span>
                  </div>
                  <div className='flex justify-between text-lg font-bold pt-3 border-t border-gray-300'>
                    <span>Total</span>
                    <span className='text-blue-600'>Rs. 1,300</span>
                  </div>
                </div>

                <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
                  <p className='text-xs text-blue-600 font-medium mb-2 flex items-center gap-2'>
                    <Lock size={14} /> Your payment is secure
                  </p>
                  <p className='text-xs text-blue-600'>This connection is encrypted with SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Checkout
