const Banner = require('../models/Banner');
const path = require('path');
const fs = require('fs');

// 📤 Upload a new banner
exports.uploadBanner = async (req, res) => {
  try {
    const { title, subtitle } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: '❌ No image uploaded' });
    }

    const banner = new Banner({
      title,
      subtitle,
      imageUrl: `/uploads/banners/${req.file.filename}`, // ✅ Correct subfolder
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    console.error('❌ Banner Upload Error:', err);
    res.status(500).json({ message: 'Server Error: Could not upload banner' });
  }
};

// 📄 Get all banners (with optional pagination)
exports.getAllBanners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Banner.countDocuments();
    const banners = await Banner.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      banners,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('❌ Fetch Banners Error:', err);
    res.status(500).json({ message: 'Server Error: Could not fetch banners' });
  }
};

// 🗑️ Delete a banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: '❌ Banner not found' });
    }

    // Delete the image file if it exists
    const imagePath = path.join(__dirname, '..', banner.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: '✅ Banner deleted successfully' });
  } catch (err) {
    console.error('❌ Delete Banner Error:', err);
    res.status(500).json({ message: 'Server Error: Could not delete banner' });
  }
};
