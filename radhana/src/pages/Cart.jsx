import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Lock, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart()

  const handleQuantityChange = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id)
    } else {
      updateQuantity(id, newQty - cartItems.find(item => item.id === id).qty)
    }
  }
  const removeItem = (id) => {
    removeFromCart(id)
  }

  const subtotal = getCartTotal()
  const tax = Math.round(subtotal * 0.13)
  const total = subtotal + tax

  return (
    <main>
      {/* PAGE HEADER */}
      <section className='bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Shopping Cart</h1>
          <p className='text-gray-600'>Review and manage your items</p>
        </div>
      </section>

      {/* CART CONTENT */}
      <section className='py-12 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto'>
          {cartItems.length === 0 ? (
            <div className='text-center py-20'>
              <div className='flex justify-center mb-4'>
                <ShoppingCart size={80} className='text-gray-300' />
              </div>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>Your cart is empty</h2>
              <p className='text-gray-600 mb-6'>Add some items to get started!</p>
              <Link to='/products' className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700'>
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* ITEMS */}
              <div className='lg:col-span-2'>
                <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                  {cartItems.map((item) => (
                    <div key={item.id} className='flex items-center gap-6 p-6 border-b border-gray-200 hover:bg-gray-50'>
                      <img src={item.image} alt={item.name} className='w-24 h-24 object-cover rounded-lg' />

                      <div className='flex-1'>
                        <h3 className='font-bold text-gray-800 mb-1'>{item.name}</h3>
                        <p className='text-blue-600 font-bold'>Rs. {item.price.toLocaleString()}</p>
                      </div>

                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                          className='w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type='number'
                          value={item.qty}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className='w-12 border border-gray-300 rounded text-center py-1'
                          min='1'
                        />
                        <button
                          onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                          className='w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100'
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className='font-bold text-gray-800 w-24 text-right'>Rs. {(item.price * item.qty).toLocaleString()}</p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className='text-red-600 hover:text-red-700 w-8 h-8 flex items-center justify-center hover:bg-red-50 rounded'
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <Link to='/products' className='inline-flex items-center gap-2 mt-6 text-blue-600 font-bold hover:underline'>
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>

              {/* ORDER SUMMARY */}
              <div className='lg:col-span-1'>
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 sticky top-20 h-fit'>
                  <h3 className='font-bold text-gray-800 mb-6 text-lg'>Order Summary</h3>

                  <div className='space-y-3 mb-6 pb-6 border-b border-gray-300'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Subtotal</span>
                      <span className='font-bold'>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Tax (13%)</span>
                      <span className='font-bold'>Rs. {tax.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Delivery</span>
                      <span className='font-bold text-green-600'>FREE</span>
                    </div>
                  </div>

                  <div className='flex justify-between text-lg font-bold mb-6 pb-6 border-b border-gray-300'>
                    <span>Total</span>
                    <span className='text-blue-600'>Rs. {total.toLocaleString()}</span>
                  </div>

                  <Link to='/checkout' className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 mb-3'>
                    <Lock size={18} />
                    Proceed to Checkout
                  </Link>

                  <button className='w-full border-2 border-gray-300 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-100'>
                    Continue Shopping
                  </button>

                  {/* Support */}
                  <div className='mt-6 pt-6 border-t border-gray-300'>
                    <p className='text-sm text-gray-600 mb-3'>Need help?</p>
                    <a href='https://wa.me/9779823939106' className='inline-flex items-center gap-2 text-green-600 font-medium hover:underline'>
                      <MessageCircle size={18} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Cart
