// Description: This file contains controller for authentication
const User = require("../models/User");
const jwt = require("../config/jwt");

// Authenticate a user
async function authenticate(req, res) {
    const { username, password } = req.body;
    if (!username) {
        return res.status(400).json({
            error: "Username is required",
        });
    }
    if (!password) {
        return res.status(400).json({
            error: "Password is required",
        });
    }
    // Find the user with the matching email
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({
            error: "Incorrect username",
        });
    }

    // Compare the provided password with the hashed password in the database

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({
            error: "Incorrect password",
        });
    }

    // Generate a JWT token for the user
    const token = jwt.signToken({
        user_id: user._id,
    });

    res.json({ token: token });
}

module.exports = {
    authenticate,
};