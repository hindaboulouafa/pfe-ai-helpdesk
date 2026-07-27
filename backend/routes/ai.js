const express = require("express");
const Groq = require("groq-sdk");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Chat avec l'IA
router.post("/chat", authMiddleware, async (req, res) => {
    try {
        const { message } = req.body;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "Tu es un assistant helpdesk IT expert. Tu aides les utilisateurs à résoudre leurs problèmes informatiques en français. Donne des réponses claires, concises et pratiques. Si le problème nécessite une intervention physique, conseille l'utilisateur de créer un ticket de support."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            max_tokens: 500
        });

        const answer = completion.choices[0].message.content;
        res.json({ answer });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur IA", error: err.message });
    }
});

// Catégoriser un ticket
router.post("/categorize", authMiddleware, async (req, res) => {
    try {
        const { description } = req.body;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `Tu es un classificateur de tickets IT. À partir de la description du problème, réponds UNIQUEMENT avec un objet JSON valide:
{"category": "réseau", "suggestion": "une phrase de solution"}
Catégories possibles: réseau, matériel, logiciel, accès, autre.
Réponds UNIQUEMENT avec le JSON, rien d'autre.`
                },
                {
                    role: "user",
                    content: description
                }
            ],
            max_tokens: 150
        });

        const text = completion.choices[0].message.content.trim();
        const result = JSON.parse(text);
        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur catégorisation" });
    }
});

module.exports = router;