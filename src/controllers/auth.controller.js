// src/controllers/auth.controller.js
const httpStatus = require('http-status');
const { User } = require('../models/user.model');
const otpService = require('../services/otp.service');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
  const { name, email, phoneNumber, password, role } = req.body;
  // Check if the phone number is already taken
  const isPhoneTaken = await User.isPhoneTaken(phoneNumber);
  if (isPhoneTaken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already in use');
  }

  // Create a new user
  const user = await User.create({ name, email, phoneNumber, password, role });
  // Create JWT Token (for user session)
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });

  res.status(httpStatus.CREATED).send({
    message: 'User registered successfully!',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    },
    token,
  });
};

// Login user
const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid phone number or password');
  }

  // Create JWT Token (for user session)
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });

  res.status(httpStatus.OK).send({
    message: 'Login successful',
    user: {
      id: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
    token,
  });
};

// Forgot Password (Send OTP)
const forgotPassword = async (req, res) => {
  const { phoneNumber } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User with this phone number not found');
  }

  // Generate OTP and save to user model
  const { otp, expiresAt } = await otpService.generateOtp(phoneNumber);

  // Send OTP to user (via SMS, email, etc.) (you can integrate an SMS service here)
  // In this case, we're just assuming OTP is successfully sent.

  res.send({
    message: `OTP sent successfully. It will expire at ${expiresAt}`,
  });
};

// Reset Password (Using OTP)
const resetPassword = async (req, res) => {
  const { phoneNumber, otp, password } = req.body;

  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User with this phone number not found');
  }

  // Verify OTP from User model
  const isOtpValid = await otpService.verifyOtp(phoneNumber, otp);

  if (!isOtpValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }

  // Reset the user's password
  user.password = password; // Set the new password
  await user.save();

  res.send({ message: 'Password reset successfully' });
};

// User Logout (Handle JWT token invalidation or clearing session)
const logout = (req, res) => {
  // In case you're using JWT, you can handle logout here by clearing tokens
  res.send({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
};
