const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ✅ Import Controllers
const {
  createOrder,
  getClientOrders,
  getOrderById,
  submitFeedback,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  getOrderSummary
} = require('../controllers/orderController');

// ✅ Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// ✅ Audio Filter
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/wav', 'audio/mpeg', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('❌ Invalid audio type'), false);
    }
  },
});

// ✅ Public Routes
router.post('/', createOrder);
router.get('/client/:email', getClientOrders);
router.post('/:id/feedback', upload.single('voiceNote'), submitFeedback);

// ✅ Admin Routes
router.get('/summary', getOrderSummary); // ✅ Must come before '/:id'
router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);
router.get('/:id', getOrderById); // 👈 Keep this last to avoid conflict

module.exports = router;
