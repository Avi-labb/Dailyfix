import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Zap, Leaf, ShieldCheck, Truck, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../services/api';

// Import all product images
// Natural Black
import nb1 from '../assets/images/NATURAL BLACK/01.png';
import nb2 from '../assets/images/NATURAL BLACK/02.png';
import nb3 from '../assets/images/NATURAL BLACK/03.png';
import nb4 from '../assets/images/NATURAL BLACK/04.png';
import nb5 from '../assets/images/NATURAL BLACK/05.jpg';
import nb6 from '../assets/images/NATURAL BLACK/06.jpg';

// Black Brown
import bb1 from '../assets/images/02 BLACK BROWN/01.png';
import bb2 from '../assets/images/02 BLACK BROWN/02.png';
import bb3 from '../assets/images/02 BLACK BROWN/03.png';
import bb4 from '../assets/images/02 BLACK BROWN/04.png';
import bb5 from '../assets/images/02 BLACK BROWN/05.jpg';
import bb6 from '../assets/images/02 BLACK BROWN/06.jpg';

// Dark Brown
import db1 from '../assets/images/DARK BROWN/01.png';
import db2 from '../assets/images/DARK BROWN/02.png';
import db3 from '../assets/images/DARK BROWN/03.png';
import db4 from '../assets/images/DARK BROWN/04.png';
import db5 from '../assets/images/DARK BROWN/05.jpg';
import db6 from '../assets/images/DARK BROWN/06.jpg';

const productImageMap = {
  'natural-black': [nb1, nb2, nb3, nb4, nb5, nb6],
  'black-brown': [bb1, bb2, bb3, bb4, bb5, bb6],
  'dark-brown': [db1, db2, db3, db4, db5, db6]
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const apiProduct = res.data;
        const mappedProduct = {
          id: apiProduct._id,
          name: apiProduct.name,
          desc: 'Ammonia-Free Formula',
          price: apiProduct.price,
          images: productImageMap[apiProduct.slug] || productImageMap['natural-black'],
          slug: apiProduct.slug,
          sku: apiProduct.sku,
          brand: apiProduct.brand,
          stock: apiProduct.stock,
          description: apiProduct.description
        };
        setProduct(mappedProduct);
        setCurrentImageIndex(0);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => {
    if (!product) return;
    setQuantity((q) => Math.min(product.stock, q + 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ecfdf5' }}>
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500 mb-4"></div>
          <p className="text-stone-600 text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ecfdf5' }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-stone-800 mb-4">Product not found</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-stone-50">
      <div className="max-w-9xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT: Image gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-6 lg:gap-8 lg:sticky lg:top-28 lg:self-start">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-visible sm:w-24">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 p-3 rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    borderWidth: '2px',
                    borderColor: index === currentImageIndex ? '#10b981' : 'transparent',
                    backgroundColor: index === currentImageIndex ? '#ecfdf5' : '#f5f5f4'
                  }}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Main image with hover-zoom + click-to-expand */}
            <div className="flex-1 relative">
              <div
                ref={imageRef}
                className="aspect-square rounded-3xl overflow-hidden relative border cursor-zoom-in group"
                style={{ backgroundColor: '#ecfdf5', borderColor: '#d1fae5' }}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  draggable={false}
                />

                {/* Zoom lens preview */}
                {showZoom && (
                  <div
                    className="hidden lg:block absolute inset-0 pointer-events-none rounded-3xl"
                    style={{
                      backgroundImage: `url(${product.images[currentImageIndex]})`,
                      backgroundSize: '220%',
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                )}

                {/* Expand hint */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: 'rgba(35, 31, 28, 0.8)', color: '#FAF7F2' }}>
                    Click to expand
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-8"
          >
            <div>
              <p className="text-xs tracking-widest uppercase font-semibold text-emerald-600 mb-4 flex items-center gap-2">
                {product.brand}
                <span className="w-1 h-1 bg-emerald-600 rounded-full"></span>
                {product.desc}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-stone-500 mt-4 text-lg">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-extrabold text-emerald-600">
                ₹{product.price}
              </span>
              {product.stock > 0 && (
                <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                  In Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-stone-600 text-lg leading-relaxed">
                {product.description}
              </p>
              <p className="text-stone-500 leading-relaxed">
                Premium grooming product designed specifically for men. Easy to use and long-lasting results.
              </p>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Leaf, label: 'Ammonia-free', desc: 'Gentle formula' },
                { icon: ShieldCheck, label: 'Dermatologist tested', desc: 'Safe for skin' },
                { icon: Truck, label: 'Fast delivery', desc: 'Discreet packaging' },
              ].map(({ icon: Icon, label, desc }, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 text-center py-6 px-4 rounded-2xl border border-emerald-100 bg-emerald-50"
                >
                  <Icon size={24} className="text-emerald-600" />
                  <p className="font-semibold text-stone-900 text-sm">{label}</p>
                  <p className="text-xs text-stone-500">{desc}</p>
                </div>
              ))}
            </div>

            {/* Quantity selector */}
            <div className="space-y-4">
              <span className="text-sm font-semibold text-stone-900">Quantity</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl border overflow-hidden" style={{ borderColor: '#a7f3d0' }}>
                  <button
                    onClick={decrement}
                    className="w-14 h-14 flex items-center justify-center hover:bg-emerald-50 transition-colors text-emerald-700"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={20} strokeWidth={2.5} />
                  </button>
                  <span className="w-16 text-center font-bold text-xl text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    className="w-14 h-14 flex items-center justify-center hover:bg-emerald-50 transition-colors text-emerald-700"
                    aria-label="Increase quantity"
                  >
                    <Plus size={20} strokeWidth={2.5} />
                  </button>
                </div>
                <p className="text-sm text-stone-500">{product.stock} available</p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 rounded-2xl font-bold py-5 px-6 border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: '#10b981',
                  color: '#065f46',
                  backgroundColor: 'transparent',
                  ...(addedToCart ? { backgroundColor: '#10b981', color: 'white', borderColor: '#10b981' } : {})
                }}
                onMouseOver={(e) => !addedToCart && (e.currentTarget.style.backgroundColor = '#065f46', e.currentTarget.style.color = 'white')}
                onMouseOut={(e) => !addedToCart && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = '#065f46')}
              >
                <ShoppingBag size={20} />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 rounded-2xl font-bold py-5 px-6 transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-medium"
                style={{ backgroundColor: '#10b981', color: 'white' }}
              >
                <Zap size={20} fill="currentColor" />
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox / click-to-expand modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone-900/95 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-stone-800" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors shadow-soft"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} className="text-stone-800" />
          </button>

          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-white hover:bg-stone-100 transition-colors shadow-soft"
            aria-label="Next image"
          >
            <ChevronRight size={24} className="text-stone-800" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
