const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir les fichiers uploadés
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/users", require("./routes/users"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/upload", require("./routes/upload"));


app.get("/", (req, res) => {
    res.send("API Helpdesk IT — En ligne ✅");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté ✅"))
    .catch(err => console.log("Erreur MongoDB :", err));

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});