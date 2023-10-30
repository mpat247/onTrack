const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsonDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./swagger');
const app = express();


// Middleware
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const userRoute = require('./routes/users');
app.use('/users', userRoute);

const taskRoute = require('./routes/tasks');
app.use('/tasks', taskRoute);

// Port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  