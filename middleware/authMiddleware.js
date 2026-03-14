const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization; // Assuming
        // console.log("Auth middleware token:", authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ status: "failed", message: "Authorization token required" });
        }

        const token = authHeader.split(' ')[1];
        // console.log("Auth middleware token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // Attach user info to request object
        next();
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        res.status(401).json({ status: "error", message: "Invalid token or token expired" });
    }
}