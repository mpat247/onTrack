const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Routes
const userRoute = require('./routes/user/user');
app.use('/user', userRoute);

const taskRoute = require('./routes/task/task');
app.use('/task', taskRoute);

// Port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  