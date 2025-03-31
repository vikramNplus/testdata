const Joi = require('joi');

const updateProfile = Joi.object({
  name: Joi.string().min(3).max(30),
  profilePic: Joi.string().uri(),
});

const addAddress = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  pincode: Joi.string().pattern(/^\d{6}$/).required(),
  isDefault: Joi.boolean(),
});

const addToCart = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
});

const placeOrder = Joi.object({
  addressId: Joi.string().hex().length(24).required(),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().hex().length(24).required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
});

const cancelOrder = Joi.object({
  orderId: Joi.string().hex().length(24).required(),
});

const deleteAddress = Joi.object({
  addressId: Joi.string().hex().length(24).required(),
});

module.exports = {
  updateProfile,
  addAddress,
  addToCart,
  placeOrder,
  cancelOrder,
  deleteAddress,
};
