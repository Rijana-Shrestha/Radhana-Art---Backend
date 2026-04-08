import React, { useState } from 'react'
import { Maximize, X } from 'lucide-react'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState('All')

  const galleryItems = [
    { id: 1, image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=500&auto=format&fit=crop', 'category': 'Photo Frame', title: 'Wooden Photo Frame' },
    { id: 2, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500&auto=format&fit=crop', 'category': 'Keyring', title: 'Custom Keyring' },
    { id: 3, image: 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?q=80&w=500&auto=format&fit=crop', 'category': 'Mug', title: 'Engraved Mug' },
    { id: 4, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=500&auto=format&fit=crop', 'category': 'Clock', title: 'Wall Clock' },
    { id: 5, image: 'https://images.unsplash.com/photo-1530268729831-4b51a03848b7?q=80&w=500&auto=format&fit=crop', 'category': 'Lighting', title: 'Neon Light' },
    { id: 6, image: 'https://images.unsplash.com/photo-1516321318423-f06f70a504f9?q=80&w=500&auto=format&fit=crop', 'category': 'QR Code', title: 'Wooden QR Code' },
  ]

  const filteredItems = filter === 'All' ? galleryItems : galleryItems.filter((item) => item['category'] === filter)

  return (
    <main>
      <section className='bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Gallery</h1>
          <p className='text-gray-600'>Browse our collection of beautifully crafted works</p>
        </div>
      </section>

      <section className='py-8 px-6 md:px-8 lg:px-12 bg-white border-b border-gray-200'>
        <div className='container mx-auto'>
          <div className='flex flex-wrap gap-3 justify-center'>
            {['All', 'Photo Frame', 'Keyring', 'Mug', 'Clock', 'Lighting', 'QR Code'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  filter === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className='py-12 px-6 md:px-8 lg:px-12 bg-gray-50'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max'>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className='group cursor-pointer rounded-lg overflow-hidden bg-white hover:shadow-xl transition transform hover:-translate-y-1'
              >
                <div className='relative overflow-hidden h-64 bg-gray-200'>
                  <img
                    src={item.image}
                    alt={item.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition duration-500'
                  />
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center'>
                    <button className='opacity-0 group-hover:opacity-100 bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center transition'>
                      <Maximize size={20} />
                    </button>
                  </div>
                </div>
                <div className='p-4'>
                  <p className='text-xs text-blue-600 font-semibold mb-1'>{item['category']}</p>
                  <h3 className='font-bold text-gray-800'>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4' onClick={() => setSelectedImage(null)}>
          <button
            onClick={() => setSelectedImage(null)}
            className='absolute top-5 right-5 text-white w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition'
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage.image}
            alt={selectedImage.title}
            className='max-w-full max-h-[90vh] rounded-xl object-contain'
            onClick={(e) => e.stopPropagation()}
          />
          <div className='absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md rounded-lg px-6 py-3 text-white text-center'>
            <p className='font-bold'>{selectedImage.title}</p>
            <p className='text-sm opacity-90'>{selectedImage['category']}</p>
          </div>
        </div>
      )}

      <section className='py-12 px-6 md:px-8 lg:px-12 bg-gradient-to-r from-blue-600 to-red-600 text-white'>
        <div className='container mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            <div>
              <p className='text-4xl font-bold mb-2'>500+</p>
              <p className='text-white/90'>Products Created</p>
            </div>
            <div>
              <p className='text-4xl font-bold mb-2'>5000+</p>
              <p className='text-white/90'>Happy Customers</p>
            </div>
            <div>
              <p className='text-4xl font-bold mb-2'>4.9★</p>
              <p className='text-white/90'>Average Rating</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Gallery