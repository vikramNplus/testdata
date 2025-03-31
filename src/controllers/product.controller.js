// src/controllers/product.controller.js
const httpStatus = require('http-status');
const productService = require('../services/product.service');
const ApiError = require('../utils/ApiError');

// Create a new product
const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(httpStatus.CREATED).send(product);
};

// Get all products
const getProducts = async (req, res) => {
  const products = await productService.getProducts(req.query);
  res.send(products);
};

// Get a single product by ID
const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  res.send(product);
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.productId, req.body);
  res.send(product);
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.productId);
  res.status(httpStatus.NO_CONTENT).send();
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
