const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsonDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./swagger');
const app = express();


// Add Swagger documentation to your Express app
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes
const userRoute = require('./routes/user');
app.use('/user', userRoute);

const taskRoute = require('./routes/task');
app.use('/task', taskRoute);

// Port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  