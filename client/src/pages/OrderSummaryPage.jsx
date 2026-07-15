import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, CheckCircle, Edit } from 'lucide-react'

function OrderSummaryPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  useEffect(() => {
    // Get pending order from session storage
    const savedOrder = sessionStorage.getItem('pendingOrder')
    if (!savedOrder) {
      navigate('/checkout')
      return
    }
    setOrderData(JSON.parse(savedOrder))
  }, [navigate])

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    if (orderData.payment_method === 'razorpay') {
      await handleOnlinePayment()
    } else {
      await submitOrder()
    }
  }

  const handleOnlinePayment = async () => {
    setPaymentProcessing(true)
    try {
      // Simulate payment processing - in real app you'd integrate with Razorpay here
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Payment successful!')
      await submitOrder()
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setPaymentProcessing(false)
    }
  }

  const submitOrder = async () => {
    setLoading(true)
    try {
      const res = await api.post('/orders', {
        customer: {
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          email: orderData.customer.email,
          phone: orderData.customer.phone
        },
        items: orderData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod
      })

      clearCart()
      sessionStorage.removeItem('pendingOrder')
      navigate(`/order-success/${res.data.orderId}`)
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-9xl mx-auto px-4 py-4">
        <button 
          onClick={() => navigate('/checkout')}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Edit Order
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold">1</div>
          <div className="w-16 h-1 bg-emerald-600"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-bold">2</div>
          <div className="w-16 h-1 bg-slate-200"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 text-slate-400 font-bold">3</div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-emerald-600" />
          Review Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Customer</h2>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-slate-700">
                <p className="font-medium">
                  {orderData.customer.firstName} {orderData.customer.lastName}
                </p>
                <p>{orderData.customer.email}</p>
                <p>+91 {orderData.customer.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin size={20} />
                  Shipping Address
                </h2>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
              <div className="space-y-2 text-slate-700">
                <p>{orderData.shipping_address.address}</p>
                <p>{orderData.shipping_address.city}, {orderData.shipping_address.state}</p>
                <p>{orderData.shipping_address.pincode}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Method
                </h2>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>
              <div className="text-slate-700">
                {orderData.payment_method === 'cod' ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-emerald-600" />
                    <span>Cash on Delivery</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-emerald-600" />
                    <span>Online Payment (UPI / Card / Netbanking)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                    {item.product.image && (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{item.product.name}</h3>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">₹{item.price * item.quantity}</p>
                      {item.product.discount_price && (
                        <p className="text-sm text-slate-500 line-through">₹{item.product.price * item.quantity}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Price Summary</h2>
              <div className="space-y-3 text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{orderData.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{orderData.shipping === 0 ? 'Free' : `₹{orderData.shipping}`}</span>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-emerald-700">₹{orderData.total}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || paymentProcessing}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform"
              >
                {paymentProcessing ? 'Processing Payment...' : 
                 loading ? 'Placing Order...' : 
                 orderData.payment_method === 'razorpay' ? 'Pay Now' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummaryPage
