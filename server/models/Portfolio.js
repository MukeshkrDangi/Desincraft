const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    imageUrl: String,
    user: { // ✅ Link user id
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});




module.exports = mongoose.model('Portfolio', portfolioSchema);
