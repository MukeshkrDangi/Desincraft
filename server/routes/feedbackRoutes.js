const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  submitSketchMindFeedback,
  getAllFeedbacks,               // (optional if needed)
  deleteFeedback,
  getSketchMindFeedbacks,
} = require('../controllers/feedbackController');

const protect = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

// ✅ Ensure upload path exists
const feedbackUploadPath = path.join(__dirname, '..', 'uploads', 'feedback');
if (!fs.existsSync(feedbackUploadPath)) {
  fs.mkdirSync(feedbackUploadPath, { recursive: true });
}

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, feedbackUploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ==================== ROUTES ====================

// 🔵 Public: Submit SketchMind Feedback (canvas + voiceNote)
router.post(
  '/sketchmind',
  upload.fields([
    { name: 'voiceNote', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  submitSketchMindFeedback
);

// 🔐 Admin: Get all SketchMind feedbacks only
router.get('/sketchmind', protect, adminOnly, getSketchMindFeedbacks);

// 🔐 Admin: Delete feedback by ID
router.delete('/admin/:id', protect, adminOnly, deleteFeedback);

module.exports = router;
