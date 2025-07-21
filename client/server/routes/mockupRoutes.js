const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `design-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// POST /api/mockup
router.post('/', upload.single('design'), async (req, res) => {
  try {
    const { mockupType } = req.body;
    const designPath = req.file.path;

    // Mockup base image (you’ll prepare these)
    const baseMockupPath = `./mockups/${mockupType}.png`;
    if (!fs.existsSync(baseMockupPath)) {
      return res.status(400).json({ message: '❌ Mockup type not found' });
    }

    // Output path
    const outputPath = `./uploads/mockup-${Date.now()}.png`;

    // Example: composite design onto baseMockup
    await sharp(baseMockupPath)
      .composite([
        {
          input: designPath,
          top: 150,
          left: 200,
          // Optional: size it down
          blend: 'over',
        },
      ])
      .toFile(outputPath);

    // Delete original design if needed
    fs.unlinkSync(designPath);

    const mockupUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(outputPath)}`;
    res.json({ mockupUrl });
  } catch (error) {
    console.error('Mockup error:', error);
    res.status(500).json({ message: '❌ Failed to generate mockup', error: error.message });
  }
});

module.exports = router;
