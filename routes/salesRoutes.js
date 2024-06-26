const express = require('express');
const { check } = require('express-validator');
const salesController = require('../controllers/salesController');
const authenticate = require('../middleware/authenticate');
const roles = require('../middleware/roles');

const router = express.Router();

// Create Sale
router.post('/',
    [
        authenticate,
        check('products', 'Products are required').isArray(),
        check('products.*.productId', 'Product ID is required').not().isEmpty(),
        check('products.*.quantity', 'Quantity is required and must be a positive number').isInt({ gt: 0 })
    ],
    salesController.createSale
);

// Get Receipts for logged-in user
router.get('/receipts', authenticate, salesController.getReceipts);

// Get all sales (admin only)
router.get('/all', authenticate, roles.admin, salesController.getAllSales);

// Get sales by user (admin only)
router.get('/user/:userId', authenticate, roles.admin, salesController.getSalesByUser);

// Get product sales analytics (admin only)
router.get('/analytics', authenticate, roles.admin, salesController.getProductSalesAnalytics);

module.exports = router;
