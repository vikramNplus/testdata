const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const categoryController = require('../../../controllers/web/category.controller');
const categoryValidation = require('../../../validations/web/category.validation');
const upload = require('../../../middlewares/upload'); // Import multer middleware

const router = express.Router();

// Create a new category (admin only)
router.post(
    '/',
    auth('admin'),
    upload.single('image'), // Handle single file upload
    validate(categoryValidation.createCategory),
    categoryController.createCategory
  );

// Get all categories
router.get('/', categoryController.getCategories);

// Get a single category by ID
router.get('/:categoryId', validate(categoryValidation.getCategory), categoryController.getCategoryById);

// Update a category (admin only)
router.put('/:categoryId', auth('admin'), upload.single('image'), validate(categoryValidation.updateCategory), categoryController.updateCategory);

// Delete a category (admin only)
router.delete('/:categoryId', auth('admin'), validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

// Change category status (active/inactive)
router.patch('/:categoryId/status', auth('admin'), validate(categoryValidation.updateStatus), categoryController.updateCategoryStatus);

module.exports = router;


/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 *
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 *
 * /categories/{categoryId}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *
 *   put:
 *     summary: Update a category
 *
 *   delete:
 *     summary: Delete a category
 *
 * /categories/{categoryId}/status:
 *   patch:
 *     summary: Change category status
 */
