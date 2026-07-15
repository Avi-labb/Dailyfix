import React from 'react';
import { motion } from 'framer-motion';

const Blog = () => {
  const blogPosts = [
    { id: 1, title: 'How to Choose the Right Beard Colour', date: 'June 20, 2024', excerpt: 'Learn how to select the perfect shade for your beard...' },
    { id: 2, title: '5 Grooming Tips Every Man Should Know', date: 'June 15, 2024', excerpt: 'Essential tips for maintaining a great-looking beard...' },
    { id: 3, title: 'The Science Behind Beard Growth', date: 'June 10, 2024', excerpt: 'Understanding how beard growth works and how to enhance it...' },
  ];

  return (
    <div className="min-h-screen py-20 px-8 md:px-16 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-9xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Blog</h1>
          <p className="text-slate-600 text-lg">Grooming tips and advice from our experts</p>
        </motion.div>

        <div className="space-y-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <span className="text-sm text-emerald-600 font-semibold">{post.date}</span>
              <h2 className="text-2xl font-bold text-slate-800 mt-2 mb-4">{post.title}</h2>
              <p className="text-slate-600 mb-6">{post.excerpt}</p>
              <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors flex items-center gap-2">
                Read More →
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
