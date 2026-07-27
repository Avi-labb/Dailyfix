import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getProductImageSrc } from '../utils/productImages';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  CreditCard,
  Package,
  ShoppingBag,
  MapPin,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Truck,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const statesOfIndia = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Lakshadweep',
  'Delhi', 'Puducherry'
];

const phonePattern = /^[6-9]\d{9}$/;
const pincodePattern = /^[1-9][0-9]{5}$/;

const paymentMethods = [
  { id: 'online', name: 'Online Payment', description: 'Pay using UPI, Credit/Debit Card, or Net Banking', icon: CreditCard },
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: Package }
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Step1AddressSummary({ register, errors, touchedFields, watchedPhone, watchedPincode, selectedPayment, setSelectedPayment }) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-soft border border-stone-100 p-8"
      >
        <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <MapPin className="text-emerald-600" />
          Shipping Address
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* First Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">First Name</label>
            <input
              {...register('firstName', { required: 'First name is required', minLength: { value: 2, message: 'First name must be at least 2 characters' } })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.firstName && touchedFields.firstName
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.firstName && !errors.firstName
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && touchedFields.firstName && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.firstName.message}
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required', minLength: { value: 2, message: 'Last name must be at least 2 characters' } })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.lastName && touchedFields.lastName
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.lastName && !errors.lastName
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && touchedFields.lastName && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
              })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.email && touchedFields.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.email && !errors.email
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              placeholder="you@email.com"
            />
            {errors.email && touchedFields.email && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Phone Number</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-600 font-semibold">+91</span>
              <input
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: { value: phonePattern, message: 'Please enter a valid 10-digit mobile number starting with 6-9' }
                })}
                className={`w-full border-2 rounded-2xl pl-16 pr-5 py-4 outline-none transition-all duration-300 ${
                  errors.phone && touchedFields.phone
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : touchedFields.phone && !errors.phone
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                    : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                }`}
                placeholder="10-digit mobile number"
                maxLength={10}
                onInput={(e) => (e.target.value = e.target.value.replace(/[^\d]/g, ''))}
              />
              {touchedFields.phone && (
                <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  {!errors.phone && watchedPhone?.length === 10 && <CheckCircle size={20} className="text-emerald-500" />}
                </div>
              )}
            </div>
            {errors.phone && touchedFields.phone && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.phone.message}
              </span>
            )}
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-6 mb-10">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-stone-700">Complete Address</label>
            <textarea
              {...register('address', { required: 'Address is required', minLength: { value: 10, message: 'Address must be at least 10 characters' } })}
              className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                errors.address && touchedFields.address
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                  : touchedFields.address && !errors.address
                  ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
              }`}
              rows={3}
              placeholder="House number, street, landmark, etc."
            />
            {errors.address && touchedFields.address && (
              <span className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.address.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">City</label>
              <input
                {...register('city', { required: 'City is required', minLength: { value: 2, message: 'City name must be at least 2 characters' } })}
                className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                  errors.city && touchedFields.city
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : touchedFields.city && !errors.city
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                    : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                }`}
                placeholder="Your city"
              />
              {errors.city && touchedFields.city && (
                <span className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.city.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">State</label>
              <select
                {...register('state', { required: 'State is required' })}
                className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 bg-white ${
                  errors.state && touchedFields.state
                    ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                    : touchedFields.state && !errors.state
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                    : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                }`}
              >
                <option value="">Select your state</option>
                {statesOfIndia.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && touchedFields.state && (
                <span className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.state.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-stone-700">Pincode</label>
              <div className="relative">
                <input
                  type="text"
                  {...register('pincode', {
                    required: 'Pincode is required',
                    pattern: { value: pincodePattern, message: 'Please enter a valid 6-digit pincode' }
                  })}
                  className={`w-full border-2 rounded-2xl px-5 py-4 outline-none transition-all duration-300 ${
                    errors.pincode && touchedFields.pincode
                      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50'
                      : touchedFields.pincode && !errors.pincode
                      ? 'border-emerald-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                      : 'border-stone-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50'
                  }`}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  onInput={(e) => (e.target.value = e.target.value.replace(/[^\d]/g, ''))}
                />
                {touchedFields.pincode && (
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {!errors.pincode && watchedPincode?.length === 6 && <CheckCircle size={20} className="text-emerald-500" />}
                  </div>
                )}
              </div>
              {errors.pincode && touchedFields.pincode && (
                <span className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.pincode.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
            <CreditCard className="text-emerald-600" />
            Payment Method
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedPayment === method.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-soft'
                      : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        selectedPayment === method.id ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      <IconComponent size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-stone-900">{method.name}</h3>
                      <p className="text-sm text-stone-600 mt-1">{method.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedPayment === method.id ? 'border-emerald-500' : 'border-stone-300'
                      }`}
                    >
                      {selectedPayment === method.id && <div className="w-3 h-3 rounded-full bg-emerald-500" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FixedOrderSummary({ cart, getTotal }) {
  const subtotal = getTotal();
  const shipping = 0;
  const total = subtotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white p-8 rounded-3xl shadow-soft border border-stone-100 lg:sticky lg:top-28"
    >
      <h2 className="text-2xl font-bold text-stone-900 mb-8">Order Summary</h2>

      <div className="space-y-6 mb-8">
        {cart.map((item, index) => {
          const price = item.product.price;
          return (
            <div key={index} className="flex items-center justify-between text-stone-700 pb-6 border-b border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center">
                  <img
                    src={getProductImageSrc(item.product)}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{item.product.name}</p>
                  <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-stone-900">₹{price * item.quantity}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 text-stone-700 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Subtotal</span>
          <span className="text-lg font-semibold text-stone-900">₹{subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium">Shipping</span>
          <span className="text-emerald-700 font-semibold text-lg">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
        </div>
        <div className="pt-6 border-t border-stone-200 flex items-center justify-between font-bold">
          <span className="text-xl text-stone-900">Total</span>
          <span className="text-3xl text-emerald-700">₹{total}</span>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-stone-100">
        <div className="flex items-center gap-3 text-stone-600">
          <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
        <div className="flex items-center gap-3 text-stone-600">
          <Truck size={18} className="text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">Free & Fast Shipping</span>
        </div>
        <div className="flex items-center gap-3 text-stone-600">
          <Lock size={18} className="text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium">100% Secure Checkout</span>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutPage() {
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset
  } = useForm({
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: formData
  });

  const watchedPhone = watch('phone', '');
  const watchedPincode = watch('pincode', '');

  useEffect(() => {
    const savedOrder = sessionStorage.getItem('pendingOrder');
    if (savedOrder) {
      const orderData = JSON.parse(savedOrder);
      const shippingData = orderData.shippingAddress || orderData.shipping_address;
      const initialVals = {
        firstName: orderData.customer?.firstName || '',
        lastName: orderData.customer?.lastName || '',
        email: orderData.customer?.email || '',
        phone: orderData.customer?.phone || '',
        address: shippingData?.address || '',
        city: shippingData?.city || '',
        state: shippingData?.state || '',
        pincode: shippingData?.pincode || ''
      };
      setFormData(initialVals);
      reset(initialVals);
    }
  }, [reset]);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const goBack = () => {
    navigate('/cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = async (data) => {
    const currentData = data || formData;
    setFormData(currentData);

    if (selectedPayment === 'online') {
      await handleOnlinePayment(currentData);
    } else {
      await submitOrder(currentData);
    }
  };

  // Online Payment Flow (Razorpay)
  const handleOnlinePayment = async (data) => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Failed to load payment gateway SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const { data: gatewayData } = await api.post('/create-razorpay-order', {
        amount: getTotal(),
        currency: 'INR'
      });

      const options = {
        key: gatewayData.keyId,
        amount: gatewayData.amount,
        currency: gatewayData.currency,
        name: 'Your Store Name',
        description: 'Purchase Payment',
        order_id: gatewayData.razorpayOrderId,
        handler: async function (response) {
          try {
            const res = await api.post('/orders', {
              customer: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone
              },
              items: cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity
              })),
              shippingAddress: {
                address: data.address,
                city: data.city,
                state: data.state,
                pincode: data.pincode
              },
              paymentMethod: 'online',
              paymentDetails: {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              }
            });

            clearCart();
            sessionStorage.removeItem('pendingOrder');
            toast.success('Payment successful!');
            navigate(`/order-success/${res.data.order.orderId}`);
          } catch (err) {
            toast.error('Payment verification failed. Please contact support if debited.');
          }
        },
        prefill: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: '#059669'
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        toast.error(response.error?.description || 'Payment failed. Please try again.');
      });
      razorpayInstance.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  // COD Flow
  const submitOrder = async (data) => {
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        customer: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone
        },
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: {
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        },
        paymentMethod: 'cod'
      });

      clearCart();
      sessionStorage.removeItem('pendingOrder');
      toast.success('Order placed successfully!');
      navigate(`/order-success/${res.data.order.orderId}`);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50 pt-28 pb-20 px-6 md:px-12">
      <div className="max-w-9xl mx-auto -mt-20">
        <button
          onClick={goBack}
          className="mb-8 flex items-center gap-2 text-stone-600 hover:text-emerald-600 transition-colors font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Cart
        </button>

        <form onSubmit={handleSubmit(placeOrder)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Form & Address Details */}
            <div className="lg:col-span-2 space-y-8">
              <Step1AddressSummary
                register={register}
                errors={errors}
                touchedFields={touchedFields}
                watchedPhone={watchedPhone}
                watchedPincode={watchedPincode}
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
              />

              {/* Desktop Place Order Button (hidden on mobile) */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-soft hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      {selectedPayment === 'online' ? 'Proceed to Payment' : 'Place Order'}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Order Summary & Mobile Submit Button */}
            <div className="space-y-8">
              <FixedOrderSummary cart={cart} getTotal={getTotal} />

              {/* Mobile Place Order Button (renders under Order Summary on mobile) */}
              <div className="block lg:hidden">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-soft hover:shadow-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      {selectedPayment === 'online' ? 'Proceed to Payment' : 'Place Order'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;