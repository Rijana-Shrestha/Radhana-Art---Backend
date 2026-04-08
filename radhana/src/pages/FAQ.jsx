import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronDown, MessageCircle, Mail, Phone } from 'lucide-react'

const FAQ = () => {
  const [openAccordion, setOpenAccordion] = useState(null)

  const faqs = [
    {
      category: 'Orders & Pricing',
      items: [
        { q: 'What is the turnaround time for orders?', a: 'Standard orders are completed within 2-3 days. Express orders (24 hours) are available for an additional charge.' },
        { q: 'Do you offer bulk discounts?', a: 'Yes! We provide tiered bulk discounts for orders of 50+ items. Contact us for a custom quote.' },
        { q: 'What are your price ranges?', a: 'Prices vary by product type. Personal items start from Rs. 300, while custom projects can range from Rs. 500-5000+. Visit our Products page for detailed pricing.' },
        { q: 'Do you ship outside Kathmandu?', a: 'Currently, we deliver within Kathmandu valley. For outside shipments, we can arrange through courier services.' },
      ],
    },
    {
      category: 'Custom Design',
      items: [
        { q: 'Can I customize the design?', a: 'Absolutely! We create custom designs based on your requirements. You can provide photos, text, logos, or descriptions.' },
        { q: 'How many design revisions are included?', a: 'Unlimited design revisions are included until you\'re 100% satisfied with the preview.' },
        { q: 'What file formats do you accept?', a: 'We accept JPG, PNG, PDF, SVG, AI, and EPS files. If you don\'t have a digital file, we can also work from physical photos or sketches.' },
        { q: 'How long does the design process take?', a: 'Typically, we send the first design preview within 24 hours of receiving your requirements.' },
      ],
    },
    {
      category: 'Payment & Checkout',
      items: [
        { q: 'What payment methods do you accept?', a: 'We accept eSewa, Khalti, FonePay, and direct bank transfers. Payment is collected before we start production.' },
        { q: 'Is it safe to pay online through your website?', a: 'Yes, our payment gateway is encrypted and secure. We never store your card information.' },
        { q: 'Do you offer payment plans for bulk orders?', a: 'Yes! For large orders, we can arrange installment payment options. Contact us for details.' },
        { q: 'Can I cancel my order?', a: 'Orders can be cancelled before production starts with a full refund. Once production begins, a 30% cancellation fee applies.' },
      ],
    },
    {
      category: 'Products & Materials',
      items: [
        { q: 'What materials can be engraved?', a: 'We work with wood, acrylic, leather, glass, metal, and marble. Each material produces different aesthetic results.' },
        { q: 'Is the engraving permanent?', a: 'Yes! Laser engraving creates permanent marks that won\'t fade, peel, or wear off with time.' },
        { q: 'Can you engrave on curved surfaces?', a: 'Yes, we can engrave on slightly curved surfaces. Please check with us if you have a specific curved item.' },
      ],
    },
    {
      category: 'Shipping & Delivery',
      items: [
        { q: 'How is the product packaged?', a: 'All items are carefully packaged in protective boxes with bubble wrap to ensure safe delivery.' },
        { q: 'Can I track my delivery?', a: 'Yes! You\'ll receive tracking information and updates via WhatsApp and email.' },
        { q: 'What if my order arrives damaged?', a: 'Please report any damage within 24 hours. We\'ll replace or refund the damaged item immediately.' },
        { q: 'Do you offer same-day delivery?', a: 'Same-day delivery is available for orders placed before 10 AM within Kathmandu valley for an additional fee.' },
      ],
    },
  ]

  const toggleAccordion = (idx) => {
    setOpenAccordion(openAccordion === idx ? null : idx)
  }

  return (
    <main>
      {/* PAGE HEADER */}
      <section className='bg-gradient-to-r from-blue-50 to-pink-50 py-12 px-6 md:px-8 lg:px-12'>
        <div className='container mx-auto'>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>Frequently Asked Questions</h1>
          <p className='text-gray-600'>Find answers to common questions about our services</p>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className='py-8 px-6 md:px-8 lg:px-12 bg-white border-b border-gray-200'>
        <div className='container mx-auto max-w-2xl'>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' size={20} />
            <input
              type='text'
              placeholder='Search FAQs...'
              className='w-full border-2 border-gray-200 bg-gray-50 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-blue-600 focus:bg-white transition'
            />
          </div>
        </div>
      </section>

      {/* FAQ CONTENT */}
      <section className='py-16 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto max-w-4xl'>
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx} className='mb-12'>
              <h2 className='text-2xl font-bold text-gray-800 mb-6 pb-4 border-b-2 border-blue-600'>{section.category}</h2>

              <div className='space-y-3'>
                {section.items.map((item, itemIdx) => {
                  const uniqueIdx = `${sectionIdx}-${itemIdx}`
                  return (
                    <button
                      key={uniqueIdx}
                      onClick={() => toggleAccordion(uniqueIdx)}
                      className='w-full text-left'
                    >
                      <div className='border-2 border-gray-200 rounded-lg p-5 hover:border-blue-600 transition hover:shadow-md'>
                        <div className='flex items-center justify-between'>
                          <h3 className='font-bold text-gray-800 pr-4'>{item.q}</h3>
                          <span className={`shrink-0 text-blue-600 transition transform ${openAccordion === uniqueIdx ? 'rotate-180' : ''}`}>
                            <ChevronDown size={20} />
                          </span>
                        </div>

                        {openAccordion === uniqueIdx && (
                          <div className='mt-4 pt-4 border-t border-gray-200'>
                            <p className='text-gray-600 leading-relaxed'>{item.a}</p>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STILL HAVE QUESTIONS */}
      <section className='py-12 px-6 md:px-8 lg:px-12 bg-blue-50'>
        <div className='container mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold text-gray-800 mb-4'>Still Have Questions?</h2>
          <p className='text-gray-600 mb-8'>
            Can't find the answer you're looking for? Please contact our support team. We're here to help!
          </p>
          <Link to='/contact' className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition'>
            Contact Us
          </Link>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className='py-12 px-6 md:px-8 lg:px-12 bg-white'>
        <div className='container mx-auto max-w-4xl'>
          <h3 className='text-2xl font-bold text-gray-800 mb-8 text-center'>Get Help</h3>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <a
              href='https://wa.me/9779823939106'
              target='_blank'
              rel='noopener noreferrer'
              className='bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition'
            >
              <div className='flex justify-center text-green-600 mb-3'>
                <MessageCircle size={40} />
              </div>
              <h4 className='font-bold text-gray-800 mb-2'>WhatsApp</h4>
              <p className='text-green-600 font-medium'>Chat with us anytime</p>
              <p className='text-sm text-gray-600 mt-2'>+977 9823939106</p>
            </a>

            <a
              href='mailto:info@radhanaart.com'
              className='bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center hover:shadow-lg transition'
            >
              <div className='flex justify-center text-blue-600 mb-3'>
                <Mail size={40} />
              </div>
              <h4 className='font-bold text-gray-800 mb-2'>Email</h4>
              <p className='text-blue-600 font-medium'>Send us an email</p>
              <p className='text-sm text-gray-600 mt-2'>info@radhanaart.com</p>
            </a>

            <div className='bg-amber-50 border-2 border-amber-200 rounded-lg p-6 text-center'>
              <div className='flex justify-center text-amber-600 mb-3'>
                <Phone size={40} />
              </div>
              <h4 className='font-bold text-gray-800 mb-2'>Phone</h4>
              <p className='text-amber-600 font-medium'>Call us</p>
              <p className='text-sm text-gray-600 mt-2'>+977 9823939106</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default FAQ