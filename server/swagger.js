const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your project.',
    },
    servers: [
      {
        url: 'http://localhost:5001', // Update with your server's URL
      },
    ],
  },
  apis: ['./routes/*.js'], // Update with the path to your route files.
};

const specs = swaggerJsdoc(options);

module.exports = specs;
