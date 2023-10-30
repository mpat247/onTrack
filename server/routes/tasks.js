const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const { v4: uuidv4 } = require('uuid');
const dbConfig = require("../dbconfig");

/**
 * @swagger
 * /tasks:
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
    const { userId } = req.params; // Assuming you have 'userId' in your request

    try {
        const connection = await oracledb.getConnection(dbConfig);

        try {
            // Query to get all tasks
            const result = await connection.execute(
                `SELECT * FROM tasks WHERE userid = :userId`,
                { userId }
            );

            // If tasks are found, return them
            if (result.rows.length > 0) {
                const tasks = result.rows;
                res.status(200).send({ payload: tasks, msg: "Tasks found!" });
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
 * /tasks/{id}:
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
        const connection = await oracledb.getConnection(dbConfig);

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
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with the provided data.
 *     parameters:
 *       - in: body
 *         name: requestBody
 *         description: Request body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   type: string
 *                   description: The name of the task.
 *                 description:
 *                   type: string
 *                   description: The description of the task.
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   description: The user ID associated with the task (in UUID format).
 *                 progress:
 *                   type: string
 *                   description: The progress of the task (string).
 *                 createDate:
 *                   type: string
 *                   description: The date when the task was created (string).
 *                 endDate:
 *                   type: string
 *                   description: The date when the task ends (string).
 *                 priority:
 *                   type: string
 *                   description: The priority of the task (string)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               task: {
 *                 task: "New Task",
 *                 description: "Task description",
 *                 userId: "4d7e9d4b-4cc0-4cc1-8b04-93b6c2f8de2b",
 *                 progress: "50",
 *                 createDate: "2023-10-29",
 *                 endDate: "2023-11-29",
 *                 priority: "High"
 *               }
 */


// Create a new task
router.post("/", async (req, res) => {
    console.log(req.body);
    // Get parameters to insert into the database from the request body
    const {task, description, userId, progress, createDate, endDate, priority} = req.body;
    console.log(task,description, userId, progress, createDate, endDate, priority);
    // Generate a new UUID for task
    const taskId = uuidv4();

    /// Check if parameters exist and have the correct data types
if (!task) {
    return res.status(400).send({ error: "Task name (task) is required" });
} else if (typeof task !== 'string') {
    return res.status(400).send({ error: "Task name (task) must be a string" });
}

if (!userId) {
    return res.status(400).send({ error: "User ID (userId) is required" });
} else if (!uuidv4(userId)) {
    return res.status(400).send({ error: "User ID (userId) must be a valid UUID" });
}

if (!progress) {
    return res.status(400).send({ error: "Task progress (progress) is required" });
} else if (typeof progress !== 'string') {
    return res.status(400).send({ error: "Task progress (progress) must be a string" });
}

if (!description) {
    return res.status(400).send({ error: "Task description (description) is required" });
} else if (typeof description !== 'string') {
    return res.status(400).send({ error: "Task description (description) must be a string" });
}


    // // Check if the user exists
    // let userExists = false;
    // try {
    //     const userConnection = await oracledb.getConnection(dbConfig);
    //     const userResult = await userConnection.execute(
    //         `SELECT * FROM users WHERE userId = :userId`,
    //         { userId }
    //     );
    //     userExists = userResult.rows.length > 0;
    //     await userConnection.close();
    // } catch (error) {
    //     console.error("Error checking user existence: ", error);
    //     return res.status(500).send({ error: "Database Error", details: error.message });
    // }

    // if (!userExists) {
    //     return res.status(400).send({ error: "User does not exist" });
    // }

    // // Check if the task with the same parameters already exists
    // let taskExists = false;
    // try {
    //     const taskConnection = await oracledb.getConnection(dbConfig);
    //     const taskResult = await taskConnection.execute(
    //         `SELECT * FROM tasks WHERE USER_ID = :userId AND TASK_ID = :taskId AND TASK_NAME = :task`,
    //         { userId, taskId, task }
    //     );
    //     taskExists = taskResult.rows.length > 0;
    //     await taskConnection.close();
    // } catch (error) {
    //     console.error("Error checking task existence: ", error);
    //     return res.status(500).send({ error: "Database Error", details: error.message });
    // }

    // if (taskExists) {
    //     return res.status(400).send({ error: "Task already exists" });
    // }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        try {
            // Insert query to insert the new task into the database
            const result = await connection.execute(
                `INSERT INTO tasks (TASK_ID, TASK_NAME, TASK_DESCRIPTION, USER_ID, TASK_PROGRESS, TASK_CREATEDATE, TASK_ENDDATE, TASK_PRIORITY) VALUES (:TASK_ID, :TASK_NAME, :TASK_DESCRIPTION, :USER_ID, :TASK_PROGRESS, :TASK_CREATEDATE, :TASK_ENDDATE, :TASK_PRIORITY)`,
                {
                    TASK_ID: taskId,
                    TASK_NAME: task,
                    TASK_DESCRIPTION: description,
                    USER_ID: userId,
                    TASK_PROGRESS: progress,
                    TASK_CREATEDATE: createDate,
                    TASK_ENDDATE: endDate,
                    TASK_PRIORITY: priority,
                }
            );

            // Success response
            res.status(200).send({ payload: result, message: "Task created successfully" });
        } catch (error) {
            res.status(500).send({ error: error, message: "Database Query Error" });
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
 * /tasks/{id}:
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
        const connection = await oracledb.getConnection(dbConfig);

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
 * /tasks/{id}:
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
        const connection = await oracledb.getConnection(dbConfig);

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
