const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Inventory APP',
        description: 'Inventory API documentation',
    },
    host: 'inventory-mgt.onrender.com',
    schemes: ['https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/authRoutes.js', './routes/dashboardRoutes.js', './routes/productRoutes.js', './routes/salesRoutes.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
