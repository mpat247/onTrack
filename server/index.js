const express = require('express')
const app = express();

app.get("/api", (req, res) => {
    res.json({"1": ["2", "3", "4"] })
})

app.listen(5001, () => {console.log("server started on port 5001")})