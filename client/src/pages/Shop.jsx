import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Leaf, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import product1 from '../assets/images/001 Natural black1.png';
import product2 from '../assets/images/002 Brown black2.png';
import product3 from '../assets/images/003 Drak brown3.png';

const TRUST_POINTS = [
  { icon: Leaf, label: 'Ammonia-Free Formula' },
  { icon: ShieldCheck, label: 'Dermatologically Tested' },
  { icon: Truck, label: 'Fast, Discreet Shipping' },
];

const Shop = () => {
  const shouldReduceMotion = useReducedMotion();

  const products = [
    { 
      id: 1, 
      name: "Men's Beard Colour (Natural Black)", 
      desc: "Ammonia-Free Formula", 
      price: 450, 
      discount_price: null, 
      image: product1,
      slug: 'natural-black',
      sku: 'DF-NB-001',
      brand: 'Dailyfix',
      category_id: 1,
      stock: 100,
      featured: true,
      best_seller: true,
      new_arrival: true,
      rating: 4.8,
      reviews_count: 150
    },
    { 
      id: 2, 
      name: "Men's Beard Colour (Black Brown)", 
      desc: "Ammonia-Free Formula", 
      price: 450, 
      discount_price: null, 
      image: product2,
      slug: 'black-brown',
      sku: 'DF-BB-002',
      brand: 'Dailyfix',
      category_id: 1,
      stock: 100,
      featured: true,
      best_seller: true,
      new_arrival: true,
      rating: 4.7,
      reviews_count: 120
    },
    { 
      id: 3, 
      name: "Men's Beard Colour (Dark Brown)", 
      desc: "Ammonia-Free Formula", 
      price: 450, 
      discount_price: null, 
      image: product3,
      slug: 'dark-brown',
      sku: 'DF-DB-003',
      brand: 'Dailyfix',
      category_id: 1,
      stock: 100,
      featured: true,
      best_seller: true,
      new_arrival: true,
      rating: 4.6,
      reviews_count: 100
    }
  ];

  // Helper for consistent, motion-safe fade-up entrances in the hero
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <div className="min-h-screen -mt-20 bg-stone-50">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-emerald-100">
        <div
          aria-hidden="true"
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-emerald-200/40 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-14 text-center">
          <motion.p
            {...fadeUp(0)}
            className="text-xs md:text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase mb-4"
          >
            Dailyfix Grooming
          </motion.p>

          <motion.h1
            {...fadeUp(0.05)}
            className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-4"
          >
            Beard Colour, Done Right
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto"
          >
            Three natural shades. Zero ammonia. A grey-free beard that still feels like yours.
          </motion.p>

          {/* Trust strip */}
          <motion.div
            {...fadeUp(0.18)}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {TRUST_POINTS.map(({ icon: Icon, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="hidden sm:block w-px h-4 bg-slate-300" aria-hidden="true" />}
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Icon size={16} className="text-emerald-600" />
                  {label}
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-8xl mx-auto px-6 md:px-12 py-16 border border-slate-400">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">All Shades</h2>
          <span className="text-sm text-slate-500">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            No products available right now — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: Math.min(index * 0.1, 0.4) }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                className='border border-slate-300 rounded-xl'
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Shop;
