import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Clock,
  CheckCircle2,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import banner from '../assets/images/dailyfixbannerforwebside.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setIsSubmitted(false);
    setErrors({});
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Address',
      content: 'Lightbridge, 6th Floor, Hiranandani Business Park, Saki Vihar Road, Tunga Village, Chandivali, Powai, Mumbai, Maharashtra 400072',
      color: 'emerald'
    },
    {
      icon: Mail,
      title: 'Email Address',
      content: 'support@dailyfix.com',
      color: 'emerald'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM',
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-emerald-900 to-stone-900" />
        <div className="absolute inset-0 opacity-10">
          <img
            src={banner}
            alt="Dailyfix Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-3 rounded-full backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold text-xs md:text-sm tracking-widest uppercase">Contact Us</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Have questions or feedback? We'd love to hear from you. Reach out to us and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5"
            >
              <div className="space-y-10">
                <div className="space-y-4">
                  <span className="text-emerald-600 font-bold text-xs tracking-widest uppercase bg-emerald-50 px-6 py-3 rounded-full inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    Contact Information
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
                    Let's Start a Conversation
                  </h2>
                  <p className="text-stone-600 text-lg leading-relaxed">
                    We're here to help with any questions or concerns you may have. Our team is dedicated to providing the best possible service.
                  </p>
                </div>

                {/* Info Cards */}
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-hard transition-all duration-500 border border-stone-100 flex items-start gap-6"
                      >
                        <div className={`w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-stone-900">{info.title}</h3>
                          <p className="text-stone-600 text-sm md:text-base">{info.content}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7"
            >
              <div className="bg-white p-10 md:p-12 lg:p-16 rounded-3xl shadow-hard border border-stone-100">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-stone-900">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                            errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-transparent focus:border-emerald-400'
                          }`}
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-stone-900">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                            errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-transparent focus:border-emerald-400'
                          }`}
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-bold text-stone-900">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                          errors.subject ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-transparent focus:border-emerald-400'
                        }`}
                        placeholder="How can we help?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-sm">{errors.subject}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-bold text-stone-900">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-100 resize-none ${
                          errors.message ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-transparent focus:border-emerald-400'
                        }`}
                        placeholder="Tell us what you need..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-stone-400 disabled:to-stone-400 text-white font-bold py-6 px-12 rounded-2xl shadow-soft hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 disabled:translate-y-0"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold text-stone-900">Message Sent!</h3>
                      <p className="text-stone-600 text-lg">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="group inline-flex items-center gap-3 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-4 px-10 rounded-2xl transition-all duration-300"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
