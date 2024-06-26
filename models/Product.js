const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    supplier: { type: String },
    quantity: { type: Number, required: true },
    lowStockThreshold: { type: Number, required: true, default: 10 }, // default threshold set to 10
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
