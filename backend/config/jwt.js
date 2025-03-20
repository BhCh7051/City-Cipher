// Description: This file contains jsonwebtoken functions
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const expiry = process.env.JWT_EXPIRES_IN;

// Jsonwebtoken Sign a token with the user's id and a secret
function signToken(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: expiry });
}

// Jsonwebtoken Verify a request token with the user's id and a secret
function verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    if (typeof header !== "undefined") {
        const bearer = header.split(" ");
        const token = bearer[1];
        try {
            jwt.verify(token, jwtSecret);
            req.user = jwt.verify(token, jwtSecret);
            next();
        } catch (err) {
            res.status(401).json({
                error: "Token not valid, please authenticate again",
            });
            return;
        }
    } else {
        res.sendStatus(403);
    }
}

module.exports = {
    signToken,
    verifyToken,
};