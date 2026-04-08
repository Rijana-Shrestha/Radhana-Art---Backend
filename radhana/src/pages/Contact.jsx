import React, { useState } from 'react'
import { CheckCircle, Send, Phone, Mail, MessageCircle, MapPin, ChevronDown } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <main>
      <section className='bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Contact Us</h1>
          <p className='text-gray-600'>We'd love to hear from you. Get in touch with our team!</p>
        </div>
      </section>

      <section className='py-16 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-6'>Send us a Message</h2>

              {submitted && (
                <div className='mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-3'>
                  <CheckCircle size={24} className='text-green-600' />
                  <div>
                    <p className='font-bold text-green-800'>Message Sent!</p>
                    <p className='text-sm text-green-700'>We'll get back to you shortly.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='text'
                    name='name'
                    placeholder='Your Name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                  <input
                    type='email'
                    name='email'
                    placeholder='Your Email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                </div>

                <input
                  type='tel'
                  name='phone'
                  placeholder='Phone Number'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                />

                <select
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition text-gray-700'
                >
                  <option value=''>Select Subject</option>
                  <option value='general'>General Inquiry</option>
                  <option value='custom'>Custom Order</option>
                  <option value='bulk'>Bulk Order</option>
                  <option value='corporate'>Corporate Gifting</option>
                </select>

                <textarea
                  name='message'
                  placeholder='Your Message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows='6'
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition resize-none'
                ></textarea>

                <button
                  type='submit'
                  className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2'
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <h2 className='text-2xl font-bold text-gray-800 mb-8'>Contact Information</h2>

              <div className='space-y-6'>
                <div className='bg-blue-50 p-6 rounded-lg border border-blue-200 hover:shadow-lg transition'>
                  <div className='flex items-center gap-4 mb-3'>
                    <div className='w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center'>
                      <Phone size={20} className='text-white' />
                    </div>
                    <h3 className='font-bold text-gray-800'>Phone</h3>
                  </div>
                  <p className='text-gray-600'>+977 9823939106</p>
                  <p className='text-sm text-gray-500 mt-1'>Monday to Friday, 9 AM - 6 PM</p>
                </div>

                <div className='bg-red-50 p-6 rounded-lg border border-red-200 hover:shadow-lg transition'>
                  <div className='flex items-center gap-4 mb-3'>
                    <div className='w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center'>
                      <Mail size={20} className='text-white' />
                    </div>
                    <h3 className='font-bold text-gray-800'>Email</h3>
                  </div>
                  <p className='text-gray-600'>info@radhanaart.com</p>
                  <p className='text-sm text-gray-500 mt-1'>We respond within 24 hours</p>
                </div>

                <div className='bg-green-50 p-6 rounded-lg border border-green-200 hover:shadow-lg transition'>
                  <div className='flex items-center gap-4 mb-3'>
                    <div className='w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center'>
                      <MessageCircle size={20} className='text-white' />
                    </div>
                    <h3 className='font-bold text-gray-800'>WhatsApp</h3>
                  </div>
                  <p className='text-gray-600'>+977 9823939106</p>
                  <p className='text-sm text-gray-500 mt-1'>Chat with us anytime</p>
                </div>

                <div className='bg-amber-50 p-6 rounded-lg border border-amber-200 hover:shadow-lg transition'>
                  <div className='flex items-center gap-4 mb-3'>
                    <div className='w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center'>
                      <MapPin size={20} className='text-white' />
                    </div>
                    <h3 className='font-bold text-gray-800'>Location</h3>
                  </div>
                  <p className='text-gray-600'>Kathmandu, Nepal</p>
                  <p className='text-sm text-gray-500 mt-1'>Metropolitan Area</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-12 px-6 md:px-8 lg:px-12 bg-gray-50'>
        <div className='container mx-auto max-w-4xl'>
          <h2 className='text-2xl font-bold text-gray-800 mb-8 text-center'>Frequently Asked Questions</h2>

          <div className='space-y-4'>
            {[
              { q: 'What is the turnaround time for orders?', a: 'Standard orders are completed within 2-3 days. Rush orders may available upon request.' },
              { q: 'Do you offer bulk discounts?', a: 'Yes! We provide special pricing for bulk orders. Contact us for a custom quote.' },
              { q: 'Can I customize the design?', a: 'Absolutely! We work with you to create the perfect design. Unlimited edits are included.' },
              { q: 'What payment methods do you accept?', a: 'We accept eSewa, Khalti, FonePay, and direct bank transfers.' },
            ].map((faq, idx) => (
              <details key={idx} className='group border border-gray-200 rounded-lg p-4 cursor-pointer'>
                <summary className='flex items-center justify-between font-bold text-gray-800'>
                  {faq.q}
                  <span className='transition group-open:rotate-180'>
                    <ChevronDown size={20} />
                  </span>
                </summary>
                <p className='text-gray-600 mt-3 leading-relaxed'>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact