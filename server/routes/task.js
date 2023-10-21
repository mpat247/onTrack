const express = require("express");
const router = express.Router()

// Fetch all tasks
router.get("/", (req, res) => {
    res.send({ data: "Test"});
});

// Fetch task based on id
router.get("/id", (req, res) => {
    res.send({ data: "Test"});
});

// Create a new task
router.post("/", (req, res) => {
    res.send({ data: "Test"});
});

// Edit Task
router.put("/", (req, res) => {
    res.send({ data: "Test"});
});

// Delete Task
router.delete("/", (req, res) => {
    res.send({ data: "Test"});
});

module.exports = router;