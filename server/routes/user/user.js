const express = require("express");
const router = express.Router()

router.get("/", (req, res) => {
    res.send({ data: "Test"});
});

router.post("/", (req, res) => {
    res.send({ data: "Test"});
});

router.put("/", (req, res) => {
    res.send({ data: "Test"});
});

router.delete("/", (req, res) => {
    res.send({ data: "Test"});
});

module.exports = router;