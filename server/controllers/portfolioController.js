const Portfolio = require('../models/portfolioModel');
const fs = require('fs');
const path = require('path');

// ✅ Add Portfolio with Multer Upload
const addPortfolio = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: '❌ Image is required' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const newPortfolio = new Portfolio({
            title,
            description,
            category,
            imageUrl,
            user: req.user._id
        });

        await newPortfolio.save();
        res.status(201).json(newPortfolio);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add portfolio item', error: error.message });
    }
};

// ✅ Save AI Generated Mockup (No file upload — image URL or base64)
const uploadMockupToPortfolio = async (req, res) => {
    try {
        const { title, category, image } = req.body;

        if (!image) {
            return res.status(400).json({ message: '❌ Image is required' });
        }

        const newItem = new Portfolio({ title, category, imageUrl: image });
        await newItem.save();

        res.status(201).json({ message: '✅ Mockup saved to portfolio', item: newItem });
    } catch (error) {
        res.status(500).json({ message: '❌ Save failed', error: error.message });
    }
};

// ✅ Get All Portfolios
const getPortfolios = async (req, res) => {
    try {
        const portfolioItems = await Portfolio.find();
        res.status(200).json(portfolioItems);
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch portfolio items', error: error.message });
    }
};

// ✅ Delete Portfolio
const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;

        const portfolioItem = await Portfolio.findById(id);
        if (!portfolioItem) {
            return res.status(404).json({ message: '❌ Portfolio item not found' });
        }

        const imagePath = path.join(__dirname, '../uploads', path.basename(portfolioItem.imageUrl));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await portfolioItem.deleteOne();
        res.status(200).json({ message: '✅ Portfolio item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete portfolio item', error: error.message });
    }
};

// ✅ Update Portfolio
const updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const portfolioItem = await Portfolio.findById(id);

        if (!portfolioItem) {
            return res.status(404).json({ message: '❌ Portfolio item not found' });
        }

        const title = req.body.title || portfolioItem.title;
        const description = req.body.description || portfolioItem.description;
        const category = req.body.category || portfolioItem.category;

        if (req.file) {
            const oldImagePath = path.join(__dirname, '../uploads', path.basename(portfolioItem.imageUrl));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            portfolioItem.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        portfolioItem.title = title;
        portfolioItem.description = description;
        portfolioItem.category = category;

        const updatedItem = await portfolioItem.save();

        res.status(200).json({ message: '✅ Portfolio item updated successfully', updatedItem });
    } catch (error) {
        console.error('Error updating portfolio item:', error);
        res.status(500).json({ message: '❌ Failed to update portfolio item', error: error.message });
    }
};

module.exports = {
    addPortfolio,
    uploadMockupToPortfolio,
    getPortfolios,
    deletePortfolio,
    updatePortfolio,
};
