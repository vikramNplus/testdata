const Subcategory = require('../../models');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

const createSubcategory = async (subcategoryData) => {
  if (await Subcategory.findOne({ name: subcategoryData.name })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Subcategory name already exists');
  }
  return Subcategory.create(subcategoryData);
};

const getSubcategoryById = async (id) => {
  return Subcategory.findById(id).populate('category');
};

const getAllSubcategories = async () => {
  return Subcategory.find().populate('category');
};

const updateSubcategory = async (id, updateData) => {
  const subcategory = await Subcategory.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found');
  }
  return subcategory;
};

const deleteSubcategory = async (id) => {
  const subcategory = await Subcategory.findByIdAndDelete(id);
  if (!subcategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found');
  }
};
const updateSubcategoryStatus = async (subcategoryId, isActive) => {
    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Subcategory not found');
    }
  
    subcategory.isActive = isActive;
    await subcategory.save();
    return subcategory;
  };
  

module.exports = {
  createSubcategory,
  getSubcategoryById,
  getAllSubcategories,
  updateSubcategory,
  deleteSubcategory,
  updateSubcategoryStatus,
};
