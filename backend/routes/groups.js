const express = require("express");
const Group = require("../models/Group");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Créer un groupe (admin)
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });

        const { name, description, category, members, color } = req.body;
        const group = new Group({ name, description, category, members, color });
        await group.save();
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Obtenir tous les groupes
router.get("/", authMiddleware, async (req, res) => {
    try {
        const groups = await Group.find()
            .populate("members", "name email role")
            .sort({ createdAt: -1 });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Modifier un groupe (admin)
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });

        const group = await Group.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        ).populate("members", "name email role");
        res.json(group);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Supprimer un groupe (admin)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });

        await Group.findByIdAndDelete(req.params.id);
        res.json({ message: "Groupe supprimé" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
