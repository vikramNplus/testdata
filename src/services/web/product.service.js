// src/services/product.service.js
const httpStatus = require('http-status');
const { Product } = require('../../models');
const ApiError = require('../../utils/ApiError');

// Create a new product
const createProduct = async (productBody) => {
  const product = await Product.create(productBody);
  return product;
};

// Get all products with pagination and filtering
const getProducts = async (filter) => {
  const products = await Product.paginate(filter, {
    limit: 10, 
    page: filter.page || 1,
  });
  return products;
};

// Get a product by ID
const getProductById = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return product;
};

// Update a product by ID
const updateProduct = async (productId, updateBody) => {
  const product = await getProductById(productId);
  
  Object.assign(product, updateBody);
  await product.save();

  return product;
};

// Delete a product by ID
const deleteProduct = async (productId) => {
  const product = await getProductById(productId);
  await product.deleteOne();
};

const updateProductStatus = async (productId, active) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.active = active;
  await product.save();
  return product;
};
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus
};
