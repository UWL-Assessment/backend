const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    res.status(400).json({
      message: 'All fields are required',
    });
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({
      message: 'Email is already in use',
    });
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(500).json({
      message: 'Failed to register user',
    });
  }
});

module.exports = {
  registerUser,
};