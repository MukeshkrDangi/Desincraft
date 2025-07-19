const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bannerController = require('../controllers/bannerController');

// ======= Ensure banner upload folder exists =======
const bannerUploadPath = path.join(__dirname, '..', 'uploads', 'banners');
if (!fs.existsSync(bannerUploadPath)) {
  fs.mkdirSync(bannerUploadPath, { recursive: true });
}

// ======= Multer Config for Banner Upload =======
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, bannerUploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ======= Banner Routes =======
router.post('/upload', upload.single('image'), bannerController.uploadBanner);
router.get('/', bannerController.getAllBanners);
router.delete('/:id', bannerController.deleteBanner);

module.exports = router;
