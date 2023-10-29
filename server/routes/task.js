const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const uuid = require("uuid");

/**
 * @swagger
 * /task:
 *   get:
 *     summary: Get a list of tasks
 *     description: Retrieve a list of all tasks.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               tasks: []
 */

// Fetch all tasks
router.get("/", async (req, res) => {
    try {
        const connection = await oracledb.getConnection({
            user: "YOUR_DB_USER",
            password: "YOUR_DB_PASSWORD",
            connectString: "YOUR_DB_CONNECT_STRING",
        });

        try {
            // Query to get all tasks
            const result = await connection.execute(
                `SELECT * FROM tasks`
            );

            // If tasks are found, return them
            if (result.rows.length > 0) {
                const tasks = result.rows;
                res.status(200).send({ tasks, message: "Tasks found!" });
            } else {
                res.status(404).send({ error: "No tasks found" });
            }
        } catch (error) {
            res.status(500).send({ error: "Database Query Error", details: error.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
    } catch (error) {
        res.status(500).send({ error: "Database Connection Error", details: error.message });
    }
});

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Retrieve a task by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to retrieve.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               task: { id: 1, description: "Sample Task" }
 */

// Fetch task based on ID
router.get("/:id", async (req, res) => {
    const { id: taskId } = req.params;

    try {
        const connection = await oracledb.getConnection({
            user: "YOUR_DB_USER",
            password: "YOUR_DB_PASSWORD",
            connectString: "YOUR_DB_CONNECT_STRING",
        });

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
            res.status(500).send({ error: "Database Query Error", details: error.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
    } catch (error) {
        res.status(500).send({ error: "Database Connection Error", details: error.message });
    }
});

/**
 * @swagger
 * /task:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with the provided data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             example:
 *               task: { id: 2, description: "New Task" }
 */

// Create a new task
router.post("/", async (req, res) => {
    // Get parameters to insert into the database
    const { description } = req.body; // Assuming you pass data in the request body

    try {
        const connection = await oracledb.getConnection({
            user: "YOUR_DB_USER",
            password: "YOUR_DB_PASSWORD",
            connectString: "YOUR_DB_CONNECT_STRING",
        });

        try {
            // Insert query
            // Example:
            // const result = await connection.execute(
            //     `INSERT INTO tasks (description) VALUES (:description) RETURNING id INTO :id`,
            //     {
            //         description,
            //         id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            //     }
            // );

            // Success response
            // Example:
            // res.status(201).send({ task: { id: result.outBinds.id, description } });
        } catch (error) {
            res.status(500).send({ error: "Database Query Error", details: error.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
    } catch (error) {
        res.status(500).send({ error: "Database Connection Error", details: error.message });
    }
});

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     summary: Update a task by ID
 *     description: Update an existing task by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The updated description of the task.
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             example:
 *               task: { id: 1, description: "Updated Task" }
 */

// Edit Task
router.put("/:id", async (req, res) => {
    // Get parameters to edit
    const { id: taskId } = req.params;
    const { description } = req.body; // Assuming you pass data in the request body

    try {
        const connection = await oracledb.getConnection({
            user: "YOUR_DB_USER",
            password: "YOUR_DB_PASSWORD",
            connectString: "YOUR_DB_CONNECT_STRING",
        });

        try {
            // Update query (example: if (name) { update name field })
            // Example:
            // const result = await connection.execute(
            //     `UPDATE tasks SET description = :description WHERE task_id = :taskId`,
            //     { description, taskId }
            // );

            // Success or fail response
            // Example:
            // if (result.rowsAffected === 1) {
            //     res.status(200).send({ data: "Task updated successfully" });
            // } else {
            //     res.status(404).send({ error: "Task not found" });
            // }
        } catch (error) {
            res.status(500).send({ error: "Database Query Error", details: error.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
    } catch (error) {
        res.status(500).send({ error: "Database Connection Error", details: error.message });
    }
});

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     description: Delete a task by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to delete.
 *     responses:
 *       204:
 *         description: Task deleted successfully
 */

// Delete Task
router.delete("/:id", async (req, res) => {
    const { id: taskId } = req.params;

    try {
        const connection = await oracledb.getConnection({
            user: "YOUR_DB_USER",
            password: "YOUR_DB_PASSWORD",
            connectString: "YOUR_DB_CONNECT_STRING",
        });

        try {
            // Delete task
            // Example:
            // const result = await connection.execute(
            //     `DELETE FROM tasks WHERE task_id = :taskId`,
            //     { taskId }
            // );

            // Success or fail response
            // Example:
            // if (result.rowsAffected === 1) {
            //     res.status(204).send();
            // } else {
            //     res.status(404).send({ error: "Task not found" });
            // }
        } catch (error) {
            res.status(500).send({ error: "Database Query Error", details: error.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
    } catch (error) {
        res.status(500).send({ error: "Database Connection Error", details: error.message });
    }
});

module.exports = router;
