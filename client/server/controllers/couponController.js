const Coupon = require('../models/Coupon');

const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiresAt } = req.body;
    const coupon = new Coupon({
      code,
      discount,
      expiresAt: new Date(expiresAt),
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    console.error('❌ Error creating coupon:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    // ✅ Expiry Check
    const now = new Date();
    if (coupon.expiresAt < now) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    res.json({
      discount: coupon.discount,
      expiresAt: coupon.expiresAt,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
};
