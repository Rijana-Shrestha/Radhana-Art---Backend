import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

const Products = () => {
  const { addToCart } = useCart()
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wooden Photo Frame',
      price: 500,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=400&auto=format&fit=crop',
      rating: 5,
      reviews: 128,
      category: 'Personalized Gifts',
    },
    {
      id: 2,
      name: 'Personalized Keyring',
      price: 300,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop',
      rating: 4.8,
      reviews: 95,
      category: 'Personalized Gifts',
    },
    {
      id: 3,
      name: 'Custom Engraved Mug',
      price: 400,
      image: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?q=80&w=400&auto=format&fit=crop',
      rating: 4.9,
      reviews: 156,
      category: 'Personalized Gifts',
    },
    {
      id: 4,
      name: 'Wall Clock',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=400&auto=format&fit=crop',
      rating: 4.7,
      reviews: 67,
      category: 'Home Decor',
    },
    {
      id: 5,
      name: 'LED Neon Light',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1530268729831-4b51a03848b7?q=80&w=400&auto=format&fit=crop',
      rating: 5,
      reviews: 89,
      category: 'Home Decor',
    },
    {
      id: 6,
      name: 'Wooden QR Code Stand',
      price: 800,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f9?q=80&w=400&auto=format&fit=crop',
      rating: 4.9,
      reviews: 112,
      category: 'Corporate Gifting',
    },
  ])

  const [filteredProducts, setFilteredProducts] = useState(products)
  const [sortBy, setSortBy] = useState('popular')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    let result = products

    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter)
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(result)
  }, [sortBy, categoryFilter])

  return (
    <main>
      <section className='bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Our Products</h1>
          <p className='text-gray-600'>Explore our collection of beautifully laser-engraved items</p>
        </div>
      </section>

      <section className='py-12 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto'>
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='lg:w-72'>
              <div className='sticky top-20'>
                <div className='mb-8 bg-gray-50 p-5 rounded-xl'>
                  <h3 className='font-bold text-gray-800 mb-4'>Categories</h3>
                  <div className='space-y-2'>
                    {['All', 'Personalized Gifts', 'Home Decor', 'Corporate Gifting'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                          categoryFilter === cat ? 'bg-blue-600 text-white font-medium' : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='flex-1'>
              <div className='flex justify-between items-center mb-8 pb-4 border-b border-gray-200'>
                <p className='text-gray-600'>
                  Showing <span className='font-bold'>{filteredProducts.length}</span> products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border-2 border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-600'
                >
                  <option value='popular'>Most Popular</option>
                  <option value='rating'>Highest Rated</option>
                  <option value='price-low'>Price: Low to High</option>
                  <option value='price-high'>Price: High to Low</option>
                </select>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredProducts.map((product) => (
                  <div key={product.id} className='bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group'>
                    <div className='relative overflow-hidden bg-gray-100 h-48'>
                      <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-full object-cover group-hover:scale-110 transition duration-500'
                      />
                      <div className='absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold'>Popular</div>
                    </div>
                    <div className='p-4'>
                      <p className='text-xs text-blue-600 font-semibold mb-1'>{product.category}</p>
                      <h3 className='font-bold text-gray-800 mb-2 line-clamp-2'>{product.name}</h3>

                      <div className='flex items-center gap-1 mb-3'>
                        <div className='flex gap-0.5'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className='text-xs text-gray-600 ml-1'>
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <span className='text-2xl font-bold text-red-600'>Rs. {product.price}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2'
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-12 px-6 md:px-8 lg:px-12 bg-blue-50'>
        <div className='container mx-auto text-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-3'>Don't Find What You're Looking For?</h2>
          <p className='text-gray-600 mb-6 max-w-2xl mx-auto'>We can create custom designs for any product. Get in touch for a personalized quote!</p>
          <Link to='/contact' className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition'>
            Request Custom Design
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Products