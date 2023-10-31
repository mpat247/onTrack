const express = require('express');
const oracledb = require('oracledb');
const app = express();
const bodyParser = require('body-parser');
const swaggerJsonDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./swagger');


// Middleware
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define a route to perform database operations
app.get('/query', async (req, res) => {
    try {
      const connection = await oracledb.getConnection({
        user: 'mppatel',
        password: '07247756',
        connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.scs.ryerson.ca)(PORT=1521))(CONNECT_DATA=(SID=orcl)))'
      });
  
      const query = 'SELECT * FROM ACCOUNT';
      const result = await connection.execute(query);
      res.json(result.rows);
  
      await connection.close();
    } catch (error) {
      console.error(error);
      res.status(500).send({msg: 'Error querying the database.', error: error.message});
    }
  });
  

// Routes
const userRoute = require('./routes/users');
app.use('/users', userRoute);

const taskRoute = require('./routes/tasks');
app.use('/tasks', taskRoute);

// Port
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  


