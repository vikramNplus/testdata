const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const orderController = require('../../../controllers/web/order.controller');
const orderValidation = require('../../../validations/web/order.validation');

const router = express.Router();

// Create Order (Customer Only)
router.post('/', auth('customer'), validate(orderValidation.createOrder), orderController.createOrder);

// Get Orders (Customer & Admin)
router.get('/', auth(), orderController.getOrders);

// Get Order by ID
router.get('/:orderId', auth(), validate(orderValidation.getOrder), orderController.getOrderById);

// Admin: Update Order Status
router.patch('/:orderId/status', auth('admin'), validate(orderValidation.updateStatus), orderController.updateOrderStatus);

module.exports = router;

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order created
 *
 *   get:
 *     summary: Get all orders (Admin & Customer)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *
 * /orders/{orderId}:
 *   get:
 *     summary: Get order details
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *
 * /orders/{orderId}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
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
 *               status:
 *                 type: string
 *                 enum: [placed, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         customer:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *           enum: [placed, delivered, cancelled]
 */
