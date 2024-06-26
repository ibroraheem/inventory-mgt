const express = require('express');
const authenticate = require('../middleware/authenticate');
const roles = require('../middleware/roles');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Admin dashboard
router.get('/admin', authenticate, roles.admin, dashboardController.adminDashboard);

// Sales rep dashboard
router.get('/sales-rep', authenticate, roles.salesRep, dashboardController.salesRepDashboard);

module.exports = router;
