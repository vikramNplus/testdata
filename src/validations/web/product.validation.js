const Joi = require('joi');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    price: Joi.number().positive().required(),
    unit: Joi.string().valid('kg', 'dozen', 'piece').required(),
    stock: Joi.number().integer().min(0).default(0),
    image: Joi.string().optional(),
    description :Joi.string().optional(),
    
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().trim().optional(),
    category: Joi.string().optional(),
    subcategory: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    unit: Joi.string().valid('kg', 'dozen', 'piece').optional(),
    stock: Joi.number().integer().min(0).optional(),
    image: Joi.string().optional(),
    description :Joi.string().optional(),

  }),
};

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
  updateStatus,
};
