// ================== Setup ==================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

// ================== CORS Config ==================
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ================== Security Middleware ==================
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
});
app.use(limiter);

// ================== Core Middleware ==================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== Public Uploads ==================
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// ================== Import Routes ==================
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');
const couponRoutes = require('./routes/couponRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const newsletterAdvancedRoutes = require('./routes/newsletterAdvancedRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// ================== API Routes ==================
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/newsletter', newsletterRoutes); // General newsletter
app.use('/api/newsletter/advanced', newsletterAdvancedRoutes); // Advanced version
app.use('/api/banners', bannerRoutes);
app.use('/api/feedback', feedbackRoutes); // 🔥 SketchMind + Order feedback

// ================== Root Route ==================
app.get('/', (req, res) => {
  res.send('🚀 DesignCraft API is running!');
});

// ================== 404 Fallback ==================
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// ================== Connect to MongoDB ==================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ================== Start Server ==================
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
