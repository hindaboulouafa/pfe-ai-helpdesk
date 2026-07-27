const express = require("express");
const Ticket = require("../models/Ticket");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Créer un ticket
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        const ticket = new Ticket({
            user: req.user.id,
            title,
            description,
            category,
            priority
        });
        await ticket.save();
        res.status(201).json(ticket);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Mes tickets
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Tous les tickets (admin)
router.get("/all", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });
        const tickets = await Ticket.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Modifier un ticket (admin)
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ message: "Accès refusé" });
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        );
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;