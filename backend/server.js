const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Helpdesk IT — En ligne ✅");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté ✅"))
    .catch(err => console.log("Erreur MongoDB :", err));

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});