const express = require('express')
const app = express();

app.get("/api", (req, res) => {
    res.json({"1": ["2", "3", "4"] })
})

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));  