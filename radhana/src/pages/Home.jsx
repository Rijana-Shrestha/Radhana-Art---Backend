import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Store, Mail, Check, Truck, Heart, Home as HomeIcon, Briefcase, Star, CheckCircle, Send, Phone, MapPin, Image, PencilRuler, CheckCheck, TruckElectric } from 'lucide-react'

const Home = () => {
  const [cartBadge] = useState(0)

  useEffect(() => {
    // Reveal animation on scroll
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('!opacity-100', '!transform-none')
        }
      },
      { threshold: 0.1 }
    )
    reveals.forEach((el) => observer.observe(el))
  }, [])

  return (
    <main>
      {/* HERO SECTION */}
      <section className='relative min-h-[88vh] flex items-center py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-slate-50 via-blue-50/40 to-pink-50/30 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none'></div>
        <div className='absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-3xl pointer-events-none'></div>

        <div className='container mx-auto'>
          <div className='flex flex-col lg:flex-row items-center lg:justify-between gap-12 lg:gap-16'>
            {/* LEFT - Content */}
            <div className='lg:w-1/2'>
              <div className='inline-flex items-center gap-2 bg-red-100 text-red-600 border border-red-200 rounded-full px-4 py-1.5 text-sm font-medium mb-5'>
                ✨ Divine Craftsmanship from Kathmandu
              </div>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-gray-800'>
                Laser Engraving &<br />
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-red-600'>
                  Customized Gifts
                </span>
              </h1>
              <p className='text-gray-500 text-[15px] md:text-[17px] mb-8 leading-relaxed max-w-lg'>
                Transform your memories into timeless art. From wooden QR codes to personalized photo engravings — each piece crafted with divine precision and love.
              </p>
              <div className='flex flex-col sm:flex-row gap-3 mb-9'>
                <Link to='/products' className='bg-blue-600 text-white px-7 py-3.5 rounded-xl text-center hover:bg-blue-700 font-medium flex items-center justify-center gap-2'>
                  <Store size={18} /> Explore Products
                </Link>
                <Link to='/contact' className='bg-red-600 text-white px-7 py-3.5 rounded-xl text-center hover:bg-red-700 font-medium flex items-center justify-center gap-2'>
                  <Mail size={18} /> Get Custom Quote
                </Link>
              </div>
              <div className='flex flex-wrap gap-3'>
                <div className='flex items-center gap-2 text-sm text-gray-600 bg-white/80 rounded-xl px-3 py-2 shadow-sm border border-gray-100'>
                  <div className='w-7 h-7 bg-green-100 rounded-lg font-[smthg] flex items-center justify-center'>
                    <Check size={14} className='text-green-600' />
                  </div>
                  Premium Quality
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-600 bg-white/80 rounded-xl px-3 py-2 shadow-sm border border-gray-100'>
                  <div className='w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center'>
                    <Truck size={14} className='text-blue-600' />
                  </div>
                  Fast Delivery
                </div>
              </div>
            </div>

            {/* RIGHT - Image */}
            <div className='lg:w-1/2'>
              <div className='relative'>
                <div className='rounded-2xl overflow-hidden shadow-2xl'>
                  <img
                    src='https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop'
                    className='w-full h-[380px] md:h-[460px] object-cover'
                    alt='Laser Engraved Products'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent'></div>
                </div>
                <div className='absolute -top-5 -left-5 bg-white rounded-2xl shadow-xl p-3.5 text-center border border-gray-100'>
                  <div className='text-2xl font-bold text-blue-600'>5K+</div>
                  <div className='text-xs text-gray-500 mt-0.5'>Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className='py-14 md:py-16 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto'>
          <div className='text-center mb-10 reveal'>
            <span className='text-red-600 text-sm font-semibold uppercase'>Browse By Category</span>
            <h2 className='text-2xl md:text-3xl lg:text-4xl mt-2 mb-2 text-gray-800 font-bold'>Shop Our Collections</h2>
            <p className='text-gray-400 text-[15px] max-w-lg mx-auto'>Find the perfect gift for every person, occasion, and budget</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
            {/* Personalized Gifts */}
            <Link to='/products' className='reveal rounded-2xl cursor-pointer h-64 md:h-72 relative overflow-hidden group'>
              <img
                src='https://images.unsplash.com/photo-1582269847642-87432658c952?q=80&w=800&auto=format&fit=crop'
                className='absolute inset-0 w-full h-full object-cover'
                alt='Personalized Gifts'
              />
              <div className='absolute inset-0 bg-black/40 group-hover:bg-black/30 transition'></div>
              <div className='absolute inset-0 flex flex-col justify-end p-5'>
                <div className='inline-flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 w-fit'>
                  <Heart size={10} fill='white' /> Best Seller
                </div>
                <h3 className='text-white text-xl font-bold mb-1'>Personalized Gifts</h3>
                <p className='text-white/80 text-xs mb-3'>Wooden engravings, keyrings, mugs & more</p>
              </div>
            </Link>

            {/* Home Decor */}
            <Link to='/products' className='reveal rounded-2xl cursor-pointer h-64 md:h-72 relative overflow-hidden group'>
              <img
                src='https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop'
                className='absolute inset-0 w-full h-full object-cover'
                alt='Home Decor'
              />
              <div className='absolute inset-0 bg-black/40 group-hover:bg-black/30 transition'></div>
              <div className='absolute inset-0 flex flex-col justify-end p-5'>
                <div className='inline-flex items-center gap-1.5 bg-blue-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 w-fit'>
                  <HomeIcon size={10} /> New Arrivals
                </div>
                <h3 className='text-white text-xl font-bold mb-1'>Home Decor</h3>
                <p className='text-white/80 text-xs mb-3'>Wall clocks, neon lights, fridge magnets & more</p>
              </div>
            </Link>

            {/* Corporate Gifting */}
            <Link to='/products' className='reveal rounded-2xl cursor-pointer h-64 md:h-72 relative overflow-hidden group'>
              <img
                src='https://images.unsplash.com/photo-1495121553079-4c61bcce1894?q=80&w=800&auto=format&fit=crop'
                className='absolute inset-0 w-full h-full object-cover'
                alt='Corporate Gifting'
              />
              <div className='absolute inset-0 bg-black/40 group-hover:bg-black/30 transition'></div>
              <div className='absolute inset-0 flex flex-col justify-end p-5'>
                <div className='inline-flex items-center gap-1.5 bg-amber-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 w-fit'>
                  <Briefcase size={10} /> Corporate
                </div>
                <h3 className='text-white text-xl font-bold mb-1'>Corporate Gifting</h3>
                <p className='text-white/80 text-xs mb-3'>Awards, trophies, QR codes, signboards & more</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className='py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-slate-50'>
        <div className='container mx-auto'>
          <div className='text-center mb-12 reveal'>
            <span className='text-red-600 text-sm font-semibold uppercase'>Simple Process</span>
            <h2 className='text-2xl md:text-3xl lg:text-4xl mt-2 mb-3 text-gray-800 font-bold'>How It Works</h2>
            <p className='text-gray-400 text-[15px] max-w-xl mx-auto'>
              Ordering your custom engraving is simple — you'll see a design preview before we ever craft it
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {[
              { icon: <Image />, title: 'Upload Your Photo', desc: 'Send us your image via WhatsApp or email after placing your order', num: '1' },
              { icon: <PencilRuler />, title: 'Design Preview', desc: 'We create and send your preview for approval — unlimited edits included', num: '2' },
              { icon: <CheckCheck />, title: 'You Approve', desc: 'Request changes freely until you\'re completely happy — no surprises', num: '3' },
              { icon: <TruckElectric />, title: 'Craft & Deliver', desc: 'We engrave with precision and deliver safely to your door in 2–3 days', num: '4' },
            ].map((item) => (
              <div key={item.num} className='reveal text-center group'>
                <div className='relative mb-5 inline-block'>
                  <div className='w-20 h-20 bg-white border-2 border-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:bg-blue-600 group-hover:border-blue-600 transition'>
                    {item.icon}
                  </div>
                  <div className='absolute -top-2 -right-2 w-7 h-7 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center shadow'>
                    {item.num}
                  </div>
                </div>
                <h3 className='text-gray-800 text-lg mb-2 font-bold'>{item.title}</h3>
                <p className='text-gray-400 text-sm leading-relaxed'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className='py-16 md:py-20 px-6 md:px-8 lg:px-12 relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900'>
        <div className='container mx-auto relative z-10'>
          <div className='text-center mb-12 reveal'>
            <span className='text-amber-400 text-sm font-semibold uppercase'>Our Promise</span>
            <h2 className='text-white text-2xl md:text-3xl lg:text-4xl mt-2 mb-3 font-bold'>Why Choose Radhana Art?</h2>
            <p className='text-gray-300 text-[15px] max-w-xl mx-auto'>
              We combine traditional craftsmanship with modern laser technology to deliver excellence
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {[
              { icon: 'fa-award', title: 'Premium Quality', desc: 'Precision laser-engraved with sharp details and a flawless finish guaranteed', color: 'blue' },
              { icon: 'fa-sliders', title: 'Fully Customizable', desc: 'Every item designed exactly the way you want — unlimited edits before crafting', color: 'green' },
              { icon: 'fa-hand-holding-dollar', title: 'Affordable Pricing', desc: 'Top craftsmanship at transparent prices — bulk order discounts available', color: 'amber' },
              { icon: 'fa-truck-fast', title: 'Fast & Reliable', desc: '2–3 day turnaround with reliable delivery across Kathmandu valley', color: 'red' },
            ].map((item) => (
              <div key={item.title} className='reveal bg-white/8 backdrop-blur-sm border border-white/10 p-7 rounded-2xl hover:bg-white transition group cursor-default'>
                <div className={`w-14 h-14 bg-${item.color}-600/20 group-hover:bg-${item.color}-600 rounded-2xl flex items-center justify-center mb-5 transition`}>
                  <i className={`fas ${item.icon} text-${item.color}-400 group-hover:text-white text-2xl transition`}></i>
                </div>
                <h3 className='text-white group-hover:text-gray-800 text-lg mb-2 font-bold transition'>{item.title}</h3>
                <p className='text-gray-400 group-hover:text-gray-500 text-sm leading-relaxed transition'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className='py-16 md:py-20 bg-slate-50 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <div className='text-center mb-12 reveal'>
            <span className='text-red-600 text-sm font-semibold uppercase'>What Customers Say</span>
            <h2 className='text-2xl md:text-3xl lg:text-4xl mt-2 mb-3 text-gray-800 font-bold'>Real Reviews from Real Clients</h2>
            <p className='text-gray-400 text-[15px] max-w-xl mx-auto'>Join 5000+ happy customers who've transformed their memories into art</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[
              { name: 'Priya Sharma', role: 'Wedding Planner', text: 'The quality was exceptional! Our clients loved the personalized tokens.', stars: 5 },
              { name: 'Rajesh Poudel', role: 'Business Owner', text: 'Perfect for corporate gifting. Delivery was faster than promised!', stars: 5 },
              { name: 'Aisha Khan', role: 'Gift Shop Owner', text: 'Best laser engraving service in Kathmandu. Highly recommended!', stars: 5 },
            ].map((testimonial) => (
              <div key={testimonial.name} className='reveal bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition'>
                <div className='flex gap-0.5 mb-3'>
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} size={14} className='text-amber-400 fill-amber-400' />
                  ))}
                </div>
                <p className='text-gray-600 text-sm mb-4 leading-relaxed'>"{testimonial.text}"</p>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-full'></div>
                  <div>
                    <p className='text-gray-800 text-sm font-semibold'>{testimonial.name}</p>
                    <p className='text-gray-500 text-xs'>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className='py-16 px-6 md:px-8 lg:px-12 bg-gradient-to-r from-blue-600 to-red-600'>
        <div className='container mx-auto text-center'>
          <h2 className='text-white text-3xl md:text-4xl font-bold mb-4'>Ready to Create Something Amazing?</h2>
          <p className='text-white/90 text-lg mb-8 max-w-2xl mx-auto'>
            Start your custom order today and get a design preview within 24 hours
          </p>
          <Link to='/contact' className='inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition'>
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Home