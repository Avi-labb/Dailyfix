import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen py-20 px-8 md:px-16 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">Terms of Service</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Overview</h2>
            <p className="text-slate-600 mb-6">
              By accessing this website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Use License</h2>
            <p className="text-slate-600 mb-6">
              Permission is granted to temporarily view the materials on Dailyfix's website for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
            </p>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Disclaimer</h2>
            <p className="text-slate-600 mb-6">
              The materials on Dailyfix's website are provided on an 'as is' basis. Dailyfix makes no warranties, expressed or implied.
            </p>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact</h2>
            <p className="text-slate-600">
              For questions about these Terms of Service, please contact us at marketing@dailyfixcare.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
