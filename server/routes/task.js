const express = require("express");
const router = express.Router()
const oracledb = require('oracledb');

// Fetch all tasks
router.get("/", (req, res) => {
    res.send({ data: "Test"});
});



// Fetch task based on id
router.get("/:id", async (req, res) => {
    const { id: taskId, name, userId } = req.params;


    try {
        let connection = await oracledb.getConnection({
            user: '',
            password: '',
            connectString: '',
        })
    } catch (error) {
        res.status(500).send({
            error: "Error Connnecting to Database",
        })
    }

    try {
        

        // Query to check if the task exists
        const result = await connection.execute(
            `SELECT * FROM tasks WHERE task_id = :taskId`,
            { taskId }
        );

        // If the task exists, return it
        if (result.rows.length === 1) {
            const taskData = result.rows[0];
            res.status(200).send({ data: taskData, message: "Task found!" });
        } else {
            res.status(404).send({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err.message);
            }
        }
    }
});

function isValidUUID(uuid) {
    // Implement your UUID validation logic here
    // You can use a library like 'uuid' to check for valid UUID format
    // Example: return uuidValidate(uuid);
}

module.exports = router;


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