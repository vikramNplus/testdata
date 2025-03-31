const { Customer, Address, Product, Order } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

class CustomerService {
  /**
   * Get customer profile with addresses
   */
  async getCustomerProfile(userId) {
    return Customer.findOne({ user: userId }).populate('addresses');
  }

  /**
   * Add new address for customer
   */
  async addCustomerAddress(userId, addressData) {
    const address = await Address.create({ ...addressData, user: userId });
    await Customer.findOneAndUpdate(
      { user: userId },
      { $push: { addresses: address._id } }
    );
    return address;
  }

  /**
   * Get available products with optional filtering
   */
  async getAvailableProducts(category) {
    const filter = category ? { category, isAvailable: true } : { isAvailable: true };
    return Product.find(filter).select('name price category imageUrl unit');
  }

  /**
   * Place a new order
   */
  async placeOrder(userId, orderData) {
    // Verify all products exist and are available
    const productIds = orderData.items.map(item => item.productId);
    const products = await Product.find({ 
      _id: { $in: productIds },
      isAvailable: true 
    });

    if (products.length !== productIds.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'One or more products are unavailable');
    }

    // Create order
    return Order.create({
      customer: userId,
      address: orderData.addressId,
      items: orderData.items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        priceAtOrder: products.find(p => p._id.equals(item.productId)).price
      })),
      status: 'placed'
    });
  }

  /**
   * Cancel an order
   */
  async cancelOrder(userId, orderId) {
    const order = await Order.findOneAndUpdate(
      { _id: orderId, customer: userId, status: 'placed' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found or cannot be cancelled');
    }

    return order;
  }
}

module.exports = new CustomerService();