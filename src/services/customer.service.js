
const { Customer, Address, Cart } = require('../models');
const { Order } = require('../models/order.model');
const { Product } = require('../models/product.model');
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
  const newItem = new Cart({
    ...cartItem,
    customer: customerId,
  });

  await newItem.save();
  return newItem;
};

const getCustomerCart = async (customerId) => {
  return Cart.find({ customer: customerId }).populate('productId');
};

const removeFromCart = async (customerId, cartItemId) => {
  const item = await Cart.findOneAndDelete({ _id: cartItemId, customer: customerId });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Cart item not found');
  }
  return item;
};

const placeOrder = async (customerId, { items }) => {
  // Fetch the products from the database using 'productId'
  const products = await Product.find({ _id: { $in: items.map(item => item.productId) } });

  // Calculate the total price
  const totalPrice = items.reduce((total, item) => {
    console.log('Item:', item, total);

    // Find the product from the database
    const product = products.find(p => p._id.toString() === item.productId.toString()); 

    if (product) {
      // If product found, calculate price
      return total + (product.price * item.quantity); 
    }
    return total;
  }, 0);

  console.log('Total Price:', totalPrice);

  // Create a new order
  const order = new Order({
    customer: customerId,
    items,  // You can directly use items as the 'productId' is already included
    totalPrice,
    status: 'placed',
    createdAt: new Date(),
  });

  await order.save();

  // Clear the cart after placing the order
  await Cart.deleteMany({ customer: customerId });

  return order;
};

const getCustomerOrders = async (customerId) => {
  return Order.find({ customer: customerId }).populate('items.productId').sort({ createdAt: -1 });
};

const getOrderDetails = async (customerId, orderId) => {
  const order = await Order.findOne({ _id: orderId, customer: customerId }).populate('items.productId');
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
