// src/validations/product.validation.js
const Joi = require('joi');

const createProduct = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().valid('vegetable', 'fruit', 'dairy').required(),
  price: Joi.number().required(),
  unit: Joi.string().valid('kg', 'dozen', 'piece').required(),
  stock: Joi.number().default(0)
});

const updateProduct = Joi.object({
  name: Joi.string(),
  category: Joi.string().valid('vegetable', 'fruit', 'dairy'),
  price: Joi.number(),
  unit: Joi.string().valid('kg', 'dozen', 'piece'),
  stock: Joi.number().default(0)
});

const updateStatus = {
  params: Joi.object().keys({
    productId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    active: Joi.boolean().required(),
  }),
};
module.exports = {
  createProduct,
  updateProduct,
  updateStatus
};
