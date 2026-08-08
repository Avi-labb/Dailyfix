import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogData.js';

const Blog = () => {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gray-900 pt-20 pb-20 px-8 md:px-16">
        <div className="max-w-9xl mx-auto text-center">
          <p className="text-emerald-500 font-semibold text-sm tracking-widest uppercase mb-6">
            Our Blog
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Grooming Tips & Insights
          </h1>
          <p className="text-white/70 text-lg mt-6 max-w-2xl mx-auto">
            Discover expert beard grooming advice, product tips, and style inspiration to help you look and feel your best.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-8 md:px-16 bg-white">
        <div className="max-w-9xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block bg-emerald-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                    Featured
                  </span>
                  <span className="inline-block text-white/80 text-xs ml-3">
                    {featuredPost.date} · {featuredPost.readTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              {featuredPost.category && (
                <span className="inline-block bg-emerald-50 text-emerald-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                  {featuredPost.category}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-slate-600 text-base mb-8">
                {featuredPost.excerpt}
              </p>
              <Link 
                to={`/blog/${featuredPost.slug}`} 
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-lg"
              >
                Read Article
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-8 md:px-16 bg-stone-50">
        <div className="max-w-9xl mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-12 gap-4">
            <h2 className="text-3xl font-bold text-slate-900">
              Latest Articles
            </h2>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-emerald-500 text-white rounded-full text-sm font-semibold">All</button>
              <button className="px-5 py-2 bg-white text-slate-600 rounded-full text-sm font-semibold border border-stone-200">Grooming Tips</button>
              <button className="px-5 py-2 bg-white text-slate-600 rounded-full text-sm font-semibold border border-stone-200 hidden md:block">Product Guide</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link 
                key={post.id}
                to={`/blog/${post.slug}`} 
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-[430px] object-cover"
                  />
                  {post.category && (
                    <span className="absolute top-4 left-4 bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-8 md:px-16 bg-emerald-500">
        <div className="max-w-9xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Grooming Tips Delivered to Your Inbox
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest beard grooming tips, product updates, and exclusive offers.
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-white text-slate-900"
            />
            <button 
              type="submit" 
              className="bg-slate-900 text-white font-semibold py-4 px-8 rounded-xl"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
