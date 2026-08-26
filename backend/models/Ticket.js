const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, required: true },
    text: { type: String, required: true },
}, { timestamps: true });

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
    adminNote: { type: String },
    screenshot: { type: String },
    affectedUser: { type: String },
    comments: [CommentSchema]
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);