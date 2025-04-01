const Joi = require('joi');
const { objectId } = require('../custom.validation');

const createCustomer = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phoneNumber: Joi.string().required().pattern(/^\d+$/).min(10).max(15),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),

  }),
};

const getCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
};

const updateCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    phoneNumber: Joi.string().pattern(/^\d+$/).min(10).max(15),
    password: Joi.string().min(8),
    email: Joi.string().email(),

  }),
};

const deleteCustomer = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
};

const updateStatus = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    isActive: Joi.boolean().required(),
  }),
};

module.exports = {
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  updateStatus,
};
