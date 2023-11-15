const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const { v4: uuidv4 } = require('uuid');
const dbConfig = require("./dbconfig");
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const { type } = require("os");

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
                userId: result.rows[0][0],
                username: result.rows[0][1],
                password: result.rows[0][2],
                email: result.rows[0][3],
                code: result.rows[0][4],
                authenticate: result.rows[0][5]
            };
            console.log(userData);

            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "imagegenerator6@gmail.com", // your email address
                    pass: "hlxc lvba sacz qgas" // your email password
                }
            });
        
            // Email content
            const mailOptions = {
                from: "imagegenerator6@gmail.com",
                to: userData.email,
                subject: "User Authentication for onTrack Application",
                text: `Your code is: ${userData.code}.`
            };

            // Send the email
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.error("Email sending failed:", error);
                    res.status(500).json({ error: "Email sending failed" });
                } else {
                    console.log("Email sent:", info.response);
                    res.status(200).json({ msg: "User Found and Email Sent", payload: userData });
                }
            });
        } else {
            // User not found
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Database Query Error:", error);
        res.status(500).send({ error: "Database Query Error", details: error.message });
    }
});

// Authenticate User
router.get("/auth/:name/:code", async (req, res) => {
    const { name, code } = req.params;

    if (!name || !code) {
        return res.status(400).send({ error: "Both name and code values are required" });
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // authenticate user using name and code
        const query = `
            SELECT * FROM ACCOUNT
            WHERE USER_NAME = :name
            AND CODE = :code
        `;
        
        const result = await connection.execute(query, {
            name,
            code,
        });

        // userData = result.rows[0]

        await connection.close();

        console.log(result)

        if (result.rows && result.rows.length > 0) {
            // User found
            const userData = {
                userId: result.rows[0],
                username: result.rows[0][1],
                password: result.rows[0][2],
                email: result.rows[0][3],
                code: result.rows[0][4],
                authenticate: result.rows[0][5]
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

// Get User by Name and Password
router.get("/reset", async (req, res) => {
    const { email} = req.query;

    if (!email) {
        return res.status(400).send({ error: "Email is required." });
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);

        // Perform a query to retrieve a user by name and password
        const query = `
            SELECT * FROM ACCOUNT
            WHERE USER_EMAIL = :email
        `;
        
        const result = await connection.execute(query, {
            email
        });

        // userData = result.rows[0]

        await connection.close();

        console.log(result)

        if (result.rows && result.rows.length > 0) {
            // User found
            const userData = {
                id: result.rows[0][0],
                username: result.rows[0][1],
                password: result.rows[0][2],
                email: result.rows[0][3]
            };
        
            console.log(userData.email);

            // Create a nodemailer transporter
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "imagegenerator6@gmail.com", // your email address
                    pass: "hlxc lvba sacz qgas" // your email password
                }
            });
        
            // Email content
            const mailOptions = {
                from: "imagegenerator6@gmail.com",
                to: userData.email,
                subject: "Email Verification for onTrack Application",
                text: "Please click the following link to verify your email: http://localhost:3000/resetpassword"
            };

        
            // Send the email
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.error("Email sending failed:", error);
                    res.status(500).json({ error: "Email sending failed" });
                } else {
                    console.log("Email sent:", info.response);
                    res.status(200).json({ msg: "User Found and Email Sent", payload: userData });
                }
            });
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

        // Check if the user exists
        let userExists1, userExists2 = false;
        try {
            const userConnection = await oracledb.getConnection(dbConfig);
            const userResult = await userConnection.execute(
                `SELECT * FROM ACCOUNT WHERE USER_NAME = :name`,
                { name}
            );
            const userResult2 = await userConnection.execute(
                `SELECT * FROM ACCOUNT WHERE USER_EMAIL = :email`,
                {email}
            );

            userExists1 = userResult.rows.length > 0;
            userExists2 = userResult2.rows.length > 0;
            await userConnection.close();

        } catch (error) {
            console.error("Error checking user existence: ", error);
            return res.status(500).send({ error: "Database Error", details: error.message });
        }

        if (userExists1) {
            return res.status(400).send({ error: "Name already exist" });
        }

        if (userExists2) {
            return res.status(400).send({ error: "Email already exist" });
        }

        try {
            
            // Generate code

            function generate32BitRandomCode() {
                const buffer = (crypto.randomBytes(4)).toString('hex').toUpperCase();
                return buffer; 
            }

            const code = generate32BitRandomCode();
            let auth = "N";

            // Insert query to insert the new task into the database -- fix this
            const result = await connection.execute(
                `INSERT INTO ACCOUNT (USER_NAME, USER_PASSWORD, USER_EMAIL, CODE, AUTHENTICATE) VALUES (:name, :password, :email, :code, :auth)`,
                {
                    name, password, email, code, auth
                }
            );
            
            await connection.commit();

            // Success response
            res.status(200).send({ payload: result, message: "User created successfully" });
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

// update password - forgot password
router.put("/reset", async (req, res) => {
    // Get parameters to insert into the database from the request body
    const {password, email} = req.body;
    console.log(req.body);

    try {
        const connection = await oracledb.getConnection(dbConfig);

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

        // Check if the user exists
        let userExists2 = false;
        try {
            const userConnection = await oracledb.getConnection(dbConfig);
            const userResult2 = await userConnection.execute(
                `SELECT * FROM ACCOUNT WHERE USER_EMAIL = :email`,
                {email}
            );
            userExists2 = userResult2.rows.length > 0;
            await userConnection.close();
        } catch (error) {
            console.error("Error checking user existence: ", error);
            return res.status(500).send({ error: "Database Error", details: error.message });
        }

        if (!userExists2) {
            return res.status(400).send({ error: "Email doesn't exist" });
        }

        try {
            // Insert query to insert the new task into the database
            const result = await connection.execute(
                "UPDATE ACCOUNT SET USER_PASSWORD = :USER_PASSWORD WHERE USER_EMAIL = :USER_EMAIL",
                {
                  USER_PASSWORD: password,
                  USER_EMAIL: email,
                }
              );
              
            await connection.commit();

            // Success response
            res.status(200).send({ payload: result, message: "User passowrd updated successfully" });
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
}
);

router.delete("/", (req, res) => {
    res.send({ data: "Test"});
});

module.exports = router;