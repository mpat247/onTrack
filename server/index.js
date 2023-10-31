const express = require('express');
const oracledb = require('oracledb');
const app = express();

// Define a route to perform database operations
app.get('/query', async (req, res) => {
    try {
      const connection = await oracledb.getConnection({
        user: '',
        password: '',
        connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.scs.ryerson.ca)(PORT=1521))(CONNECT_DATA=(SID=orcl)))'
      });
  
      const query = 'SELECT * FROM account';
      const result = await connection.execute(query);
      res.json(result.rows);
  
      await connection.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('Error querying the database.');
    }
  });
  
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });