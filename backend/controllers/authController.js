const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail, sendDoctorLoginAlert } = require('../services/emailService');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * Register new user
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already registered'
      });
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role: role || 'patient',
      phone
    };

    // Add doctor-specific fields
    if (role === 'doctor') {
      userData.specialization = specialization;
    }

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.log('Email sending failed:', emailError.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from output
    user.password = undefined;

    // Send login alert to doctors
    if (user.role === 'doctor') {
      try {
        await sendDoctorLoginAlert(user.email, user.name);
      } catch (emailError) {
        console.log('Doctor login email failed:', emailError.message);
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get current user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update user profile
 */
exports.updateProfile = async (req, res) => {
  try {
    let allowedUpdates = ['name', 'phone', 'dateOfBirth', 'gender', 'address'];
    if (req.user.role === 'doctor') {
      allowedUpdates = [...allowedUpdates, 'avatarUrl', 'description', 'achievements', 'qualification', 'experience', 'consultationFee'];
    }

    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
