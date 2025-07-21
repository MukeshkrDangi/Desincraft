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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'https://venerable-churros-ef51d1.netlify.app',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ================== Security Middleware ==================
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ================== Core Middleware ==================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== Public Uploads Folder ==================
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
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
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/newsletter/advanced', newsletterAdvancedRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/feedback', feedbackRoutes);

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
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
