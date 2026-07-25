import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from 'lucide-react';
import { getPostById, getRelatedPosts } from '../data/blogData.js';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = getPostById(id);
  const relatedPosts = post ? getRelatedPosts(id, 3) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20 bg-stone-50">
        <div className="text-center max-w-xl px-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-slate-500 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold py-3 px-8 rounded-full"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const renderContent = (blocks) => {
    if (!Array.isArray(blocks)) return null;

    return blocks.map((block, idx) => {
      switch (block.type) {
        case 'heading':
          return (
            <h2 key={idx} className="text-2xl md:text-3xl font-bold text-slate-900 mt-10 mb-4 leading-tight">
              {block.text}
            </h2>
          );
        case 'paragraph':
          return (
            <p key={idx} className="text-slate-700 text-lg leading-relaxed mb-6">
              {block.text}
            </p>
          );
        case 'list':
          return (
            <ul key={idx} className="space-y-3 mb-8 pl-6">
              {block.items?.map((item, i) => (
                <li key={i} className="text-slate-700 text-lg leading-relaxed flex gap-3">
                  <span className="text-emerald-500 font-bold mt-1.5 flex-shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        case 'quote':
          return (
            <blockquote key={idx} className="border-l-4 border-emerald-500 pl-6 my-10 py-2 bg-emerald-50 rounded-r-2xl pr-6">
              <p className="text-xl md:text-2xl italic font-semibold text-slate-800 leading-relaxed">
                "{block.text}"
              </p>
            </blockquote>
          );
        default:
          return null;
      }
    });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[420px] md:h-[600px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-9xl mx-auto w-full px-6 sm:px-8 lg:px-12 pb-12">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-white/90 font-semibold text-sm mb-6"
            >
              <ArrowLeft size={18} />
              Back to All Articles
            </button>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6 max-w-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <User size={16} />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-9xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="font-medium max-w-none">
          {renderContent(post.content)}
        </div>

        {/* Author Card */}
        <div className="mt-16 p-8 md:p-10 bg-white rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-2xl font-bold">
                {post.author ? post.author.charAt(0) : 'D'}
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {post.author}
              </h3>
              <p className="text-emerald-600 font-semibold text-sm mb-3">
                BEARD GROOMING EXPERT · DAILYFIX
              </p>
              <p className="text-slate-600 leading-relaxed">
                Bringing you science-backed grooming advice and honest product insights since 2023.
                Helping men look and feel their best, one beard at a time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 px-6 sm:px-8 lg:px-12 bg-stone-50 border-t border-stone-200">
          <div className="max-w-9xl mx-auto">
            <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
              <div>
                <p className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">
                  Keep Reading
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Related Articles
                </h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-emerald-600 font-semibold"
              >
                View All Articles
                <ChevronRight size={20} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative overflow-hidden">
                      <img
                        src={rp.image}
                        alt={rp.title}
                        className="w-full h-56 object-cover"
                      />
                      <span className="absolute top-4 left-4 bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                        {rp.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <span>{rp.date}</span>
                        <span>·</span>
                        <span>{rp.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                        {rp.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2">
                        {rp.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20 px-6 sm:px-8 lg:px-12 bg-emerald-500">
        <div className="max-w-9xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Grooming Tips Delivered to Your Inbox
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest beard grooming tips, product updates, and exclusive offers.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              required
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

export default BlogDetail;
