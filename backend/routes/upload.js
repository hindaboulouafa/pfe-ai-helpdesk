const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Seules les images sont acceptées"));
        }
    }
});

router.post("/", authMiddleware, upload.single("screenshot"), (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Aucun fichier uploadé" });
        const url = `http://localhost:5000/uploads/${req.file.filename}`;
        res.json({ url, filename: req.file.filename });
    } catch (err) {
        res.status(500).json({ message: "Erreur upload" });
    }
});

module.exports = router;