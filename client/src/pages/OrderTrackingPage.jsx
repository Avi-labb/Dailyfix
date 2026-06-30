import { useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'

function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const trackOrder = async () => {
    if (!orderId) {
      toast.error('Please enter order ID')
      return
    }
    setLoading(true)
    try {
      const res = await api.get(`/orders/${orderId}`)
      setOrder(res.data)
    } catch {
      toast.error('Order not found')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const statusSteps = [
    { status: 'Pending', label: 'Order Placed' },
    { status: 'Confirmed', label: 'Confirmed' },
    { status: 'Processing', label: 'Processing' },
    { status: 'Shipped', label: 'Shipped' },
    { status: 'Delivered', label: 'Delivered' }
  ]

  const currentStepIndex = statusSteps.findIndex(s => s.status === order?.status)

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>
      
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Enter your order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-3"
          onKeyDown={(e) => e.key === 'Enter' && trackOrder()}
        />
        <button
          onClick={trackOrder}
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent disabled:opacity-50 flex items-center gap-2"
        >
          <Search size={20} />
          Track
        </button>
      </div>

      {order && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Order #{order.order_id}</h2>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {statusSteps.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStepIndex ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm mt-2 text-center">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-primary rounded transition-all"
                style={{ width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderTrackingPage