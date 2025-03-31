const Order = require('../../models/address.model');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const createOrder = async (customerId, orderData) => {
  return Order.create({ customer: customerId, ...orderData });
};

const getOrders = async (user) => {
  if (user.role === 'admin') {
    return Order.find().populate('customer items.product');
  }
  return Order.find({ customer: user.id }).populate('items.product');
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate('customer items.product');
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  order.status = status;
  await order.save();
  return order;
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
