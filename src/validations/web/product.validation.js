// src/validations/web/product.validation.js
const Joi = require('joi');



const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string().valid('vegetable', 'fruit', 'dairy').required(),
    price: Joi.number().required(),
    unit: Joi.string().valid('kg', 'dozen', 'piece').required(),
    stock: Joi.number().default(0),
    image: Joi.string().required(), 
  }),
};
const updateProduct = {
  body: Joi.object().keys({
    name: Joi.string(),
    category: Joi.string().valid('vegetable', 'fruit', 'dairy'),
    price: Joi.number(),
    unit: Joi.string().valid('kg', 'dozen', 'piece'),
    stock: Joi.number().default(0),
    image: Joi.string().required(), 
  }),
};

const updateStatus = {
  params: Joi.object().keys({
    productId: Joi.string().hex().length(24).required(), // Ensure productId is a valid MongoDB ObjectId
  }),
  body: Joi.object().keys({
    active: Joi.boolean().required(),
  }),
};

module.exports = {
  createProduct,
  updateProduct,
  updateStatus,
};
