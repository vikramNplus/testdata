// src/routes/product.route.js
const express = require('express');
const validate = require('../../../middlewares/validate');
const productValidation = require('../../../validations/web/product.validation');
const productController = require('../../../controllers/web/product.controller');

const auth = require('../../../middlewares/auth');

const router = express.Router();

router.post('/', auth('admin'), validate(productValidation.createProduct), productController.createProduct);

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
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *           enum: [vegetable, fruit, dairy]
 *         price:
 *           type: number
 *         unit:
 *           type: string
 *           enum: [kg, dozen, piece]
 *         stock:
 *           type: integer
 *       required:
 *         - name
 *         - category
 *         - price
 *         - unit
 */
/**
 * @swagger
 * /products/{productId}/status:
 *   patch:
 *     summary: Update a product's active status
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID
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
 *                 example: false
 *     responses:
 *       200:
 *         description: Product status updated
 *       404:
 *         description: Product not found
 */
