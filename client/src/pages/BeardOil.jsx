import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

const BeardOil = () => {
  return (
    <div className="min-h-screen py-20 px-8 md:px-16 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Sparkles size={48} className="text-emerald-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Something New is Coming Soon!
        </h1>
        <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
          We're working hard to bring you the best beard oil for your grooming needs. Stay tuned for something amazing!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold py-3 px-8 rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default BeardOil
