
const { Customer, Address, Product, Cart, Order } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const getCustomerProfile = async (customerId) => {
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  return customer;
};

const updateCustomerProfile = async (customerId, updateBody) => {
  const customer = await Customer.findByIdAndUpdate(customerId, updateBody, { new: true });
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  return customer;
};

const addCustomerAddress = async (customerId, addressBody) => {
  const address = new Address({ ...addressBody, customer: customerId });
  await address.save();
  return address;
};

const getCustomerAddresses = async (customerId) => {
  return Address.find({ customer: customerId });
};

const deleteCustomerAddress = async (customerId, addressId) => {
  const address = await Address.findOneAndDelete({ _id: addressId, customer: customerId });
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  return address;
};

const getAvailableProducts = async (category) => {
  const query = category ? { category } : {};
  return Product.find(query);
};

const addToCart = async (customerId, cartItem) => {
  const existingItem = await Cart.findOne({ customer: customerId, product: cartItem.productId });
  if (existingItem) {
    existingItem.quantity += cartItem.quantity;
    await existingItem.save();
    return existingItem;
  }
  const newItem = new Cart({ ...cartItem, customer: customerId });
  await newItem.save();
  return newItem;
};

const getCustomerCart = async (customerId) => {
  return Cart.find({ customer: customerId }).populate('product');
};

const removeFromCart = async (customerId, cartItemId) => {
  const item = await Cart.findOneAndDelete({ _id: cartItemId, customer: customerId });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }
  return item;
};

const placeOrder = async (customerId, { addressId, items }) => {
  const order = new Order({
    customer: customerId,
    address: addressId,
    items,
    status: 'Placed',
    createdAt: new Date()
  });
  await order.save();
  await Cart.deleteMany({ customer: customerId }); // Clear cart after placing order
  return order;
};

const getCustomerOrders = async (customerId) => {
  return Order.find({ customer: customerId }).populate('items.product').sort({ createdAt: -1 });
};

const getOrderDetails = async (customerId, orderId) => {
  const order = await Order.findOne({ _id: orderId, customer: customerId }).populate('items.product');
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return order;
};

const cancelOrder = async (customerId, orderId) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId, customer: customerId },
    { status: 'Cancelled' },
    { new: true }
  );
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return order;
};

const trackOrder = async (customerId, orderId) => {
  const order = await Order.findOne({ _id: orderId, customer: customerId });
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
  }
  return {
    status: order.status,
    updatedAt: order.updatedAt,
  };
};

module.exports = {
  getCustomerProfile,
  updateCustomerProfile,
  addCustomerAddress,
  getCustomerAddresses,
  deleteCustomerAddress,
  getAvailableProducts,
  addToCart,
  getCustomerCart,
  removeFromCart,
  placeOrder,
  getCustomerOrders,
  getOrderDetails,
  cancelOrder,
  trackOrder,
};
