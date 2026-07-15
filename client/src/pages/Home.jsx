import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Play, Clock, Droplets, Shield, Sparkles, CheckCircle2, Box } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import banner from '../assets/images/webbanner3.png';
import mobileBanner from '../assets/images/Dailyfix with Updated Box Design1.png';
import poster from '../assets/images/poster.png';
import product1 from '../assets/images/001 Natural black1.png';
import product2 from '../assets/images/002 Brown black2.png';
import product3 from '../assets/images/003 Drak brown3.png';
import banners from '../assets/images/2.jpg.jpeg';
import api from '../services/api';

const productImageMap = {
  'natural-black': product1,
  'black-brown': product2,
  'dark-brown': product3
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const mappedProducts = res.data.products.map((product) => ({
          id: product._id,
          name: product.name,
          desc: 'Ammonia-Free Formula',
          price: product.price,
          image: productImageMap[product.slug] || product1,
          slug: product.slug,
          sku: product.sku,
          brand: product.brand,
          stock: product.stock
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const benefits = [
    { icon: <Clock className="w-6 h-6 text-emerald-500" />, title: "Ammonia-Free", desc: "Gentle formula without harsh ammonia, safe for regular use" },
    { icon: <Droplets className="w-6 h-6 text-emerald-500" />, title: "Natural Ingredients", desc: "Enriched with olive oil, taurine, and natural extracts" },
    { icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />, title: "Gray Coverage", desc: "Perfect coverage for gray hairs in beard, mustache, and sideburns" },
    { icon: <Box className="w-6 h-6 text-stone-700" />, title: "Long-Lasting", desc: "Colour that stays vibrant and lasts for weeks" },
    { icon: <Sparkles className="w-6 h-6 text-stone-700" />, title: "Natural Look", desc: "Blends seamlessly for a natural, undetectable result" },
    { icon: <Shield className="w-6 h-6 text-stone-700" />, title: "Easy to Use", desc: "Simple application process for at-home use" }
  ];

  return (
    <div className="min-h-screen -mt-20 sm:-mt-15 bg-white">
      {/* Hero Section with Banner */}
      <section className="min-h-screen pt-20 relative overflow-hidden">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0">
          {/* Mobile Banner */}
          <img
            src={mobileBanner}
            alt="Dailyfix Banner"
            className="w-full h-full object-cover object-center sm:hidden"
          />
          {/* Desktop Banner */}
          <img
            src={banner}
            alt="Dailyfix Banner"
            className="w-full h-full object-cover object-center hidden sm:block"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-9xl mx-auto px-6 sm:px-12 lg:px-10 h-[calc(100vh-5rem)] flex items-center justify-start">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-left max-w-xl"
          >
            {/* Brand Badge */}
            <div className='px-10 sm:px-20'>
              <div className="inline-flex items-center gap-2 mb-5 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-white font-bold text-xs tracking-widest uppercase">Dailyfix Grooming</p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl  mb-60 sm:mb-0  font-semibold text-white tracking-tight leading-[1.1]">
                Premium Men's <br />
                <span className="text-emerald-500">Beard Colour</span> <br />
                for a Perfect Look
              </h1>
            </div>

            {/* Call To Actions */}
            <div className="flex flex-wrap gap-4 px-10 sm:px-20">
              <Link
                to="/shop"
                className="group bg-emerald-500 text-white font-bold py-4 px-10 rounded-full hover:bg-emerald-400 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 px-4 sm:px-8 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
            {/* Left - Dynamic Image Layout */}
            <div className="lg:col-span-6 relative hidden sm:flex justify-center lg:justify-start">
              {/* Decorative background shape */}
              <div className="absolute -bottom-6 -right-6 w-72 h-82 bg-emerald-50 rounded-full filter blur-3xl opacity-70"></div>

              <div className="relative group">
                <div className="absolute inset-0 bg-stone-900/10 rounded-2xl blur-xl transform translate-x-4 translate-y-4 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                <div className="relative w-72 sm:w-80 md:w-[400px] h-[450px] bg-gradient-to-tr from-stone-200 to-stone-100 rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] z-10">
                  <img src={poster} alt="Dailyfix Poster" className="w-full h-full" />
                </div>
                <div className="absolute -bottom-12 -right-6 md:right-[-20px] bg-white p-6 rounded-xl shadow-xl border border-stone-100 max-w-[200px] z-20">
                  <p className="text-3xl font-black text-emerald-500">100%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-800 mt-1">Ammonia-Free</p>
                  <p className="text-xs text-stone-600 mt-1">Formulated with premium natural ingredients.</p>
                </div>
              </div>
            </div>

            {/* Right - Premium Typography Content */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-6 mt-12 lg:mt-0"
            >
              <div className="space-y-2">
                <span className="text-emerald-600 font-bold text-xs tracking-widest uppercase bg-emerald-50 px-3 py-1.5 rounded-full">
                  Our Philosophy
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-none pt-2">
                  Premium Grooming <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">for the Modern Man</span>
                </h2>
              </div>

              <p className="text-stone-700 text-lg leading-relaxed max-w-xl">
                Dailyfix is committed to providing high-quality grooming products that enhance your natural look. Our beard colour is formulated with natural ingredients for a safe, seamless, and effective experience.
              </p>

              <hr className="border-stone-200 my-8" />

              <div className="grid grid-cols-2 gap-8 pt-2">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-4xl font-bold text-stone-900">
                    3<span className="text-emerald-500">+</span>
                  </p>
                  <p className="text-stone-600 text-sm font-medium mt-1">Premium Shades</p>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-4xl font-bold text-stone-900">
                    0<span className="text-emerald-500">%</span>
                  </p>
                  <p className="text-stone-600 text-sm font-medium mt-1">Harsh Chemicals</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Product Showcase Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-stone-100">
        <div className="max-w-9xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100/80">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-widest uppercase">Our Products</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extralight tracking-tight text-stone-900 leading-none">
                Premium <span className="font-bold text-emerald-600">Beard Colour</span>
              </h2>
            </div>
            <div>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold tracking-wide py-4 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform active:scale-98"
              >
                Shop All Products
              </Link>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-24 text-slate-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>


<section className="min-h-screen flex flex-col lg:flex-row">
    <div className="lg:w-1/2 bg-black">
        <div className="w-full h-full min-h-[400px] lg:min-h-screen flex items-center justify-center">
            <iframe 
                className="w-full h-full min-h-[400px] lg:min-h-screen object-cover" 
                src="https://player.cloudinary.com/embed/?cloud_name=dpc9o6z8n&public_id=Untitled_design_3_b4ii2s&autoplay=true&muted=true&loop=true&logo=false" 
                title="Dailyfix Beard Colour Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen
                frameborder="0">
            </iframe>
        </div>
    </div>
    
    
    <div className="lg:w-1/2 bg-black flex items-center p-8 lg:p-16">
        <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                TRANSFORM YOUR LOOK WITH DAILYFIX
            </h2>
            <p className="text-white/70 text-lg mb-8">
                Premium beard colour made with natural ingredients for a perfect, natural-looking coverage. Ammonia-free formula designed specifically for men's grooming needs.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-3 text-white font-semibold border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all">
                Shop Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </Link>
        </div>
    </div>
</section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-9xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              BENEFITS
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Why Choose Dailyfix Beard Colour
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-6">
              {benefits.slice(0, 3).map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black mb-2">{benefit.title}</h4>
                    <p className="text-black/80 font-medium text-sm">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl overflow-hidden shadow-2xl">
                <img src={banners} alt="Dailyfix Product" className="w-full h-[450px] object-cover" />
              </div>
            </div>

            <div className="space-y-6">
              {benefits.slice(3).map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-black mb-2">{benefit.title}</h4>
                    <p className="text-black/80 font-medium text-sm">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 sm:px-8 md:px-16 bg-white relative overflow-hidden">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black absolute inset-0 opacity-90"></div>
        <div className="max-w-9xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <p className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-6 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              GET STARTED
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Ready to Transform Your Look?
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-10 max-w-2xl mx-auto">
              Experience the difference with Dailyfix Men's Beard Colour. Achieve a natural, well-groomed look with our ammonia-free formula.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/shop"
                className="bg-emerald-500 text-white font-semibold py-4 px-8 rounded-full hover:scale-105 transition-transform shadow-2xl inline-block"
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="bg-white/10 border border-white/30 text-white font-semibold py-4 px-8 rounded-full hover:scale-105 transition-transform flex items-center gap-2 inline-block backdrop-blur-md"
              >
                <Play className="w-5 h-5" />
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
