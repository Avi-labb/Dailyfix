import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Zap, Leaf, ShieldCheck, Truck, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

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

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const imageRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  const products = [
    {
      id: 1,
      name: "Men's Beard Colour (Natural Black)",
      desc: "Ammonia-Free Formula",
      price: 450,
      images: [nb1, nb2, nb3, nb4, nb5, nb6],
      slug: 'natural-black',
      sku: 'DF-NB-001',
      brand: 'Dailyfix',
      stock: 100,
      description: "Our Natural Black Beard Colour gives you a perfect, natural-looking black shade. Formulated without ammonia, it's gentle on your skin and beard."
    },
    {
      id: 2,
      name: "Men's Beard Colour (Black Brown)",
      desc: "Ammonia-Free Formula",
      price: 450,
      images: [bb1, bb2, bb3, bb4, bb5, bb6],
      slug: 'black-brown',
      sku: 'DF-BB-002',
      brand: 'Dailyfix',
      stock: 100,
      description: "Our Black Brown Beard Colour provides a rich, warm brownish-black hue. Perfect for a natural, distinguished look."
    },
    {
      id: 3,
      name: "Men's Beard Colour (Dark Brown)",
      desc: "Ammonia-Free Formula",
      price: 450,
      images: [db1, db2, db3, db4, db5, db6],
      slug: 'dark-brown',
      sku: 'DF-DB-003',
      brand: 'Dailyfix',
      stock: 100,
      description: "Our Dark Brown Beard Colour offers a classic, deep brown shade. Blends seamlessly for a natural, well-groomed appearance."
    }
  ];

  const product = products.find(p =>
    p.id.toString() === id || p.slug === id
  ) || products[0];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const decrement = () => setQuantity((q) => Math.max(1, q - 1));
  const increment = () => setQuantity((q) => Math.min(product.stock, q + 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <div className="min-h-screen -mt-10" style={{ backgroundColor: '#f0fdf4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Inter:wght@400;500;600;700&display=swap');
        .pp-display { font-family: 'Bricolage Grotesque', 'Helvetica Neue', sans-serif; }
        .pp-body { font-family: 'Inter', -apple-system, sans-serif; }
        .pp-zoom-cursor { cursor: zoom-in; }
        @media (prefers-reduced-motion: reduce) {
          .pp-transition { transition: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-10 lg:py-10">
        {/* Breadcrumb-ish eyebrow */}
        <div className="pp-body text-xs tracking-widest uppercase mb-8 flex items-center gap-2" style={{ color: '#64748b' }}>
          <span>{product.brand}</span>
          <span>/</span>
          <span style={{ color: '#065f46' }}>{product.desc}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* LEFT: Image gallery */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-10 lg:self-start">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible sm:w-20">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className=" w-16 h-16 sm:w-20 sm:h-20 p-1 rounded-lg overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: index === currentImageIndex ? '#10b981' : 'transparent',
                    backgroundColor: '#ecfdf5'
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
                className="pp-zoom-cursor aspect-square rounded-2xl overflow-hidden relative border p-3"
                style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  draggable={false}
                />

                {/* Zoom lens preview */}
                {showZoom && (
                  <div
                    className="hidden lg:block absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${product.images[currentImageIndex]})`,
                      backgroundSize: '220%',
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}

                {/* Expand hint */}
                <div
                  className="pp-body absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium pointer-events-none"
                  style={{ backgroundColor: 'rgba(35,31,28,0.75)', color: '#FAF7F2' }}
                >
                  Click to expand
                </div>

              </div>


            </div>
          </div>

          {/* RIGHT: Product details */}
          <div className="flex flex-col gap-7">
            <div>
              <h1 className="pp-display text-3xl md:text-[2.75rem] leading-[1.05] font-bold" style={{ color: '#0f172a' }}>
                {product.name}
              </h1>
              <p className="pp-body mt-2 text-sm" style={{ color: '#64748b' }}>
                SKU {product.sku} &middot; by {product.brand}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="pp-display text-4xl font-extrabold" style={{ color: '#065f46' }}>
                ₹{product.price}
              </span>
            </div>

            {/* Description */}
            <p className="pp-body text-base leading-relaxed" style={{ color: '#475569' }}>
              {product.description}
            </p>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Leaf, label: 'Ammonia-free' },
                { icon: ShieldCheck, label: 'Dermatologist tested' },
                { icon: Truck, label: 'Fast delivery' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="pp-body flex flex-col items-center gap-1.5 text-center text-xs font-medium rounded-xl py-3 px-2"
                  style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}
                >
                  <Icon size={18} strokeWidth={2} />
                  {label}
                </div>
              ))}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4">
              <span className="pp-body text-sm font-semibold" style={{ color: '#0f172a' }}>Quantity</span>
              <div
                className="flex items-center rounded-full border overflow-hidden"
                style={{ borderColor: '#a7f3d0' }}
              >
                <button
                  onClick={decrement}
                  className="pp-transition w-10 h-10 flex items-center justify-center hover:bg-[#ecfdf5]"
                  style={{ color: '#065f46' }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="pp-body w-10 text-center font-semibold" style={{ color: '#0f172a' }}>
                  {quantity}
                </span>
                <button
                  onClick={increment}
                  className="pp-transition w-10 h-10 flex items-center justify-center hover:bg-[#ecfdf5]"
                  style={{ color: '#065f46' }}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-1">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="pp-body pp-transition flex-1 flex items-center justify-center gap-2 rounded-full font-semibold py-4 px-6 border-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#065f46] hover:text-white"
                style={{ borderColor: '#10b981', color: '#065f46', backgroundColor: 'transparent' }}
              >
                <ShoppingBag size={18} />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
                className="pp-body pp-transition flex-1 flex items-center justify-center gap-2 rounded-full font-semibold py-4 px-6 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: '#10b981', color: 'white' }}
              >
                <Zap size={18} />
                Buy Now
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox / click-to-expand modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(35,31,28,0.92)' }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>

          <img
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
