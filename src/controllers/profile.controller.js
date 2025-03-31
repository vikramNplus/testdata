// src/controllers/profile.controller.js
const httpStatus = require('http-status');
const { User } = require('../models/user.model');
const ApiError = require('../utils/ApiError');

// Get user profile
const getProfile = async (req, res) => {
  const userId = req.user._id; // user ID from the authenticated user (from auth middleware)

  const user = await User.findById(userId).select('-password'); // Exclude password field

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  res.status(httpStatus.OK).send({
    id: user._id,
    phoneNumber: user.phoneNumber,
    role: user.role,
    isActive: user.isActive,
  });
};

module.exports = {
  getProfile,
};
