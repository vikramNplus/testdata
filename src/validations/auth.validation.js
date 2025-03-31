// src/validations/auth.validation.js
const Joi = require('joi');

const register = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('customer', 'vendor', 'admin').required(),
});


const login = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

const forgotPassword = Joi.object({
  phoneNumber: Joi.string().required(),
});

const resetPassword = Joi.object({
  phoneNumber: Joi.string().required(),
  otp: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
