const express = require('express');
const router = express.Router();
const {
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon
} = require('../controllers/couponController');

// Admin: Create a new coupon
router.post('/', createCoupon);

// Admin: Get all coupons
router.get('/', getCoupons);

// Admin: Delete a coupon
router.delete('/:id', deleteCoupon);

// Client: Apply a coupon
router.post('/apply', applyCoupon);

module.exports = router;
