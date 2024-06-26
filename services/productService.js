const Product = require('../models/Product');

class ProductService {
    async createProduct(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async getAllProducts() {
        return await Product.find();
    }

    async getProductById(productId) {
        return await Product.findById(productId);
    }

    async updateProduct(productId, updatedData) {
        return await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    }

    async deleteProduct(productId) {
        return await Product.findByIdAndRemove(productId);
    }

    async getAdminDashboardAnalytics() {
        const products = await Product.find();
        const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);
        const totalCostPrice = products.reduce((acc, product) => acc + (product.costPrice * product.quantity), 0);
        const totalSellingPrice = products.reduce((acc, product) => acc + (product.sellingPrice * product.quantity), 0);
        
        return {
            totalProducts: products.length,
            totalQuantity,
            totalCostPrice,
            totalSellingPrice
        };
    }

    async getSalesRepDashboardAnalytics(userId) {
        const totalSales = 0;
        return { totalSales };
    }

    async addProductQuantity(productId, quantityToAdd) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        product.quantity += quantityToAdd;
        return await product.save();
    }
}

module.exports = new ProductService();
