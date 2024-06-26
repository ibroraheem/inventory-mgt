const productService = require('../services/productService');
const { validationResult } = require('express-validator');

const createProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const updatedProduct = await productService.updateProduct(productId, req.body);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await productService.deleteProduct(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const addProductQuantity = async (req, res) => {
    try {
        const productId = req.params.id;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive number' });
        }

        const updatedProduct = await productService.addProductQuantity(productId, quantity);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error adding product quantity:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getAdminDashboardAnalytics = async (req, res) => {
    try {
        const analytics = await productService.getAdminDashboardAnalytics();
        res.status(200).json(analytics);
    } catch (error) {
        console.error('Error fetching admin dashboard analytics:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getSalesRepDashboardAnalytics = async (userId) => {
    try {
        // Total sales count by the sales rep
        const totalSalesCount = await Sale.countDocuments({ user: userId });

        // Total sales amount by the sales rep
        const totalSalesAmount = await Sale.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, totalAmount: { $sum: '$totalAmount' } } }
        ]);

        // Other analytics specific to the sales rep can be added here

        return {
            totalSalesCount,
            totalSalesAmount: totalSalesAmount.length > 0 ? totalSalesAmount[0].totalAmount : 0
            // Add more metrics as needed
        };
    } catch (error) {
        throw new Error(`Error fetching sales rep dashboard analytics: ${error.message}`);
    }
};
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProductQuantity,
    getAdminDashboardAnalytics,
    getSalesRepDashboardAnalytics
};
