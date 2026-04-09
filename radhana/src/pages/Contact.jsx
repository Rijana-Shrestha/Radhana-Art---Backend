import React, { useState, useRef } from 'react'
import { CheckCircle, Send, Phone, Mail, MessageCircle, MapPin, ChevronDown, AlertCircle, Upload, X } from 'lucide-react'
import { axiosInstance } from '../utils/axios'

const Contact = () => {
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    attachment: null,
  })
  const [attachmentPreview, setAttachmentPreview] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setFormData({
        ...formData,
        attachment: file,
      })
      setAttachmentPreview({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
      })
      setError('')
    }
  }

  const removeAttachment = () => {
    setFormData({
      ...formData,
      attachment: null,
    })
    setAttachmentPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('subject', formData.subject)
      submitData.append('message', formData.message)
      
      // Append file if exists
      if (formData.attachment) {
        submitData.append('attachment', formData.attachment)
      }

      const res = await axiosInstance.post("/contact/", submitData)
      
      console.log('Contact form submitted:', res.data)
      setSubmitted(true)
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', attachment: null })
      setAttachmentPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      console.error('Contact submission error:', err)
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
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

              {error && (
                <div className='mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-lg flex items-center gap-3'>
                  <AlertCircle size={24} className='text-red-600' />
                  <div>
                    <p className='font-bold text-red-800'>Error</p>
                    <p className='text-sm text-red-700'>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <input
                    type='text'
                    name='name'
                    placeholder='Your Name *'
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
                  />
                  <input
                    type='email'
                    name='email'
                    placeholder='Your Email *'
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
                  <option value=''>Select Subject *</option>
                  <option value='general'>General Inquiry</option>
                  <option value='custom'>Custom Order</option>
                  <option value='bulk'>Bulk Order</option>
                  <option value='corporate'>Corporate Gifting</option>
                </select>

                <textarea
                  name='message'
                  placeholder='Your Message *'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows='6'
                  className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition resize-none'
                ></textarea>

                {/* File Attachment Section */}
                <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-blue-600 transition'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    onChange={handleFileChange}
                    className='hidden'
                    accept='*'
                  />
                  
                  {!attachmentPreview ? (
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      className='w-full flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition'
                    >
                      <Upload size={24} />
                      <div className='text-center'>
                        <p className='font-semibold'>Upload Attachment (Optional)</p>
                        <p className='text-sm text-gray-500'>Max 5MB - Images, PDFs, documents</p>
                      </div>
                    </button>
                  ) : (
                    <div className='flex items-center justify-between bg-white p-3 rounded-md'>
                      <div className='flex items-center gap-3 flex-1'>
                        <div className='w-10 h-10 bg-blue-100 rounded flex items-center justify-center'>
                          <Upload size={18} className='text-blue-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='font-semibold text-gray-800 truncate text-sm'>{attachmentPreview.name}</p>
                          <p className='text-xs text-gray-500'>{attachmentPreview.size} KB</p>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={removeAttachment}
                        className='ml-2 p-1 hover:bg-red-100 rounded transition text-red-600'
                        title='Remove file'
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send Message'}
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