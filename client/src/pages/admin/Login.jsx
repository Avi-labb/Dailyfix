import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { adminAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext.jsx'

// Simple ElegantHeaderText component
const ElegantHeaderText = ({ text }) => (
  <motion.span
    key={text}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {text}
  </motion.span>
);

function AdminLogin() {
  const [screen, setScreen] = useState('login'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState('success');
  const navigate = useNavigate();
  const { login } = useAuth();

 const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const result = await adminAPI.login(email, password);
    setIsLoading(false);
    if (result.ok) {
      login(result.data.token);
      navigate('/admin');
    } else {
      setMessage(result.data.message || 'Identity verification rejected');
      setMessageType('error');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const result = await adminAPI.sendOtp(email);
    setIsLoading(false);
    if (result.ok) {
      setMessage('A secure multi-pass token has been dispatched.');
      setMessageType('success');
      setScreen('verifyOtp');
    } else {
      setMessage(result.data.message || 'Token dispatch failed');
      setMessageType('error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const result = await adminAPI.verifyOtp(email, otp);
    setIsLoading(false);
    if (result.ok) {
      setMessage('Token successfully authenticated.');
      setMessageType('success');
      setScreen('resetPassword');
    } else {
      setMessage(result.data.message || 'Invalid validation token');
      setMessageType('error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    if (newPassword !== confirmPassword) {
      setIsLoading(false);
      setMessage('Cryptographic structural mismatch');
      setMessageType('error');
      return;
    }
    const result = await adminAPI.resetPassword(email, otp, newPassword);
    setIsLoading(false);
    if (result.ok) {
      setMessage('Secure architecture rules updated.');
      setMessageType('success');
      setTimeout(() => {
        setScreen('login');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } else {
      setMessage(result.data.message || 'Structural updates rejected');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050506] text-[#e4e4e7] font-sans antialiased relative px-4 overflow-hidden selection:bg-white selection:text-black">
      
      {/* Cinematic Ambient Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft, deep, luxury light ray falling from top right corner */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-neutral-900/40 via-neutral-950/10 to-transparent blur-[120px]" />
        {/* Fine matrix texture layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        
        {/* Brand Signifier Accent */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-12 text-center"
        >
          <div className="w-9 h-9 border border-neutral-800 flex items-center justify-center rounded-full bg-neutral-950 shadow-[0_0_20px_rgba(255,255,255,0.02)] mb-4">
            <Shield size={14} className="text-neutral-400 stroke-[1.25]" />
          </div>
          <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-semibold mb-1">
            Secure Infrastructure
          </div>
          <h1 className="text-3xl text-white tracking-tight h-10 flex items-center">
            <AnimatePresence mode="wait">
              {screen === 'login' && <ElegantHeaderText key="l1" text="Authenticate Session" />}
              {screen === 'sendOtp' && <ElegantHeaderText key="l2" text="Recover Gateway" />}
              {screen === 'verifyOtp' && <ElegantHeaderText key="l3" text="Validate Identity" />}
              {screen === 'resetPassword' && <ElegantHeaderText key="l4" text="Rebuild Credentials" />}
            </AnimatePresence>
          </h1>
        </motion.div>

        {/* Dynamic Alert Banner */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={`text-xs font-light tracking-wide py-3 px-4 border mb-6 rounded-lg text-center backdrop-blur-md shadow-sm ${
                messageType === 'success'
                  ? 'bg-neutral-950 text-neutral-300 border-neutral-800'
                  : 'bg-neutral-950 text-neutral-400 border-red-950/60'
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Form Controller */}
        <AnimatePresence mode="wait">
          
          {/* SCREEN 1: MAIN ACCESS LOGIN */}
          {screen === 'login' && (
            <motion.form
              key="login-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block ml-0.5">Corporate Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-200 transition-colors duration-300 stroke-[1.25]" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-all duration-500 font-light shadow-inner tracking-wide autofill:shadow-[0_0_0_30px_#050506_inset] autofill:text-neutral-200 [-webkit-text-fill-color:#e4e4e7]"
                    placeholder="example@gmail.com..."
                  />
                  {/* Premium Underline Highlight Micro-Interaction */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-neutral-400 group-focus-within:w-[92%] transition-all duration-500 ease-out" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center px-0.5">
                  <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block">Passkey Architecture</label>
                  <button
                    type="button"
                    onClick={() => { setScreen('sendOtp'); setMessage(''); }}
                    className="text-[10px] text-neutral-500 hover:text-neutral-300 font-medium transition-colors tracking-wider uppercase"
                  >
                    Forget Password ?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-200 transition-colors duration-300 stroke-[1.25]" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3 bg-neutral-950 border border-neutral-700 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-all duration-500 font-light shadow-inner tracking-wide autofill:shadow-[0_0_0_30px_#050506_inset] autofill:text-neutral-200 "
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} className="stroke-[1.25]" /> : <Eye size={16} className="stroke-[1.25]" />}
                  </button>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-neutral-400 group-focus-within:w-[92%] transition-all duration-500 ease-out" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#ffffff", color: "#000000" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-neutral-100 text-neutral-900 text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-20 shadow-md"
                >
                  {isLoading ? 'Decrypting Credentials...' : 'Establish Session'}
                  {!isLoading && <ArrowRight size={14} className="stroke-[2.5]" />}
                </motion.button>
              </motion.div>
            </motion.form>
          )}

          {/* SCREEN 2: TRANSMIT OTP */}
          {screen === 'sendOtp' && (
            <motion.form
              key="send-otp-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleSendOtp}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block ml-0.5">Recovery Identity Endpoint</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-neutral-400 transition-colors duration-300 stroke-[1.25]" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-all duration-500 font-light shadow-inner tracking-wide autofill:shadow-[0_0_0_30px_#050506_inset] autofill:text-neutral-200 [-webkit-text-fill-color:#e4e4e7]"
                    placeholder="operator@enterprise.com"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-neutral-400 group-focus-within:w-[92%] transition-all duration-500 ease-out" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#ffffff", color: "#000000" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-neutral-100 text-neutral-900 text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Transmitting Request...' : 'Request Token Access'}
                </motion.button>

                <button
                  type="button"
                  onClick={() => { setScreen('login'); setMessage(''); }}
                  className="w-full flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-300 text-[10px] font-semibold uppercase tracking-widest transition-colors mt-2"
                >
                  <ArrowLeft size={12} /> Abort Operation
                </button>
              </motion.div>
            </motion.form>
          )}

          {/* SCREEN 3: VERIFY OTP TOKEN */}
          {screen === 'verifyOtp' && (
            <motion.form
              key="verify-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleVerifyOtp}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block text-center">Enter Encrypted One-Time Signature</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full py-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-neutral-500 text-center text-xl font-mono tracking-[0.6em] pl-[0.6em] transition-all duration-500 font-light placeholder-neutral-500 autofill:shadow-[0_0_0_30px_#050506_inset] autofill:text-neutral-200 [-webkit-text-fill-color:#e4e4e7]"
                  placeholder="000000"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#ffffff", color: "#000000" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-neutral-100 text-neutral-900 text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300"
                >
                  {isLoading ? 'Validating Token...' : 'Confirm Clearance'}
                </motion.button>

                <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider px-1">
                  <button
                    type="button"
                    onClick={() => { setScreen('sendOtp'); setMessage(''); }}
                    className="flex items-center gap-1 text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    <ArrowLeft size={12} /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {isLoading ? 'Re-dispatching...' : 'Re-dispatch Code'}
                  </button>
                </div>
              </motion.div>
            </motion.form>
          )}

          {/* SCREEN 4: UPDATE PASSWORD STRUCT */}
          {screen === 'resetPassword' && (
            <motion.form
              key="reset-screen"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleResetPassword}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block ml-0.5">New Key Structure</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-neutral-400 transition-colors duration-300 stroke-[1.25]" size={16} />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-12 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-all duration-500 font-light shadow-inner tracking-wide autofill:shadow-[0_0_0_30px_#050506_inset] autofill:text-neutral-200 [-webkit-text-fill-color:#e4e4e7]"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={16} className="stroke-[1.25]" /> : <Eye size={16} className="stroke-[1.25]" />}
                  </button>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-neutral-400 group-focus-within:w-[92%] transition-all duration-500 ease-out" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block ml-0.5">Confirm Structural Alignment</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-neutral-400 transition-colors duration-300 stroke-[1.25]" size={16} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-all duration-500 font-light shadow-inner tracking-wide autofill:shadow-[0_0_0_30px_#050506_inset] autofill:text-neutral-200 [-webkit-text-fill-color:#e4e4e7]"
                    placeholder="••••••••••••"
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-neutral-400 group-focus-within:w-[92%] transition-all duration-500 ease-out" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#ffffff", color: "#000000" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-neutral-100 text-neutral-900 text-xs font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300"
                >
                  {isLoading ? 'Re-keying...' : 'Commit System Rebuild'}
                </motion.button>
              </motion.div>
            </motion.form>
          )}

        </AnimatePresence>

        {/* Global Structural Metric Footnote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-center mt-16 text-[9px] text-neutral-600 uppercase tracking-[0.3em] font-medium"
        >
          Node: {window.location.hostname || "Primary Core"} // Latency: Normal
        </motion.div>

      </div>
    </div>
  );
};

export default AdminLogin;