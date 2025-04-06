const Category = require('../../models/category.model');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const createCategory = async (categoryData) => {
  if (await Category.findOne({ name: categoryData.name })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category name already exists');
  }
  return Category.create(categoryData);
};

const getCategories = async () => {
  return Category.find();
};

const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const updateCategory = async (categoryId, updateBody) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }

  if (updateBody.name && (await Category.findOne({ name: updateBody.name, _id: { $ne: categoryId } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category name already exists');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.deleteOne();
};

const updateCategoryStatus = async (categoryId, isActive) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  category.isActive = isActive;
  await category.save();
  return category;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
};
