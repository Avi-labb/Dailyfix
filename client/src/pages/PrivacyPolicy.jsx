import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-20 px-8 md:px-16 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-9xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">Privacy Policy</h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <p className="text-slate-600 text-lg mb-8">
              This Privacy Policy describes how Dailyfix collects, uses, and shares your personal information when you visit our website.
            </p>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Information We Collect</h2>
            <p className="text-slate-600 mb-6">
              When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
            </p>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 mb-6">
              We use the information that we collect generally to fulfill any orders placed through the site, communicate with you, and improve and optimize our site.
            </p>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-slate-600">
              For more information about our privacy practices or if you have questions, please contact us by email at marketing@dailyfixcare.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
