const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Obtenir tous les utilisateurs (admin)
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Créer un utilisateur (admin)
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });

        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email déjà utilisé" });

        const hashed = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashed, role });
        await user.save();

        res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Supprimer un utilisateur (admin)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;