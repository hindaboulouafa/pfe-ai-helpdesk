const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ["réseau", "matériel", "logiciel", "accès", "autre"],
        default: "autre"
    },
    priority: {
        type: String,
        enum: ["faible", "moyen", "élevé"],
        default: "moyen"
    },
    status: {
        type: String,
        enum: ["ouvert", "en cours", "résolu", "fermé"],
        default: "ouvert"
    },
    aiSuggestion: { type: String },
    adminNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);