const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');
const roles = require('../middleware/roles');

router.post('/', [
    authenticate,
    roles.admin,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('costPrice', 'Cost price must be a number').isNumeric(),
    check('sellingPrice', 'Selling price must be a number').isNumeric(),
    check('quantity', 'Quantity must be a number').isNumeric(),
    check('lowStockThreshold', 'Low stock threshold must be a number').isNumeric(),
], productController.createProduct);

router.get('/', authenticate, roles.salesRep, productController.getAllProducts);

router.get('/:id', authenticate, roles.salesRep, productController.getProductById);

router.put('/:id', [
    authenticate,
    roles.admin,
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('costPrice', 'Cost price must be a number').isNumeric(),
    check('sellingPrice', 'Selling price must be a number').isNumeric(),
    check('quantity', 'Quantity must be a number').isNumeric(),
    check('lowStockThreshold', 'Low stock threshold must be a number').isNumeric(),
], productController.updateProduct);

router.delete('/:id', authenticate, roles.admin, productController.deleteProduct);

router.put('/:id/add-quantity', [
    authenticate,
    roles.admin,
    check('quantity', 'Quantity must be a positive number').isInt({ gt: 0 }),
], productController.addProductQuantity);

router.get('/dashboard/admin', authenticate, roles.admin, productController.getAdminDashboardAnalytics);

router.get('/dashboard/sales-rep', authenticate, roles.salesRep, productController.getSalesRepDashboardAnalytics);

module.exports = router;
