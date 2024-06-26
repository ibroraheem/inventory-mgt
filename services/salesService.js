// services/salesService.js
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const User = require('../models/User');

const createSale = async (userId, products) => {
    let totalPrice = 0;

    const productDetails = await Promise.all(products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new Error(`Product with ID ${item.productId} not found`);
        }
        if (product.quantity < item.quantity) {
            throw new Error(`Insufficient quantity for product ${product.name}`);
        }
        const productTotal = product.sellingPrice * item.quantity;
        totalPrice += productTotal;

        return {
            product: item.productId,
            quantity: item.quantity,
            price: product.sellingPrice
        };
    }));

    const sale = new Sale({
        products: productDetails,
        totalPrice,
        user: userId
    });

    await sale.save();

    await Promise.all(products.map(async (item) => {
        const product = await Product.findById(item.productId);
        product.quantity -= item.quantity;
        await product.save();
    }));

    return sale;
};

const getReceipts = async (userId) => {
    return await Sale.find({ user: userId }).populate('products.product');
};

const getAllSales = async () => {
    return await Sale.find().populate('products.product').populate('user');
};

const getSalesByUser = async (userId) => {
    return await Sale.find({ user: userId }).populate('products.product');
};

const getProductSalesAnalytics = async () => {
    const sales = await Sale.find().populate('products.product');

    const productAnalytics = {};

    sales.forEach(sale => {
        sale.products.forEach(item => {
            const productId = item.product._id.toString();
            if (!productAnalytics[productId]) {
                productAnalytics[productId] = {
                    name: item.product.name,
                    totalSold: 0,
                    totalRevenue: 0,
                };
            }
            productAnalytics[productId].totalSold += item.quantity;
            productAnalytics[productId].totalRevenue += item.quantity * item.price;
        });
    });

    const analyticsArray = Object.keys(productAnalytics).map(productId => ({
        productId,
        ...productAnalytics[productId],
    }));

    return {
        mostSold: analyticsArray.sort((a, b) => b.totalSold - a.totalSold),
        leastSold: analyticsArray.sort((a, b) => a.totalSold - b.totalSold),
    };
};

module.exports = {
    createSale,
    getReceipts,
    getAllSales,
    getSalesByUser,
    getProductSalesAnalytics
};
