import pool from '../config/db.js';

const getAllCoupons = async (req, res) => {
  try {
    const [coupons] = await pool.query('SELECT * FROM coupons');
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, order_total } = req.body;
    const [coupons] = await pool.query(
      'SELECT * FROM coupons WHERE code = ? AND active = true AND valid_from <= NOW() AND (valid_to IS NULL OR valid_to >= NOW())',
      [code]
    );
    if (coupons.length === 0) {
      return res.status(404).json({ message: 'Coupon not found or expired' });
    }
    const coupon = coupons[0];
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    if (coupon.min_order_value && order_total < coupon.min_order_value) {
      return res.status(400).json({ message: `Minimum order value for coupon is ${coupon.min_order_value}` });
    }

    let discount;
    if (coupon.discount_type === 'percentage') {
      discount = (order_total * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    res.json({ coupon, discount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to, active } = req.body;
    const [result] = await pool.query(
      'INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [code, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to, active || true]
    );
    res.status(201).json({ message: 'Coupon created', couponId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to, active } = req.body;
    await pool.query(
      'UPDATE coupons SET code=?, discount_type=?, discount_value=?, min_order_value=?, max_discount=?, usage_limit=?, valid_from=?, valid_to=?, active=? WHERE id=?',
      [code, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to, active, req.params.id]
    );
    res.json({ message: 'Coupon updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  getAllCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
};