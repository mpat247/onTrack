const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const { v4: uuidv4 } = require('uuid');
const dbConfig = require("./dbconfig");
const jwt = require('jsonwebtoken')

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

// Get Account
// Get User by Name and Password
router.get("/:name/:password", async (req, res) => {
    const { name, password } = req.params;

    if (!name || !password) {
        return res.status(400).send({ error: "Both name and password parameters are required" });
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Perform a query to retrieve a user by name and password
        const query = `
            SELECT * FROM ACCOUNT
            WHERE USER_NAME = :name
            AND USER_PASSWORD = :password
        `;
        
        const result = await connection.execute(query, {
            name,
            password,
        });

        // userData = result.rows[0]

        await connection.close();

        console.log(result)

        if (result.rows && result.rows.length > 0) {
            // User found
            const userData = {
                id: result.rows[0],
                username: result.rows[0][1],
                password: result.rows[0][2],
                email: result.rows[0][3]
            };
            res.status(200).json({msg:"User Found", payload: userData });
        } else {
            // User not found
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).send({ error: "Database Query Error", details: error.message });
    }
});

// Create Account
router.post("/register", async (req, res) => {
    // Get parameters to insert into the database from the request body
    const {name, password, email} = req.body;
    console.log(req.body);

    // // Check if the user exists
    // let userExists = false;
    // try {
    //     const userConnection = await oracledb.getConnection(dbConfig);
    //     const userResult = await userConnection.execute(
    //         `SELECT * FROM ACCOUNT WHERE USER_ID = :userId`,
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

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Check if parameters exist and have the correct data types
        if (!name) {
            return res.status(400).send({ error: "Account name (name) is required" });
        } else if (typeof name !== 'string') {
            return res.status(400).send({ error: "Account name (name) must be a string" });
        }

        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        // password check - length, numbers + characters
        if (!password) {
            return res.status(400).send({ error: "Password is required" });
        } else if (typeof password !== 'string') {
            return res.status(400).send({ error: "Password must be a number" });
        } else if (!passwordPattern.test(password)) {
            return res.status(400).send({ error: "Password must have a minimum of 6 characters, contain both letters and numbers, and include at least 1 special character" });
        }
        

        if (!email) {
            return res.status(400).send({ error: "Email is required" });
        } else if (typeof email !== 'string') {
            return res.status(400).send({ error: "Email must be a string" });
        }

        try {
            // Insert query to insert the new task into the database
            const result = await connection.execute(
                `INSERT INTO ACCOUNT (USER_NAME, USER_PASSWORD, USER_EMAIL) VALUES (:USER_NAME, :USER_PASSWORD, :USER_EMAIL)`,
                {
                    USER_NAME: name,
                    USER_PASSWORD: password,
                    USER_EMAIL: email,
                }
            );

            await connection.commit();

            // Success response
            res.status(200).send({ payload: result, message: "User created successfully" });
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

router.put("/", (req, res) => {
    res.send({ data: "Test"});
});

router.delete("/", (req, res) => {
    res.send({ data: "Test"});
});

module.exports = router;