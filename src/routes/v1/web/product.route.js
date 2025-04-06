// src/routes/product.route.js
const express = require('express');
const validate = require('../../../middlewares/validate');
const productValidation = require('../../../validations/web/product.validation');
const productController = require('../../../controllers/web/product.controller');
const upload = require('../../../middlewares/upload'); // Import multer middleware

const auth = require('../../../middlewares/auth');

const router = express.Router();


router.post(
    '/',
    auth('admin'),
    upload.single('image'), // Handle single file upload
    validate(productValidation.createProduct),
    productController.createProduct
  );

// Get all products
router.get('/', productController.getProducts);

// Get a single product by ID
router.get('/:productId', productController.getProductById);

// Update a product (admin only)
router.put('/:productId', auth('admin'), validate(productValidation.updateProduct), productController.updateProduct);

// Delete a product (admin only)
router.delete('/:productId', auth('admin'), productController.deleteProduct);
router.patch('/:productId/status', auth('admin'), validate(productValidation.updateStatus), productController.updateProductStatus);

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management operations
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Apple"
 *               category:
 *                 type: string
 *                 example: "Fruits"
 *               subcategory:  # Fixed "Subcategory" key (lowercase 's')
 *                 type: string
 *                 example: "Citrus"
 *               price:
 *                 type: number
 *                 example: 2.99
 *               unit:
 *                 type: string
 *                 enum: [kg, dozen, piece]
 *                 example: "kg"
 *               stock:
 *                 type: number
 *                 example: 100
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 */

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               subcategory:  # Fixed "Subcategory" key (lowercase 's')
 *                 type: string
 *               price:
 *                 type: number
 *               unit:
 *                 type: string
 *                 enum: [kg, dozen, piece]
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{productId}/status:
 *   patch:
 *     summary: Update product status (Active/Inactive)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *       404:
 *         description: Product not found
 */
