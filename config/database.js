const mongoose = require('mongoose');
const { DB_URI } = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
