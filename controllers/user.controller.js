const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('fastest-validator');

const signUp = async (req, res) => {
    try {
        // Check if the email is already registered
        const existingUser = await models.User.findOne({ where: { username: req.body.username } });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists!" });
        }

        // Create a new user object
        const user = {
            name: req.body.name,
            username: req.body.username,
            password: req.body.password,
        };

        // Validation schema
        const schema = {
            name: { type: "string", optional: false, max: 50, pattern: /^[a-zA-Z\s]+$/ },
            username: { type: "string", optional: false, max: 35 },
            password: { type: "string", optional: false, min: 8 },
        };

        const vldator = new validator();
        const validationResponse = vldator.validate(user, schema);

        if (validationResponse !== true) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResponse,
            });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);

        // Save the user
        await models.User.create(user);
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("SignUp Error: ", error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
};

const login = async (req, res) => {
    try {
        // Find the user by email
        const user = await models.User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(401).json({ message: "Data tidak di temukan" });
        }
        // Compare passwords
        const isPasswordValid = await bcryptjs.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Data tidak di temukan" });
        }

        if (user.status !== 'active') {
            return res.status(401).json({ message: "User anda tidak aktif" });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                username: user.username,
                userId: user.id,
                role: user.role,
                status: user.status
            },
            process.env.JWT_KEY,
            { expiresIn: "24h" } // Token expiration time
        );

        return res.status(200).json({
            message: "Authentication successful!",
            token,
        });
    } catch (error) {
        console.error("Login Error: ", error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
};

module.exports = {
    signUp,
    login,
};
