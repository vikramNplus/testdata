const httpStatus = require('http-status');
const customerService = require('../services/customer.service');
const ApiError = require('../utils/ApiError');

class CustomerController {
  async getProfile(req, res) {
    const profile = await customerService.getCustomerProfile(req.user._id);
    res.send(profile);
  }

  async updateProfile(req, res) {
    const updatedProfile = await customerService.updateCustomerProfile(req.user._id, req.body);
    res.send(updatedProfile);
  }

  async addAddress(req, res) {
    const address = await customerService.addCustomerAddress(req.user._id, req.body);
    res.status(httpStatus.CREATED).send(address);
  }

  async getAddresses(req, res) {
    const addresses = await customerService.getCustomerAddresses(req.user._id);
    res.send(addresses);
  }

  async deleteAddress(req, res) {
    const deletedAddress = await customerService.deleteCustomerAddress(req.user._id, req.params.addressId);
    res.send(deletedAddress);
  }

  async getProducts(req, res) {
    const products = await customerService.getAvailableProducts(req.query.category);
    res.send(products);
  }

  async addToCart(req, res) {
    const cartItem = await customerService.addToCart(req.user._id, req.body);
    res.status(httpStatus.CREATED).send(cartItem);
  }

  async getCart(req, res) {
    const cart = await customerService.getCustomerCart(req.user._id);
    res.send(cart);
  }

  async removeFromCart(req, res) {
    const cartItem = await customerService.removeFromCart(req.user._id, req.params.cartItemId);
    res.send(cartItem);
  }

  async placeOrder(req, res) {
    const order = await customerService.placeOrder(req.user._id, req.body);
    res.status(httpStatus.CREATED).send(order);
  }

  async getOrders(req, res) {
    const orders = await customerService.getCustomerOrders(req.user._id);
    res.send(orders);
  }

  async getOrderDetails(req, res) {
    const order = await customerService.getOrderDetails(req.user._id, req.params.orderId);
    res.send(order);
  }

  async cancelOrder(req, res) {
    const order = await customerService.cancelOrder(req.user._id, req.params.orderId);
    res.send(order);
  }

  async trackOrder(req, res) {
    const trackingInfo = await customerService.trackOrder(req.user._id, req.params.orderId);
    res.send(trackingInfo);
  }
}

module.exports = new CustomerController();
