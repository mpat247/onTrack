const express = require("express");
const router = express.Router()

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               users: []
 */ 
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