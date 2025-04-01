const express = require('express');
const adminController  = require('../../../controllers/web/admin.controller');

const router = express.Router();

// Dashboard summary API
router.get('/dashboard-summary', adminController.getDashboardSummary);

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-related APIs
 */

/**
 * @swagger
 * /admin/dashboard-summary:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard summary with total customers, orders, and revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCustomers:
 *                   type: integer
 *                   example: 120
 *                 totalOrders:
 *                   type: integer
 *                   example: 50
 *                 totalRevenue:
 *                   type: number
 *                   example: 1200.50
 */
