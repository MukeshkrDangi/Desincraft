const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false  // Set to true if you want to associate services with logged-in users
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);

