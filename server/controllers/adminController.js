import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

// Function to initialize admin (creates if doesn't exist)
const initializeAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword
      });
      await admin.save();
      console.log('Admin account initialized');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Initialize admin on server start
initializeAdmin();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    return res.status(200).json({ 
      success: true,
      message: 'Login successful',
      token, 
    });
  
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    admin.otp = otp;
    admin.otpExpiry = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await admin.save();

    console.log('OTP sent to', email, ':', otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const admin = await Admin.findOne({ email });

    if (
      !admin ||
      admin.otp !== otp ||
      admin.otpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const admin = await Admin.findOne({ email });

    if (
      !admin ||
      admin.otp !== otp ||
      admin.otpExpiry < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain uppercase, lowercase, number and special character",
      });
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    admin.otp = null;
    admin.otpExpiry = null;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.cookie("admin_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    
    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, sales: { $sum: '$total' } } },
      { $sort: { _id: 1 } }
    ]).then(results => results.map(r => ({ month: r._id, sales: r.sales })));

    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $project: { id: '$_id', name: '$product.name', totalSold: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
        monthlySales,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};