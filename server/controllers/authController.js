const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// ✅ Generate JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '❌ User already exists' });
    }

    // 🔐 Role assignment
    const role =
      email === 'admin@designcraft.com' || email === 'mukeshkrdangi1@gmail.com'
        ? 'admin'
        : 'client';

    const user = await User.create({ name, email, password, role });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: '❌ Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: '❌ Registration failed', error: error.message });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // ✅ Needed on frontend to determine admin
      });
    } else {
      res.status(401).json({ message: '❌ Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: '❌ Login failed', error: error.message });
  }
};

// ✅ Get Profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: '❌ User not found' });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to fetch profile', error: error.message });
  }
};

// ✅ Update Profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: '❌ User not found' });

    const updatedUser = await User.findById(user._id);
    updatedUser.name = req.body.name || updatedUser.name;
    updatedUser.email = req.body.email || updatedUser.email;

    if (req.body.password) {
      updatedUser.password = req.body.password;
    }

    await updatedUser.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: '❌ Failed to update profile', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
