import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { ArrowLeft, CreditCard, Package, ShoppingBag, MapPin, CheckCircle, AlertCircle } from 'lucide-react'

const statesOfIndia = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep',
  'Delhi', 'Puducherry'
]

const phonePattern = /^[6-9]\d{9}$/
const pincodePattern = /^[1-9][0-9]{5}$/

// Payment methods
const paymentMethods = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order'
  },
  {
    id: 'razorpay',
    name: 'Online Payment',
    description: 'UPI / Card / Netbanking'
  }
]

// Step 1: Shipping Address
function Step1Address({ formData, setFormData, nextStep }) {
  const { register, handleSubmit, formState: { errors, touchedFields }, watch, setFocus } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: formData
  })

  const watchedPhone = watch('phone', '')
  const watchedPincode = watch('pincode', '')

  const onSubmit = (data) => {
    setFormData({ ...formData, ...data })
    nextStep()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
        <MapPin className="text-emerald-600" />
        Shipping Address
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">First Name</label>
          <input
            {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'First name must be at least 2 characters' } })}
            className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${errors.firstName && touchedFields.firstName ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.firstName && !errors.firstName ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
            placeholder="Enter your first name"
          />
          {errors.firstName && touchedFields.firstName && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.firstName.message}</span>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">Last Name</label>
          <input
            {...register('lastName', { required: 'Last name is required', minLength: { value: 2, message: 'Last name must be at least 2 characters' } })}
            className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${errors.lastName && touchedFields.lastName ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.lastName && !errors.lastName ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
            placeholder="Enter your last name"
          />
          {errors.lastName && touchedFields.lastName && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.lastName.message}</span>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' } })}
            className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${errors.email && touchedFields.email ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.email && !errors.email ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
            placeholder="you@email.com"
          />
          {errors.email && touchedFields.email && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.email.message}</span>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">Phone Number</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-semibold">+91</span>
            <input
              type="tel"
              {...register('phone', { required: 'Phone number is required', pattern: { value: phonePattern, message: 'Please enter a valid 10-digit mobile number starting with 6-9' } })}
              className={`w-full border-2 rounded-xl pl-16 pr-4 py-3 outline-none transition-all ${errors.phone && touchedFields.phone ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.phone && !errors.phone ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
              placeholder="10-digit mobile number"
              maxLength={10}
              onInput={(e) => e.target.value = e.target.value.replace(/[^\d]/g, '')}
            />
            {touchedFields.phone && <div className="absolute right-4 top-1/2 -translate-y-1/2">{!errors.phone && watchedPhone.length === 10 && <CheckCircle size={20} className="text-green-500" />}</div>}
          </div>
          {errors.phone && touchedFields.phone && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.phone.message}</span>}
          {touchedFields.phone && !errors.phone && watchedPhone.length === 10 && <span className="text-green-500 text-sm mt-1 flex items-center gap-1"><CheckCircle size={14} />Phone number looks good!</span>}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">Complete Address</label>
          <textarea
            {...register('address', { required: 'Address is required', minLength: { value: 10, message: 'Address must be at least 10 characters' } })}
            className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${errors.address && touchedFields.address ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.address && !errors.address ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
            rows={3}
            placeholder="House number, street, landmark, etc."
          />
          {errors.address && touchedFields.address && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.address.message}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">City</label>
            <input
              {...register('city', { required: 'City is required', minLength: { value: 2, message: 'City name must be at least 2 characters' } })}
              className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${errors.city && touchedFields.city ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.city && !errors.city ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
              placeholder="Your city"
            />
            {errors.city && touchedFields.city && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.city.message}</span>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">State</label>
            <select
              {...register('state', { required: 'State is required' })}
              className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition-all bg-white ${errors.state && touchedFields.state ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.state && !errors.state ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
            >
              <option value="">Select your state</option>
              {statesOfIndia.map((state) => <option key={state} value={state}>{state}</option>)}
            </select>
            {errors.state && touchedFields.state && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.state.message}</span>}
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Pincode</label>
            <div className="relative">
              <input
                type="text"
                {...register('pincode', { required: 'PIN code is required', pattern: { value: pincodePattern, message: 'Please enter a valid 6-digit PIN code' } })}
                className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${errors.pincode && touchedFields.pincode ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : touchedFields.pincode && !errors.pincode ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'}`}
                placeholder="6-digit pincode"
                maxLength={6}
                onInput={(e) => e.target.value = e.target.value.replace(/[^\d]/g, '')}
              />
              {touchedFields.pincode && <div className="absolute right-4 top-1/2 -translate-y-1/2">{!errors.pincode && watchedPincode.length === 6 && <CheckCircle size={20} className="text-green-500" />}</div>}
            </div>
            {errors.pincode && touchedFields.pincode && <span className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14} />{errors.pincode.message}</span>}
            {touchedFields.pincode && !errors.pincode && watchedPincode.length === 6 && <span className="text-green-500 text-sm mt-1 flex items-center gap-1"><CheckCircle size={14} />PIN code looks good!</span>}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform"
      >
        Continue to Payment
      </button>
    </div>
  )
}

