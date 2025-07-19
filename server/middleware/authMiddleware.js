const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: '❌ User not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: '❌ Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: '❌ Not authorized, no token' });
  }
};

module.exports = { protect };
