const productService = require('../services/productService');
const salesService = require('../services/salesService');

const adminDashboard = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        const totalInventoryValue = products.reduce((acc, product) => acc + (product.costPrice * product.quantity), 0);
        const totalSellingValue = products.reduce((acc, product) => acc + (product.sellingPrice * product.quantity), 0);
        const totalQuantity = products.reduce((acc, product) => acc + product.quantity, 0);
        const sales = await salesService.getAllSales();

        res.status(200).json({
            totalInventoryValue,
            totalSellingValue,
            totalQuantity,
            totalSales: sales.length,
            totalSalesValue: sales.reduce((acc, sale) => acc + sale.totalPrice, 0),
            productAnalytics: await salesService.getProductSalesAnalytics()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const salesRepDashboard = async (req, res) => {
    try {
        const sales = await salesService.getSalesByUser(req.user.id);

        res.status(200).json({
            totalSales: sales.length,
            totalSalesValue: sales.reduce((acc, sale) => acc + sale.totalPrice, 0),
            mostSoldProducts: (await salesService.getProductSalesAnalytics()).mostSold.slice(0, 5)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    adminDashboard,
    salesRepDashboard
};
