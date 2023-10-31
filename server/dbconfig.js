// Define the global database connection configuration
const dbConfig = {
    user: "ontrack",
    password: "ontrack",
    connectString:"(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SID=xe)))"
};

module.exports = dbConfig;