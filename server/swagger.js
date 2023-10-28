const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'onTrack API Documentation',
      version: '1.0.0',
      description: 'API documentation for onTrack.',
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
