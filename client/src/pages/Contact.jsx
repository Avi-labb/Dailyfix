import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Clock,
  CheckCircle2,
  Send
} from 'lucide-react';
import banner from '../assets/images/dailyfixbannerforwebside.png';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
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
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    
    setIsSubmitting(true);
    setSubmitError('');

    const result = await contactAPI.sendContactForm(formData);

    setIsSubmitting(false);

    if (result.ok) {
      setIsSubmitted(true);
    } else {
      setSubmitError(result.data?.message || 'Failed to send message. Please try again.');
    }
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
    setSubmitError('');
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
      content: 'marketing@dailyfixcare.com',
      color: 'emerald'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Monday - Sunday: 9:00 AM - 6:00 PM',
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-stone-900" />
        <div className="absolute inset-0 opacity-10">
          <img
            src={banner}
            alt="Dailyfix Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-9xl mx-auto text-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-6 py-3 rounded-full backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400 font-bold text-xs md:text-sm tracking-widest uppercase">Contact Us</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Have questions or feedback? We'd love to hear from you. Reach out to us and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-9xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left - Contact Info */}
            <div className="lg:col-span-5">
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
                      <div
                        key={index}
                        className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-start gap-6"
                      >
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-stone-900">{info.title}</h3>
                          <p className="text-stone-600 text-sm md:text-base">{info.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 md:p-12 lg:p-16 rounded-3xl shadow-md border border-stone-100">
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
                          className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 focus:outline-none ${
                            errors.name ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-emerald-400'
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
                          className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 focus:outline-none ${
                            errors.email ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-emerald-400'
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
                        className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 focus:outline-none ${
                          errors.subject ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-emerald-400'
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
                        className={`w-full px-5 py-4 rounded-2xl bg-stone-50 border-2 focus:outline-none resize-none ${
                          errors.message ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-emerald-400'
                        }`}
                        placeholder="Tell us what you need..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm">{errors.message}</p>
                      )}
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                        <p className="text-red-600 text-sm font-medium">{submitError}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-3 bg-emerald-500 disabled:bg-stone-400 text-white font-bold py-6 px-12 rounded-2xl disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold text-stone-900">Message Sent!</h3>
                      <p className="text-stone-600 text-lg">
                        Thank you for reaching out. We'll get back to you as soon as possible at <span className="font-semibold text-emerald-600">orders@dailyfixcare.com</span>.
                      </p>
                    </div>
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-3 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-4 px-10 rounded-2xl"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
