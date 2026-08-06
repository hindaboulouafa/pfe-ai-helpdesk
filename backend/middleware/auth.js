const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Accès refusé — token manquant" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("ERREUR LOGIN:", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};