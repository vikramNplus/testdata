const { User } = require('../../models/user.model');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');

const createCustomer = async (customerData) => {
  if (await User.isPhoneTaken(customerData.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already in use');
  }
  customerData.password = await bcrypt.hash(customerData.password, 8);
  return User.create({ ...customerData, role: 'customer' });
};

const getCustomers = async () => {
  return User.find({ role: 'customer' });
};

const getCustomerById = async (customerId) => {
  const customer = await User.findOne({ _id: customerId, role: 'customer' });
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  return customer;
};

const updateCustomer = async (customerId, updateBody) => {
  const customer = await User.findOne({ _id: customerId, role: 'customer' });
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }

  if (updateBody.phoneNumber && (await User.isPhoneTaken(updateBody.phoneNumber, customerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already in use');
  }

  Object.assign(customer, updateBody);
  await customer.save();
  return customer;
};

const deleteCustomer = async (customerId) => {
  const customer = await User.findOne({ _id: customerId, role: 'customer' });
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  await customer.deleteOne();
};

const updateCustomerStatus = async (customerId, isActive) => {
  const customer = await User.findOne({ _id: customerId, role: 'customer' });
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  customer.isActive = isActive;
  await customer.save();
  return customer;
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  updateCustomerStatus,
};
