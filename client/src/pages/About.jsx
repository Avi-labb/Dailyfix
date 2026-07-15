import React from 'react';
import banner from '../assets/images/dailyfixbannerforwebside.png';
import productBox from '../assets/images/Dailyfix with Updated Box Design1.png';
import naturalBlack from '../assets/images/NATURAL BLACK/01.png';
import blackBrown from '../assets/images/02 BLACK BROWN/01.png';
import darkBrown from '../assets/images/DARK BROWN/01.png';
import productOnly from '../assets/images/Dailyfix Beard Colour Product Only.png';
import threeProducts from '../assets/images/three.png';
import poster from '../assets/images/poster.png';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-8 md:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <img src={banner} alt="Dailyfix Banner" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-9xl mx-auto text-center z-10">
          <p className="text-emerald-500 font-semibold text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6">
            About Us
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Premium Grooming for the Modern Man
          </h1>
        </div>
      </section>
      
      {/* About Content Section 1 */}
      <section className="py-12 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 p-2 md:p-4">
            {/* Hidden Image Container - Visible on md screens and up */}
            <div className="hidden md:block relative w-full max-w-md mx-auto lg:max-w-none">
              <div className="absolute -left-4 -top-4 w-full h-full bg-emerald-500/20 rounded-3xl"></div>
              <div className="relative w-full aspect-[4/5] bg-stone-100 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center">
                <img src={productBox} alt="Dailyfix Product" className="w-full h-full object-contain p-6 md:p-8" />
              </div>
            </div>
            
            <div className="p-2 md:p-4">
              <p className="text-emerald-500 font-semibold text-xs md:text-sm tracking-widest uppercase mb-4 md:mb-6">
                Our Story
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight mb-4 md:mb-6">
                Born from a Passion for Perfect Grooming
              </h2>
              <p className="text-black/60 text-sm md:text-base mb-4 md:mb-6">
                Dailyfix was founded with a simple mission: to give men the tools they need to look and feel their absolute best. We believe that great grooming shouldn't be complicated - it should be simple, effective, and enjoyable.
              </p>
              <p className="text-black/60 text-sm md:text-base mb-4 md:mb-6">
                After years of research and development, we created our signature beard colour - a product that combines the best of science and nature. Our formula is designed to give you natural-looking colour while nourishing your beard and skin.
              </p>
              <p className="text-black/60 text-sm md:text-base mb-6 md:mb-8">
                Today, Dailyfix is proud to serve thousands of men who trust us with their grooming needs. We're committed to continuous improvement and innovation to bring you the best products possible.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 md:gap-12 border-t border-gray-100 pt-6">
                <div>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-1">
                    3<span className="text-emerald-500">+</span>
                  </p>
                  <p className="text-black/60 text-xs md:text-sm">Colour Shades</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-1">
                    100<span className="text-emerald-500">%</span>
                  </p>
                  <p className="text-black/60 text-xs md:text-sm">Ammonia-Free</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-1">
                    10K<span className="text-emerald-500">+</span>
                  </p>
                  <p className="text-black/60 text-xs md:text-sm">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Gallery Section */}
      <section className="py-12 md:py-20 px-4 sm:px-8 md:px-16 bg-stone-50/50">
        <div className="max-w-9xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-emerald-500 font-semibold text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-4">
              Our Products
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              Gallery
            </h2>
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Natural Black */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <img src={naturalBlack} alt="Natural Black" className="w-full h-full object-contain p-4" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black text-center">Natural Black</h3>
            </div>
            
            {/* Black Brown */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <img src={blackBrown} alt="Black Brown" className="w-full h-full object-contain p-4" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black text-center">Black Brown</h3>
            </div>
            
            {/* Dark Brown */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <img src={darkBrown} alt="Dark Brown" className="w-full h-full object-contain p-4" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black text-center">Dark Brown</h3>
            </div>
            
            {/* Product Only */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <img src={productOnly} alt="Dailyfix Product" className="w-full h-full object-contain p-4" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black text-center">Product Only</h3>
            </div>
            
            {/* Three Products */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <img src={threeProducts} alt="All Products" className="w-full h-full object-contain p-4" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black text-center">All Shades</h3>
            </div>
            
            {/* Poster */}
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                <img src={poster} alt="Dailyfix Poster" className="w-full h-full object-contain p-4" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black text-center">Poster</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Features Section */}
      <section className="py-12 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-9xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-emerald-500 font-semibold text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-4">
              What Makes Us Different
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              Why Choose Dailyfix
            </h2>
          </div>
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-stone-50 p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-4">Natural Ingredients</h3>
              <p className="text-black/60 text-xs md:text-sm">
                Enriched with olive oil, taurine, and natural extracts to nourish your beard.
              </p>
            </div>
            
            <div className="bg-stone-50 p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-4">100% Ammonia-Free</h3>
              <p className="text-black/60 text-xs md:text-sm">
                Gentle formula that won't irritate your skin or damage your beard.
              </p>
            </div>
            
            <div className="bg-stone-50 p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-4">Long-Lasting</h3>
              <p className="text-black/60 text-xs md:text-sm">
                Vibrant colour that lasts up to 4-6 weeks.
              </p>
            </div>
            
            <div className="bg-stone-50 p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-4">Easy Application</h3>
              <p className="text-black/60 text-xs md:text-sm">
                Simple step-by-step process that anyone can do at home.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-12 md:py-20 px-4 sm:px-8 md:px-16 bg-stone-50">
        <div className="max-w-9xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-emerald-500 font-semibold text-xs md:text-sm tracking-widest uppercase mb-2 md:mb-4">
              Our Values
            </p>
            <h2 className="text-2xl md:text-4xl font-bold text-black">
              What We Stand For
            </h2>
          </div>
          
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-4">Quality First</h3>
              <p className="text-black/60 text-xs md:text-sm">
                We never compromise on quality. Every product is tested rigorously to ensure it meets our high standards before it reaches you.
              </p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-4">Safety & Transparency</h3>
              <p className="text-black/60 text-xs md:text-sm">
                We believe in full transparency. All our ingredients are clearly listed, and our formulas are designed to be safe and gentle.
              </p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-4">Customer First</h3>
              <p className="text-black/60 text-xs md:text-sm">
                Our customers are at the heart of everything we do. We're always listening and improving based on your feedback.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
