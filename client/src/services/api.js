import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true
})

// Admin API functions
export const adminAPI = {
  login: async (email, password) => {
    try {
      const res = await api.post('/admin/login', { email, password })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Login failed' } }
    }
  },
  sendOtp: async (email) => {
    try {
      const res = await api.post('/admin/send-otp', { email })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Failed to send OTP' } }
    }
  },
  verifyOtp: async (email, otp) => {
    try {
      const res = await api.post('/admin/verify-otp', { email, otp })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'OTP verification failed' } }
    }
  },
  resetPassword: async (email, otp, password) => {
    try {
      const res = await api.post('/admin/reset-password', { email, otp, password })
      return { ok: true, data: res.data }
    } catch (err) {
      return { ok: false, data: err.response?.data || { message: 'Password reset failed' } }
    }
  }
}

export default api