// Step 2: Payment
function Step2Payment({ formData, setFormData, nextStep, prevStep }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
        <CreditCard className="text-emerald-600" />
        Payment Method
      </h2>
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const isSelected = formData.paymentMethod === method.id

          return (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-5 border-2 rounded-xl cursor-pointer hover:bg-emerald-50 transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}
            >
              <input
                type="radio"
                checked={isSelected}
                onChange={() => setFormData({ ...formData, paymentMethod: method.id })}
                className="w-5 h-5 text-emerald-600"
              />
              <div>
                <div className="font-semibold text-slate-900">{method.name}</div>
                <div className="text-sm text-slate-500">{method.description}</div>
              </div>
            </label>
          )
        })}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={prevStep}
          className="flex-1 bg-white border-2 border-slate-300 text-slate-700 py-4 rounded-xl hover:border-slate-400 font-bold text-lg shadow-xl transition-all"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform"
        >
          Continue to Review
        </button>
      </div>
    </div>
  )
}

// Step 3: Order Summary
function Step3Summary({ formData, setFormData, placeOrder, prevStep, cart, getTotal, paymentProcessing, loading }) {
  const subtotal = getTotal()
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
          <Package className="text-emerald-600" />
          Order Summary
        </h2>

        <div className="mb-8">
          <h3 className="font-semibold text-slate-800 mb-3">Customer Information</h3>
          <p className="text-slate-700">{formData.firstName} {formData.lastName}</p>
          <p className="text-slate-700">{formData.email}</p>
          <p className="text-slate-700">+91 {formData.phone}</p>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-slate-800 mb-3">Shipping Address</h3>
          <p className="text-slate-700">{formData.address}</p>
          <p className="text-slate-700">{formData.city}, {formData.state} - {formData.pincode}</p>
        </div>

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Payment Method</h3>
          <p className="text-slate-700">
            {formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment (UPI / Card / Netbanking)'}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-white border-2 border-slate-300 text-slate-700 py-4 rounded-xl hover:border-slate-400 font-bold text-lg shadow-xl transition-all"
        >
          Back
        </button>
        <button
          onClick={placeOrder}
          disabled={loading || paymentProcessing}
          className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform"
        >
          {paymentProcessing ? 'Processing Payment...' : loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

// Right Side Order Summary (fixed)
function FixedOrderSummary({ cart, getTotal }) {
  const subtotal = getTotal()
  const shipping = subtotal > 500 ? 0 : 50
  const total = subtotal + shipping

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-24">
      <h2 className="text-xl font-bold mb-4 text-slate-900">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        {cart.map((item, index) => {
          const price = item.product.discount_price || item.product.price
          return (
            <div key={index} className="flex justify-between text-slate-700 border-b border-slate-100 pb-3">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">₹{price * item.quantity}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-3 text-slate-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'text-emerald-700 font-semibold' : ''}>
            {shipping === 0 ? 'Free' : `₹${shipping}`}
          </span>
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-emerald-700">₹{total}</span>
        </div>
      </div>
    </div>
  )
}

// Main Checkout Component
function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  })

  // Load existing order data if available (for editing)
  useEffect(() => {
    const savedOrder = sessionStorage.getItem('pendingOrder')
    if (savedOrder) {
      const orderData = JSON.parse(savedOrder)
      setFormData({
        firstName: orderData.customer.firstName,
        lastName: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone,
        address: orderData.shipping_address.address,
        city: orderData.shipping_address.city,
        state: orderData.shipping_address.state,
        pincode: orderData.shipping_address.pincode,
        paymentMethod: orderData.payment_method || 'cod'
      })
    }
  }, [])

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      // Smooth scroll to top when step changes
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/cart')
    }
    // Smooth scroll to top when step changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const placeOrder = async () => {
    if (formData.paymentMethod === 'razorpay') {
      await handleOnlinePayment()
    } else {
      await submitOrder()
    }
  }

  const handleOnlinePayment = async () => {
    setPaymentProcessing(true)
    try {
      // Simulate payment processing
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
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        })),
        shipping_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        billing_address: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        payment_method: formData.paymentMethod
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

  // Step indicator
  const steps = [
    { id: 1, label: 'Shipping Address', icon: MapPin },
    { id: 2, label: 'Payment', icon: CreditCard },
    { id: 3, label: 'Order Summary', icon: Package }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={prevStep} className="mb-1 flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors font-medium">
          <ArrowLeft size={20} />
          {currentStep === 1 ? 'Back to Cart' : 'Back'}
        </button>

        {/* Step Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.id
            const isActive = currentStep === step.id

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                      isCompleted ? 'bg-emerald-600 text-white' : isActive ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={`text-xs mt-1 font-semibold ${
                    isActive ? 'text-emerald-700' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 md:w-32 ${isCompleted ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Steps */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 1 && (
              <Step1Address
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
              />
            )}
            {currentStep === 2 && (
              <Step2Payment
                formData={formData}
                setFormData={setFormData}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            )}
            {currentStep === 3 && (
              <Step3Summary
                formData={formData}
                setFormData={setFormData}
                placeOrder={placeOrder}
                prevStep={prevStep}
                cart={cart}
                getTotal={getTotal}
                paymentProcessing={paymentProcessing}
                loading={loading}
              />
            )}
          </div>

          {/* Right Side: Fixed Order Summary */}
          <div>
            <FixedOrderSummary cart={cart} getTotal={getTotal} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
