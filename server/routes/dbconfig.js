const express = require("express");
const oracledb = require("oracledb");

// Define the global database connection configuration
const dbConfig = {
    user: 'd237pate',
    password: '09247067',
    connectString: '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=oracle.scs.ryerson.ca)(PORT=1521))(CONNECT_DATA=(SID=orcl)))'
  };

module.exports = dbConfig;