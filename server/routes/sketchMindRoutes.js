// ✅ Correct and Final: routes/sketchMindRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  submitSketchMindFeedback,
  getSketchMindFeedbacks,
  deleteSketchMindFeedback,
} = require('../controllers/sketchMindController');
const protect = require('../middleware/protect');
const adminOnly = require('../middleware/adminOnly');

// ✅ Ensure upload folder exists
const uploadPath = path.join(__dirname, '..', 'uploads', 'feedback');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// 🔓 Public: SketchMind feedback submission
router.post(
  '/',
  upload.fields([
    { name: 'voiceNote', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  submitSketchMindFeedback
);

// 🔐 Admin: View all feedbacks
router.get('/', protect, adminOnly, getSketchMindFeedbacks);

// 🔐 Admin: Delete specific feedback
router.delete('/:id', protect, adminOnly, deleteSketchMindFeedback);

module.exports = router;
