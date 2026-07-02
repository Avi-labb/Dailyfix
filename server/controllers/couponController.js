import Coupon from '../models/Coupon.js';

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const coupon = await Coupon.findOne({ 
      code, 
      active: true, 
      validFrom: { $lte: new Date() },
      $or: [{ validTo: null }, { validTo: { $gte: new Date() } }]
    });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found or expired' });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value for coupon is ${coupon.minOrderValue}` });
    }

    let discount;
    if (coupon.discountType === 'percentage') {
      discount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({ coupon, discount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, validFrom, validTo, active } = req.body;
    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validTo,
      active: active !== undefined ? active : true
    });
    await coupon.save();
    res.status(201).json({ message: 'Coupon created', couponId: coupon._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, validFrom, validTo, active } = req.body;
    await Coupon.findByIdAndUpdate(req.params.id, {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      usageLimit,
      validFrom,
      validTo,
      active
    });
    res.json({ message: 'Coupon updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
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
