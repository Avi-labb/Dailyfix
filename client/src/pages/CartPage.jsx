import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, Minus, Plus, X, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();
  const [itemToRemove, setItemToRemove] = useState(null);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen -mt-20 pt-32 pb-20 px-6 md:px-12 bg-gradient-to-br from-emerald-50 to-stone-50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingCart size={80} className="mx-auto text-stone-300 mb-8" />
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Your cart is empty</h2>
            <p className="text-stone-600 text-lg mb-10">Add some products to get started!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-5 px-10 rounded-full shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={20} />
              Back to Shop
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setItemToRemove(null);
  };

  return (
    <div className="min-h-screen -mt-20 pt-32 pb-20 px-6 md:px-12 bg-gradient-to-br from-emerald-50 to-stone-50">
      <div className="max-w-9xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-stone-900">Shopping Cart</h1>
              <p className="text-stone-500 mt-2">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6 p-8 bg-white rounded-3xl shadow-soft border border-stone-100 hover:shadow-medium transition-all duration-300"
                >
                  <div className="w-36 h-36 bg-gradient-to-br from-emerald-50 to-stone-50 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-stone-100">
                    <img
                      src={item.product.images ? item.product.images[0] : item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          to={`/product/${item.product.slug || item.product.id}`}
                          className="text-xl font-bold text-stone-900 hover:text-emerald-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                      </div>
                      <p className="text-sm text-stone-500 mt-1">SKU: {item.product.sku}</p>
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-2xl border border-stone-200 overflow-hidden bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors text-stone-600 hover:text-emerald-600"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="w-14 text-center font-bold text-lg text-stone-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center hover:bg-white transition-colors text-stone-600 hover:text-emerald-600"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <button
                          onClick={() => setItemToRemove(item.productId)}
                          className="text-red-500 hover:text-red-600 flex items-center gap-2 text-sm font-semibold transition-colors"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                      <p className="text-2xl font-bold text-emerald-600">
                        ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white p-8 rounded-3xl shadow-soft border border-stone-100 sticky top-28">
                <h2 className="text-2xl font-bold text-stone-900 mb-8">Order Summary</h2>
                
                <div className="space-y-6 mb-8">
                  {cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center">
                          <img
                            src={item.product.images ? item.product.images[0] : item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-stone-700">{item.product.name}</p>
                          <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-stone-900">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 text-stone-700 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Subtotal</span>
                    <span className="text-lg font-semibold text-stone-900">₹{getTotal()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Shipping</span>
                    <span className="text-emerald-700 font-semibold text-lg">Free</span>
                  </div>
                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xl font-bold text-stone-900">Total</span>
                    <span className="text-3xl font-extrabold text-emerald-700">
                      ₹{Math.round(getTotal())}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    // Clear any existing pending order when starting a new checkout
                    sessionStorage.removeItem('pendingOrder');
                    navigate('/checkout');
                  }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-5 px-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Remove Confirmation Modal */}
      {itemToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-10 max-w-md w-full shadow-hard"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-stone-900">Remove Item</h3>
              <button
                onClick={() => setItemToRemove(null)}
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-stone-600 mb-10 text-lg">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setItemToRemove(null)}
                className="flex-1 py-4 px-6 rounded-2xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(itemToRemove)}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Remove
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
