import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, CheckCircle, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../assets/images/dailyfix new logo.png';

const Navbar = () => {
  const location = useLocation();
  const { cart, getItemCount, lastAddedProduct, setLastAddedProduct } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);

  useEffect(() => {
    if (lastAddedProduct) {
      setShowCartPopup(true);
      const timer = setTimeout(() => {
        setShowCartPopup(false);
        setLastAddedProduct(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAddedProduct, setLastAddedProduct]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Beard Colour', path: '/shop' },
    { label: 'About Us', path: '/about' },
    { label: 'Blog', path: '/blog' }
  ];

  const getActiveClass = (path) => {
    return location.pathname === path 
      ? 'text-emerald-600' 
      : 'text-white hover:text-emerald-400';
  };

  return (
    <>
    <header class="fixed top-0 left-0 right-0 z-[9999] py-3 sm:py-4 px-8 md:px-16 bg-black/70 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Dailyfix"
              className="h-8 md:h-10 w-auto"
            />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`text-base font-semibold uppercase ${getActiveClass(item.path)} transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cart" className="relative text-white hover:text-emerald-400 transition-colors">
              <ShoppingCart className="w-7 h-7" />
              <AnimatePresence>
                {getItemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    {getItemCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link 
              to="/contact" 
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold px-8 py-3 rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all transform hover:scale-105 shadow-lg"
            >
              Contact Us
            </Link>
          </div>
          
          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-white">
              <ShoppingCart className="w-7 h-7" />
              <AnimatePresence>
                {getItemCount() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full"
                  >
                    {getItemCount()}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900/98 backdrop-blur-xl absolute top-full left-0 right-0 py-10 px-8 shadow-2xl"
            >
              <nav className="flex flex-col space-y-6">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-semibold text-white hover:text-emerald-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link 
                  to="/cart" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-semibold text-white hover:text-emerald-400 transition-colors flex items-center gap-3"
                >
                  Cart
                  {getItemCount() > 0 && (
                    <span className="bg-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {getItemCount()}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer so content doesn't go under navbar */}
      <div className="h-24"></div>
      
      {/* Cart Popup / Add to Cart Notification */}
      <AnimatePresence>
        {showCartPopup && lastAddedProduct && (
          <motion.div
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-28 right-4 z-[10000] max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img
                  src={lastAddedProduct.product.images ? lastAddedProduct.product.images[0] : lastAddedProduct.product.image}
                  alt={lastAddedProduct.product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-gray-800">Item Added</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {lastAddedProduct.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  Quantity: {lastAddedProduct.quantity}
                </p>
                <p className="text-sm font-bold text-emerald-600 mt-1">
                  ₹{(lastAddedProduct.product.discount_price || lastAddedProduct.product.price) * lastAddedProduct.quantity}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCartPopup(false)
                  setLastAddedProduct(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
