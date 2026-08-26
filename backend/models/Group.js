const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        enum: ["réseau", "matériel", "logiciel", "accès", "autre"],
        required: true
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    color: { type: String, default: "#3b82f6" }
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);