import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const [existingAdmins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    
    let admin;
    if (existingAdmins.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const [result] = await pool.query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashedPassword]);
      admin = { id: result.insertId, email };
    } else {
      admin = existingAdmins[0];
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict'
    });

    res.json({ message: 'Login successful', admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie('admin_token');
  res.json({ message: 'Logged out successfully' });
};

const getDashboardStats = async (req, res) => {
  try {
    const [ordersResult] = await pool.query('SELECT COUNT(*) as total FROM orders');
    const [revenueResult] = await pool.query('SELECT SUM(total) as total FROM orders WHERE status = "Delivered"');
    const [productsResult] = await pool.query('SELECT COUNT(*) as total FROM products');
    const [customersResult] = await pool.query('SELECT COUNT(*) as total FROM customers');
    
    const [monthlySales] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        SUM(total) as sales
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month
    `);

    const [topProducts] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        SUM(oi.quantity) as total_sold
      FROM products p
      JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    res.json({
      totalOrders: ordersResult[0].total,
      totalRevenue: revenueResult[0].total || 0,
      totalProducts: productsResult[0].total,
      totalCustomers: customersResult[0].total,
      monthlySales,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  login,
  logout,
  getDashboardStats
};