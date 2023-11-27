const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const dbConfig = require("./dbconfig");

// Get Comments for a task id
router.get("/tasks/:taskId", async (req, res) => {
    const { taskId } = req.params;

    if (!taskId) {
        return res.status(400).send({ error: "TaskId is Required" });
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Perform a query to retrieve a user by name and password
        const query = `
            SELECT * FROM COMMENTS
            WHERE TASK_ID = :taskId
        `;
        
        const result = await connection.execute(query, {
            taskId
        });

        // userData = result.rows[0]

        await connection.close();

        console.log(result)

        if (result.rows && result.rows.length > 0) {
            // User found
            const userData = {
                commentId: result.rows[0][0],
                taskId: result.rows[0][1],
                commentDescription: result.rows[0][2],
            };
            console.log(userData);

            res.status(200).json({msg:"Comments Found", payload: userData });

        } else {
            // Comments not found
            res.status(404).json({ error: "Comments not found" });
        }
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).send({ error: "Database Query Error", details: error.message });
    }
});

// Get Comments for a task id
router.get("/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        return res.status(400).send({ error: "commentId is Required" });
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Perform a query to retrieve a user by name and password
        const query = `
            SELECT * FROM COMMENTS
            WHERE COMMENT_ID = :commentId
        `;
        
        const result = await connection.execute(query, {
            commentId
        });

        // userData = result.rows[0]

        await connection.close();

        console.log(result)

        if (result.rows && result.rows.length > 0) {
            // User found
            const userData = {
                commentId: result.rows[0][0],
                taskId: result.rows[0][1],
                commentDescription: result.rows[0][2],
            };
            console.log(userData);

            res.status(200).json({msg:"Comment Found", payload: userData });

        } else {
            // Comments not found
            res.status(404).json({ error: "Comment not found" });
        }
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).send({ error: "Database Query Error", details: error.message });
    }
});

// Create COMMENT
router.post("/new", async (req, res) => {
    
    // Get parameters to insert into the database from the request body
    const {taskId, commentDescription} = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Check if parameters exist and have the correct data types
        if (!taskId) {
            return res.status(400).send({ error: "TaskId is required" });
        } else if (typeof taskId !== 'number') {
            return res.status(400).send({ error: "TaskId must be a number" });
        }
        
        if (!commentDescription) {
            return res.status(400).send({ error: "commentDescription is required" });
        } else if (typeof commentDescription !== 'string') {
            return res.status(400).send({ error: "commentDescription must be a string" });
        }

        // Check if the user exists
        let taskExists1 = false;
        try {
            const userConnection = await oracledb.getConnection(dbConfig);
            const userResult = await userConnection.execute(
                `SELECT * FROM TASK WHERE TASK_ID = :taskId`,
                { taskId }
            );
            

            taskExists1 = userResult.rows.length > 0;
           
            await userConnection.close();

        } catch (error) {
            console.error("Error checking comment existence: ", error);
            return res.status(500).send({ error: "Database Error", details: error.message });
        }

        if (!taskExists1) {
            return res.status(400).send({ error: "Task doesnt exist" });
        }


        try {
            
            

            // Insert query to insert the new task into the database -- fix this
            const result = await connection.execute(
                `INSERT INTO COMMENTS (TASK_ID, COMMENT_DESCRIPTION) VALUES (:taskId, :commentDescription)`,
                {
                    taskId, commentDescription
                }
            );
            
            await connection.commit();

            // Success response
            res.status(200).send({ payload: result, message: "Comment created successfully" });
        } catch (error) {
            console.error("Database Query Error:", error); // Log the error for debugging
            res.status(500).send({ error: "Database Query Error", details: error.stack });
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

router.put("/edit", async (req, res) => {
    const { commentId, commentDescription } = req.body;

    if (!commentId) {
        return res.status(400).send({ msg: "Invalid commentId" });
    }
    if (typeof commentId !== "number") {
        return res.status(400).send({ msg: "commentId must be a number" });
    }

    if (!commentDescription) {
        return res.status(400).send({ msg: "Invalid commentDescription" });
    }
    if (typeof commentDescription !== "string") {
        return res.status(400).send({ msg: "commentDescription must be a string" });
    }
   

    try {
        const connection = await oracledb.getConnection(dbConfig);
        console.log(commentId);
    
        try {
            const updateResult = await connection.execute(
                "UPDATE COMMENTS SET COMMENT_DESCRIPTION = :commentDescription WHERE COMMENT_ID = :commentId",
                { commentId, commentDescription }, // Provide values for both bind variables
                { autoCommit: true }
            );
    
            console.log(updateResult);
    
            // Success response
            res.status(200).send({ payload: updateResult, message: "Comment Updated Successfully" });
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
        return res.status(500).send({ error: "Database Connection Error", details: error.message });
    }
});

// Delete Task
router.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    console.log(commentId);
    try {
        const connection = await oracledb.getConnection(dbConfig);
    
        if (!commentId) {
            return res.status(400).send({ error: "commentId is required" });
        }
    
        // Check if the task exists
        let commentExists = false;
        try {
            const userConnection = await oracledb.getConnection(dbConfig);
            const userResult = await userConnection.execute(
                `SELECT * FROM COMMENTS WHERE COMMENT_ID = :commentId`,
                { commentId }
            );
            commentExists = userResult.rows.length > 0;
            await userConnection.close();
        } catch (error) {
            console.error("Error checking comment existence: ", error);
            return res.status(500).send({ error: "Database Error", details: error.message });
        }
    
        if (!commentExists) {
            return res.status(400).send({ error: "comment doesn't exist" });
        }
    
        try {
            // Delete query
            const result = await connection.execute(
                `DELETE FROM COMMENTS
                WHERE COMMENT_ID = :commentId`, // Use commentId here
                { commentId } // Bind commentId
            );
            await connection.commit();
    
            // Check if the task was deleted successfully
            if (result.rowsAffected === 1) {
                res.status(200).send(); // 204 indicates No Content (successful deletion)
            } else {
                res.status(404).send({ error: "COMMENT not found" });
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