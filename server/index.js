const express = require('express');
const oracledb = require('oracledb');
const app = express();
const bodyParser = require('body-parser');
const swaggerJsonDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./swagger');
const cors = require('cors');

//oracledb.initOracleClient({ libDir: '/Users/manav/Documents/Fourth Year/714/instantclient_19_8' });


// Middleware
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
const userRoute = require('./routes/users');
app.use('/users', userRoute);

const taskRoute = require('./routes/tasks');
app.use('/tasks', taskRoute);

// Port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  


