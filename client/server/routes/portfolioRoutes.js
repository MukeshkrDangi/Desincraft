const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    addPortfolio,
    uploadMockupToPortfolio,
    getPortfolios,
    deletePortfolio,
    updatePortfolio
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('❌ Only image files are allowed'), false);
};
const upload = multer({ storage, fileFilter });

// ✅ Routes
router.post('/', protect, upload.single('image'), addPortfolio);     // Form upload
router.get('/', getPortfolios);
router.delete('/:id', protect, deletePortfolio);
router.put('/:id', protect, upload.single('image'), updatePortfolio);

// ✅ AI Mockup Upload (from canvas or base64)
router.post('/mockup', protect, uploadMockupToPortfolio);             // No multer here!

module.exports = router;
