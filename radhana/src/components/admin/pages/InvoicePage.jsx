import React, { useState, useMemo, useContext } from 'react'
import { AdminContext } from '../../../context/AdminContext'
import { Toast } from '../index'

const InvoicePage = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [toast, setToast] = useState({ visible: false, msg: '', type: 'success' })
  const [isGenerating, setIsGenerating] = useState(false)
  const [customInvoices, setCustomInvoices] = useState([])
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    city: '',
    country: 'Nepal',
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: '',
  })

  // Filter only delivered orders
  const deliveredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return []
    return orders.filter(order => 
      order.status?.toLowerCase() === 'delivered'
    )
  }, [orders])

  const allInvoices = useMemo(() => {
    return [...deliveredOrders, ...customInvoices]
  }, [deliveredOrders, customInvoices])

  // Filter by search term
  const filteredOrders = useMemo(() => {
    if (!allInvoices) return []
    return allInvoices.filter(invoice => {
      const invoiceNumber = invoice.orderNumber || invoice.invoiceNumber || invoice._id || ''
      const customerName = invoice.shippingAddress?.firstName || invoice.customerName || ''
      const email = invoice.shippingAddress?.email || invoice.customerEmail || ''
      
      const searchLower = searchTerm.toLowerCase()
      return (
        invoiceNumber.toLowerCase().includes(searchLower) ||
        customerName.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower)
      )
    })
  }, [allInvoices, searchTerm])

  const showToast = (msg, type = 'success') => {
    setToast({ visible: true, msg, type })
    setTimeout(() => setToast({ visible: false, msg: '', type: 'success' }), 3000)
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData(prev => ({
      ...prev,
      items: newItems
    }))
  }

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }))
  }

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleSaveInvoice = () => {
    if (!formData.customerName.trim()) {
      showToast('Customer name is required', 'error')
      return
    }
    if (!formData.customerEmail.trim()) {
      showToast('Customer email is required', 'error')
      return
    }
    if (formData.items.length === 0) {
      showToast('Add at least one item', 'error')
      return
    }

    const invalidItems = formData.items.some(
      item => !item.description.trim() || item.quantity <= 0 || item.price <= 0
    )
    if (invalidItems) {
      showToast('All items must have description, quantity, and price', 'error')
      return
    }

    const newInvoice = {
      _id: 'CUSTOM-' + Date.now(),
      invoiceNumber: 'INV-' + Date.now(),
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      shippingAddress: {
        firstName: formData.customerName.split(' ')[0],
        lastName: formData.customerName.split(' ').slice(1).join(' ') || '',
        street: formData.customerAddress,
        city: formData.city,
        country: formData.country,
        phone: formData.customerPhone,
        email: formData.customerEmail,
      },
      orderItems: formData.items.map(item => ({
        product: { title: item.description },
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      orderNotes: formData.notes,
      createdAt: new Date(),
      isCustom: true,
    }

    setCustomInvoices(prev => [...prev, newInvoice])
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      city: '',
      country: 'Nepal',
      items: [{ description: '', quantity: 1, price: 0 }],
      notes: '',
    })
    setShowCreateForm(false)
    showToast('Invoice created successfully!', 'success')
  }

  const handleGenerateInvoice = (order) => {
    setSelectedInvoice(order)
    setShowPreview(true)
  }

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true)
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      const invoiceHTML = generateInvoiceHTML(selectedInvoice)
      
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
        showToast('Invoice opened for printing/saving as PDF', 'success')
      }, 500)
    } catch (error) {
      showToast('Error generating PDF', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank')
    const invoiceHTML = generateInvoiceHTML(selectedInvoice)
    
    printWindow.document.write(invoiceHTML)
    printWindow.document.close()
    
    setTimeout(() => {
      printWindow.print()
      showToast('Invoice sent to printer', 'success')
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900">Tax Invoices</h1>
          <p className="text-gray-600">Generate and manage invoices for delivered orders</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2 whitespace-nowrap"
        >
          <i className="fas fa-plus"></i>
          Create New Invoice
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{orders?.length || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{deliveredOrders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Custom Invoices</p>
          <p className="text-2xl font-bold text-purple-600">{customInvoices.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Total Invoices</p>
          <p className="text-2xl font-bold text-blue-600">{allInvoices.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Search by Order ID, Customer Name, or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
        />
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 px-2">
        Showing <span className="font-semibold">{filteredOrders.length}</span> of <span className="font-semibold">{allInvoices.length}</span> invoices
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Invoice #</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Items</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((invoice, index) => (
                <tr key={invoice._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {invoice.orderNumber || invoice.invoiceNumber}
                    {invoice.isCustom && <span className="ml-2 text-purple-600 text-xs font-bold">CUSTOM</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div>
                      <p className="font-medium">
                        {invoice.shippingAddress?.firstName || invoice.customerName} {invoice.shippingAddress?.lastName || ''}
                      </p>
                      <p className="text-gray-500 text-xs">{invoice.shippingAddress?.email || invoice.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Rs. {(invoice.totalPrice || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {invoice.orderItems?.length || 0} item{invoice.orderItems?.length !== 1 ? 's' : ''}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleGenerateInvoice(invoice)}
                      className="text-primary-600 hover:text-primary-700 font-medium transition"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  {allInvoices.length === 0 
                    ? 'No invoices found. Create one to get started!' 
                    : 'No invoices match your search'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Preview Modal */}
      {showPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Invoice Preview</h3>
              <button
                onClick={() => {
                  setShowPreview(false)
                  setSelectedInvoice(null)
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Invoice Content */}
            <div className="p-8">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">RADHANA ART</h2>
                    <p className="text-gray-600 text-sm">Tax Invoice</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-700">Invoice #: {selectedInvoice.orderNumber}</p>
                    <p className="text-sm text-gray-600">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Customer & Company Info */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Bill To</h4>
                    <p className="text-sm font-medium text-gray-900">{selectedInvoice.shippingAddress?.firstName} {selectedInvoice.shippingAddress?.lastName}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.shippingAddress?.street}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.shippingAddress?.city}, {selectedInvoice.shippingAddress?.country}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.shippingAddress?.phone}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.shippingAddress?.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Company Details</h4>
                    <p className="text-sm text-gray-900 font-medium">Radhana Art</p>
                    <p className="text-sm text-gray-600">Nepal</p>
                  </div>
                </div>

                {/* Items Table */}
                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-900">
                        <th className="text-left py-2 font-semibold text-gray-900">Description</th>
                        <th className="text-right py-2 font-semibold text-gray-900">Qty</th>
                        <th className="text-right py-2 font-semibold text-gray-900">Rate</th>
                        <th className="text-right py-2 font-semibold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.orderItems?.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-2 text-gray-900">{item.product?.title || 'Product'}</td>
                          <td className="text-right py-2 text-gray-600">{item.quantity}</td>
                          <td className="text-right py-2 text-gray-600">Rs. {(item.price || 0).toLocaleString()}</td>
                          <td className="text-right py-2 text-gray-900 font-medium">Rs. {((item.quantity || 1) * (item.price || 0)).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-medium">Rs. {(selectedInvoice.totalPrice || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-gray-900">Rs. {(selectedInvoice.totalPrice || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedInvoice.orderNotes && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{selectedInvoice.orderNotes}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
                  <p>Thank you for your business!</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  isGenerating
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download"></i>
                    Download as PDF
                  </>
                )}
              </button>
              
              <button
                onClick={handlePrintInvoice}
                className="flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="fas fa-print"></i>
                Print
              </button>

              <button
                onClick={() => {
                  setShowPreview(false)
                  setSelectedInvoice(null)
                }}
                className="flex-1 py-2 rounded-lg font-medium transition bg-gray-200 text-gray-900 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setFormData({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    customerAddress: '',
                    city: '',
                    country: 'Nepal',
                    items: [{ description: '', quantity: 1, price: 0 }],
                    notes: '',
                  })
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4">
              {/* Customer Information */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Customer Name *"
                    value={formData.customerName}
                    onChange={(e) => handleFormChange('customerName', e.target.value)}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={formData.customerEmail}
                    onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.customerPhone}
                    onChange={(e) => handleFormChange('customerPhone', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  />
                  <textarea
                    placeholder="Address"
                    value={formData.customerAddress}
                    onChange={(e) => handleFormChange('customerAddress', e.target.value)}
                    rows={2}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm resize-none"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleFormChange('city', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  />
                  <select
                    value={formData.country}
                    onChange={(e) => handleFormChange('country', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  >
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Invoice Items */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold text-gray-900">Invoice Items</h4>
                  <button
                    onClick={handleAddItem}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                  >
                    <i className="fas fa-plus"></i>
                    Add Item
                  </button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-600"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-600"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-600"
                      />
                      <span className="text-sm font-medium text-gray-700 w-20 text-right">
                        Rs. {(item.quantity * item.price).toLocaleString()}
                      </span>
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="text-red-600 hover:text-red-700 px-2 py-2"
                        >
                          <i className="fas fa-trash text-sm"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="border-b border-gray-200 pb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes (Optional)</h4>
                <textarea
                  placeholder="Additional notes or special instructions..."
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm resize-none"
                />
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">Rs. {formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={handleSaveInvoice}
                className="flex-1 py-2 rounded-lg font-medium transition bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <i className="fas fa-save"></i>
                Create Invoice
              </button>
              
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setFormData({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    customerAddress: '',
                    city: '',
                    country: 'Nepal',
                    items: [{ description: '', quantity: 1, price: 0 }],
                    notes: '',
                  })
                }}
                className="flex-1 py-2 rounded-lg font-medium transition bg-gray-200 text-gray-900 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast 
        msg={toast.msg} 
        visible={toast.visible}
      />
    </div>
  )
}

// Helper function to generate invoice HTML for printing
const generateInvoiceHTML = (order) => {
  const itemsHTML = order.orderItems?.map((item, index) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 8px; text-align: left; color: #1f2937;">${item.product?.title || 'Product'}</td>
      <td style="padding: 8px; text-align: right; color: #4b5563;">${item.quantity}</td>
      <td style="padding: 8px; text-align: right; color: #4b5563;">Rs. ${(item.price || 0).toLocaleString()}</td>
      <td style="padding: 8px; text-align: right; color: #1f2937; font-weight: 600;">Rs. ${((item.quantity || 1) * (item.price || 0)).toLocaleString()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${order.orderNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #1f2937;
          background: white;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          border: 1px solid #e5e7eb;
          background: white;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }
        .invoice-title {
          font-size: 14px;
          color: #6b7280;
          margin-top: 5px;
        }
        .invoice-meta {
          text-align: right;
        }
        .invoice-meta p {
          margin: 5px 0;
          font-size: 14px;
        }
        .invoice-meta-label {
          font-weight: 600;
          color: #1f2937;
        }
        .invoice-meta-value {
          color: #4b5563;
        }
        .details-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 30px;
          font-size: 14px;
        }
        .detail-block h4 {
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 10px 0;
          font-size: 14px;
        }
        .detail-block p {
          margin: 5px 0;
          color: #4b5563;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        thead {
          background: #f3f4f6;
          border-bottom: 2px solid #1f2937;
        }
        th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #1f2937;
        }
        td {
          padding: 12px;
        }
        .text-right {
          text-align: right;
        }
        .totals {
          display: flex;
          justify-content: flex-end;
          margin: 30px 0;
        }
        .totals-table {
          width: 300px;
        }
        .totals-table .row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .totals-table .row.total {
          border-top: 2px solid #1f2937;
          font-weight: bold;
          font-size: 16px;
          margin-top: 10px;
          padding-top: 10px;
        }
        .notes {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
          font-size: 14px;
          margin-top: 30px;
        }
        .notes h4 {
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 10px 0;
        }
        .footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 30px;
        }
        @media print {
          body { margin: 0; padding: 0; }
          .invoice-container { border: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div>
            <div class="company-name">RADHANA ART</div>
            <div class="invoice-title">Tax Invoice</div>
          </div>
          <div class="invoice-meta">
            <p><span class="invoice-meta-label">Invoice #:</span> <span class="invoice-meta-value">${order.orderNumber}</span></p>
            <p><span class="invoice-meta-label">Date:</span> <span class="invoice-meta-value">${new Date(order.createdAt).toLocaleDateString()}</span></p>
          </div>
        </div>

        <div class="details-section">
          <div class="detail-block">
            <h4>Bill To</h4>
            <p><strong>${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}</strong></p>
            <p>${order.shippingAddress?.street}</p>
            <p>${order.shippingAddress?.city}, ${order.shippingAddress?.country}</p>
            <p>${order.shippingAddress?.phone}</p>
            <p>${order.shippingAddress?.email}</p>
          </div>
          <div class="detail-block">
            <h4>Company Details</h4>
            <p><strong>Radhana Art</strong></p>
            <p>Nepal</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Rate</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-table">
            <div class="row">
              <span>Subtotal:</span>
              <span>Rs. ${(order.totalPrice || 0).toLocaleString()}</span>
            </div>
            <div class="row total">
              <span>Total:</span>
              <span>Rs. ${(order.totalPrice || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        ${order.orderNotes ? `
          <div class="notes">
            <h4>Notes</h4>
            <p>${order.orderNotes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default InvoicePage
