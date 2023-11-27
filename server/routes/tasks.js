const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const { v4: uuidv4 } = require('uuid');
const dbConfig = require("./dbconfig");


// Fetch all tasks
router.get("/", async (req, res) => {
    const { userId } = req.params; // Assuming you have 'userId' in your request

    try {
        const connection = await oracledb.getConnection(dbConfig);

        try {
            // Query to get all tasks
            const result = await connection.execute(
                `SELECT * FROM TASK`
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

// Fetch tasks based on userID
router.get("/users/:userId", async (req, res) => {
    const { userId } = req.params;
    console.log(userId)

    try {
        const connection = await oracledb.getConnection(dbConfig);

        try {
            // Query to fetch tasks for the user
            const result = await connection.execute(
                `SELECT * FROM TASK WHERE USER_ID = :userId`,
                { userId: userId } // Make sure userId is correctly formatted as per the database
            );
            // Check if any task exists
            if (result.rows.length > 0) {
                // Create an array of tasks
                const tasks = result.rows.map((row) => {
                    return {
                        taskId: row[0],
                        taskname: row[1],
                        description: row[2],
                        userid: row[3],
                        createdate: row[4],
                        enddate: row[5],
                        priority: row[6],
                        progress: row[7]
                    };
                });
            
                res.status(200).send({ data: tasks, message: "Tasks found!" });
            } else {
                res.status(404).send({ error: "Tasks not found" });
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

// Fetch task based on taskId
router.get("/tasks/:taskId", async (req, res) => {
    const { taskId } = req.params;
    console.log(taskId)

    try {
        const connection = await oracledb.getConnection(dbConfig);

        try {
            // Query to fetch task for the task id
            const result = await connection.execute(
                `SELECT * FROM TASK WHERE TASK_ID = :taskId`,
                { taskId: taskId } // Make sure userId is correctly formatted as per the database
            );
            // Check if any task exists
            if (result.rows.length > 0) {
                // Create an array of tasks
                const tasks = {
                    taskId: result.rows[0][0],
                    taskname: result.rows[0][1],
                    description: result.rows[0][2],
                    userid: result.rows[0][3],
                    createdate: result.rows[0][4],
                    enddate: result.rows[0][5],
                    priority: result.rows[0][6],
                    progress: result.rows[0][7],
                };
            
                res.status(200).send({ payload: tasks, message: "Task found!" });
            } else {
                res.status(404).send({ error: "Tasks not found" });
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

// Create a new task
router.post("/", async (req, res) => {
    console.log(req.body);
    // Get parameters to insert into the database from the request body
    const {task, description, userId, progress, createDate, endDate, priority} = req.body;
    console.log(task,description, userId, progress, createDate, endDate, priority);

    // Check if the user exists
    let userExists = false;
    try {
        const userConnection = await oracledb.getConnection(dbConfig);
        const userResult = await userConnection.execute(
            `SELECT * FROM ACCOUNT WHERE USER_ID = :userId`,
            { userId }
        );
        userExists = userResult.rows.length > 0;
        await userConnection.close();
    } catch (error) {
        console.error("Error checking user existence: ", error);
        return res.status(500).send({ error: "Database Error", details: error.message });
    }

    if (!userExists) {
        return res.status(400).send({ error: "User does not exist" });
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Check if parameters exist and have the correct data types
        if (!task) {
            return res.status(400).send({ error: "Task name (task) is required" });
        } else if (typeof task !== 'string') {
            return res.status(400).send({ error: "Task name (task) must be a string" });
        }

        if (!userId) {
            return res.status(400).send({ error: "User ID (userId) is required" });
        } else if (isNaN(userId)) {
            return res.status(400).send({ error: "User ID (userId) must be a number" });
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

        if (!priority) {
            return res.status(400).send({ error: "Task priority (priority) is required" });
        } else if (isNaN(priority)) {
            return res.status(400).send({ error: "Task priority (priority) must be a number" });
        }

        try {
            // Insert query to insert the new task into the database
            const result = await connection.execute(
                `INSERT INTO TASK (TASK_NAME, TASK_DESCRIPTION, USER_ID, TASK_PROGRESS, TASK_CREATEDATE, TASK_ENDDATE, TASK_PRIORITY) VALUES (:TASK_NAME, :TASK_DESCRIPTION, :USER_ID, :TASK_PROGRESS, TO_DATE(:TASK_CREATEDATE, 'YYYY-MM-DD'), TO_DATE(:TASK_ENDDATE, 'YYYY-MM-DD'), :TASK_PRIORITY)`,
                {
                    TASK_NAME: task,
                    TASK_DESCRIPTION: description,
                    USER_ID: userId,
                    TASK_PROGRESS: progress,
                    TASK_CREATEDATE: createDate,
                    TASK_ENDDATE: endDate,
                    TASK_PRIORITY: Number(priority),
                }
            );

            await connection.commit();

            // Success response
            res.status(200).send({ payload: result, message: "Task created successfully" });
        } catch (error) {
            console.error("Database Query Error:", error); // Log the error for debugging
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

// Task Specifics
router.put("/", async (req, res) => {
    // Get parameters to edit
    const { id, task, description, enddate, progress, priority } = req.body;
    console.log(req.body)
    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log('hello')
        if (!id) {
            return res.status(400).send({ error: "Task Id is required" });
        }
        // Check if the user exists
        let taskexists = false;
        try {
            const userConnection = await oracledb.getConnection(dbConfig);
            const userResult2 = await userConnection.execute(
                `SELECT * FROM TASK WHERE TASK_ID = :id`,
                {id}
            );
            taskexists = userResult2.rows.length > 0;
            await userConnection.close();
            
        } catch (error) {
            console.error("Error checking task existence: ", error);
            return res.status(500).send({ error: "Database Error", details: error.message });
        }

        if (!taskexists) {
            return res.status(400).send({ error: "Task doesn't exist" });
        }

        try {
            // Update query
            const result = await connection.execute(
                `UPDATE TASK 
                 SET TASK_NAME = :task, 
                     TASK_DESCRIPTION = :description, 
                     TASK_ENDDATE = TO_TIMESTAMP_TZ(:enddate, 'YYYY-MM-DD"T"HH24:MI:SS.FF3"Z"'), 
                     TASK_PROGRESS = :progress, 
                     TASK_PRIORITY = :priority 
                 WHERE TASK_ID = :id`,
                { task, description, enddate, progress, priority, id }
            );
            await connection.commit();

            const result2 = await connection.execute(
                `SELECT * FROM TASK WHERE TASK_ID = :id`,
                { id } // Make sure userId is correctly formatted as per the database
            );

            // Check if the task was updated successfully
            if (result.rowsAffected === 1) {
                res.status(200).send({ data: result2.rows });
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

// Delete Task
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const connection = await oracledb.getConnection(dbConfig);

        if (!id) {
            return res.status(400).send({ error: "Task Id is required" });
        }

        // Check if the task exists
        let taskExists = false;
        try {
            const userConnection = await oracledb.getConnection(dbConfig);
            const userResult = await userConnection.execute(
                `SELECT * FROM TASK WHERE TASK_ID = :id`,
                { id }
            );
            taskExists = userResult.rows.length > 0;
            await userConnection.close();
        } catch (error) {
            console.error("Error checking task existence: ", error);
            return res.status(500).send({ error: "Database Error", details: error.message });
        }

        if (!taskExists) {
            return res.status(400).send({ error: "Task doesn't exist" });
        }

        try {
            // Delete query
            const result = await connection.execute(
                `DELETE FROM TASK
                WHERE TASK_ID = :id`,
                { id }
            );
            await connection.commit();

            // Check if the task was deleted successfully
            if (result.rowsAffected === 1) {
                res.status(200).send(); // 204 indicates No Content (successful deletion)
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
        console.error("Error establishing database connection: ", error);
        res.status(500).send({ error: "Database Connection Error", details: error.message });
    }
});


module.exports = router;


