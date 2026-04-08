import React from 'react'
import { Link } from 'react-router-dom'
import { Target, Eye } from 'lucide-react'

const AboutUs = () => {
  return (
    <main>
      {/* PAGE HEADER */}
      <section className='bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>About Radhana Art</h1>
          <p className='text-gray-600'>Crafting memories, one laser engraving at a time since 2018</p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className='py-16 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto max-w-4xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-800 mb-6'>Our Story</h2>
              <p className='text-gray-600 leading-relaxed mb-4'>
                Radhana Art was founded with a simple dream: to help people transform their cherished memories and sentiments into beautiful, tangible art pieces through laser engraving.
              </p>
              <p className='text-gray-600 leading-relaxed mb-4'>
                What started as a small passion project has grown into a trusted name in custom laser engraving across Kathmandu, serving thousands of happy customers with personalized gifts for every occasion.
              </p>
              <p className='text-gray-600 leading-relaxed'>
                Today, we combine traditional craftsmanship with cutting-edge laser technology to create pieces that last a lifetime.
              </p>
            </div>
            <div className='rounded-lg overflow-hidden shadow-lg'>
              <img
                src='https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=500&auto=format&fit=crop'
                alt='workspace'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className='py-16 px-6 md:px-8 lg:px-12 bg-gray-50'>
        <div className='container mx-auto max-w-4xl'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
            {/* Mission */}
            <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition'>
              <div className='text-blue-600 mb-4'>
                <Target size={40} />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>Our Mission</h3>
              <p className='text-gray-600 leading-relaxed'>
                To create personalized, high-quality laser-engraved products that help people celebrate life's precious moments and strengthen their bonds with loved ones.
              </p>
            </div>

            {/* Vision */}
            <div className='bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition'>
              <div className='text-red-600 mb-4'>
                <Eye size={40} />
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>Our Vision</h3>
              <p className='text-gray-600 leading-relaxed'>
                To be the go-to destination for personalized gifting in Nepal, known for exceptional quality, creative designs, and outstanding customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className='py-16 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto max-w-4xl'>
          <h2 className='text-3xl font-bold text-gray-800 mb-12 text-center'>Why Choose Us</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {[
              { icon: 'fa-laser', title: 'Advanced Technology', desc: 'Latest laser engraving equipment for precision and detail' },
              { icon: 'fa-users', title: 'Expert Team', desc: 'Skilled artisans with years of engraving experience' },
              { icon: 'fa-heart', title: 'Quality Focus', desc: 'Every product is inspected for perfection' },
              { icon: 'fa-bolt', title: 'Fast Delivery', desc: '2-3 day turnaround for standard orders' },
              { icon: 'fa-palette', title: 'Creative Designs', desc: 'Custom designs tailored to your vision' },
              { icon: 'fa-smile', title: 'Customer Satisfaction', desc: 'Your happiness is our priority' },
            ].map((item, idx) => (
              <div key={idx} className='border border-gray-200 rounded-lg p-6 hover:shadow-lg transition'>
                <div className='text-3xl text-blue-600 mb-4'>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h3 className='font-bold text-gray-800 mb-2'>{item.title}</h3>
                <p className='text-gray-600 text-sm'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className='py-16 px-6 md:px-8 lg:px-12 bg-gray-50'>
        <div className='container mx-auto max-w-4xl'>
          <h2 className='text-3xl font-bold text-gray-800 mb-12 text-center'>Meet Our Team</h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              { name: 'Rajesh Poudel', role: 'Founder & Master Engraver', desc: 'With 12 years of laser engraving expertise' },
              { name: 'Priya Sharma', role: 'Creative Designer', desc: 'Bringing visions to life with stunning designs' },
              { name: 'Amit Kumar', role: 'Production Lead', desc: 'Ensuring quality in every single product' },
            ].map((member, idx) => (
              <div key={idx} className='bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition text-center'>
                <div className='w-full h-48 bg-gradient-to-br from-blue-400 to-red-400 flex items-center justify-center text-white text-5xl font-bold'>
                  {member.name[0]}
                </div>
                <div className='p-6'>
                  <h3 className='font-bold text-gray-800 mb-1'>{member.name}</h3>
                  <p className='text-blue-600 font-medium text-sm mb-3'>{member.role}</p>
                  <p className='text-gray-600 text-sm'>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className='py-16 px-6 md:px-8 lg:px-12 bg-gradient-to-r from-blue-600 to-red-600 text-white'>
        <div className='container mx-auto max-w-4xl'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
            <div>
              <p className='text-4xl font-bold mb-2'>5+</p>
              <p className='text-white/90'>Years in Business</p>
            </div>
            <div>
              <p className='text-4xl font-bold mb-2'>5000+</p>
              <p className='text-white/90'>Happy Customers</p>
            </div>
            <div>
              <p className='text-4xl font-bold mb-2'>10000+</p>
              <p className='text-white/90'>Items Created</p>
            </div>
            <div>
              <p className='text-4xl font-bold mb-2'>4.9★</p>
              <p className='text-white/90'>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className='py-12 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto text-center max-w-2xl'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>Ready to Create Something Special?</h2>
          <p className='text-gray-600 mb-8'>
            Let us help you turn your ideas into beautiful, lasting memories through our laser engraving services.
          </p>
          <Link
            to='/contact'
            className='inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition'
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  )
}

export default AboutUs