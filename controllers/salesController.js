// controllers/salesController.js
const { validationResult } = require('express-validator');
const salesService = require('../services/salesService');

const createSale = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { products } = req.body;

    try {
        const sale = await salesService.createSale(req.user.id, products);
        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getReceipts = async (req, res) => {
    try {
        const sales = await salesService.getReceipts(req.user.id);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllSales = async (req, res) => {
    try {
        const sales = await salesService.getAllSales();
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSalesByUser = async (req, res) => {
    try {
        const sales = await salesService.getSalesByUser(req.params.userId);
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductSalesAnalytics = async (req, res) => {
    try {
        const analytics = await salesService.getProductSalesAnalytics();
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSale,
    getReceipts,
    getAllSales,
    getSalesByUser,
    getProductSalesAnalytics
};
