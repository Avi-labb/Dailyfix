import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Trash2, ShoppingCart, Minus, Plus, X, Check } from 'lucide-react'
import { useState } from 'react'

function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart()
  const navigate = useNavigate()
  const [itemToRemove, setItemToRemove] = useState(null)

  if (cart.length === 0) {
    return (
      <div className="min-h-screen -mt-10  py-20 px-8 md:px-16 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-9xl mx-auto text-center mt-20">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-700 text-white px-8 py-3 rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 shadow-lg"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const handleRemove = (productId) => {
    removeFromCart(productId)
    setItemToRemove(null)
  }

  return (
    <div className="min-h-screen -mt-20 py-20 px-8 md:px-16 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-9xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-slate-800 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.productId} className="flex gap-6 p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-50 to-white rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-100">
                  <img
                    src={item.product.images ? item.product.images[0] : item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 mb-1">{item.product.name}</h3>
                    <p className="text-sm text-slate-500">SKU: {item.product.sku}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-6 py-2 font-semibold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-4 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => setItemToRemove(item.productId)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-2 text-sm font-semibold"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                    <p className="text-xl font-bold text-emerald-600">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 sticky top-28">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="text-lg flex font-medium justify-between items-center">
                  <span className="text-slate-700">Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{getTotal()}</span>
                </div>
                <div className="text-lg  font-medium flex justify-between items-center">
                  <span className="text-slate-700">Shipping</span>
                  <span className="text-emerald-700 font-semibold">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-xl font-bold text-slate-800">Total</span>
                  <span className="text-2xl font-bold text-emerald-700">
                    ₹{Math.round(getTotal() )}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  // Clear any existing pending order when starting a new checkout
                  sessionStorage.removeItem('pendingOrder')
                  navigate('/checkout')
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-4 px-6 rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {itemToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">Remove Item</h3>
              <button
                onClick={() => setItemToRemove(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-slate-600 mb-8">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setItemToRemove(null)}
                className="flex-1 py-3 px-6 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(itemToRemove)}
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Check size={18} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage
