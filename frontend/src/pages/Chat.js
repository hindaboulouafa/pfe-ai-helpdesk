import { useState } from "react";
import { chatWithAI } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ active }) {
    const navigate = useNavigate();
    const { logoutUser, user } = useAuth();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h1>🖥️ Helpdesk IT</h1>
                <p>Système de support intelligent</p>
            </div>

            <div className="sidebar-user">
                <div className="sidebar-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="sidebar-user-info">
                    <h4>{user?.name}</h4>
                    <span>{user?.role === "admin" ? "Administrateur" : "Utilisateur"}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section">Menu principal</div>

                <button className={`sidebar-link ${active === "chat" ? "active" : ""}`}
                        onClick={() => navigate("/chat")}>
                    <span className="icon">💬</span> Assistant IA
                </button>

                <button className={`sidebar-link ${active === "new-ticket" ? "active" : ""}`}
                        onClick={() => navigate("/new-ticket")}>
                    <span className="icon">🎫</span> Créer un ticket
                </button>

                <button className={`sidebar-link ${active === "my-tickets" ? "active" : ""}`}
                        onClick={() => navigate("/my-tickets")}>
                    <span className="icon">📋</span> Mes tickets
                </button>

                {user?.role === "admin" && (
                    <>
                        <div className="sidebar-section">Administration</div>
                        <button className={`sidebar-link ${active === "admin" ? "active" : ""}`}
                                onClick={() => navigate("/admin")}>
                            <span className="icon">⚙️</span> Tableau de bord
                        </button>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={logoutUser}>
                    <span>🚪</span> Déconnexion
                </button>
            </div>
        </div>
    );
}

export default function Chat() {
    const [messages, setMessages] = useState([
        { role: "assistant", text: "👋 Bonjour ! Je suis votre assistant IT. Décrivez votre problème et je vais vous aider immédiatement." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        try {
            const { data } = await chatWithAI(input);
            setMessages(prev => [...prev, { role: "assistant", text: data.answer }]);
        } catch {
            setMessages(prev => [...prev, { role: "assistant", text: "❌ L'IA n'est pas disponible. Créez un ticket pour contacter le support." }]);
        }
        setLoading(false);
    };

    return (
        <div className="app-layout">
            <Sidebar active="chat" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2>💬 Assistant IA</h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Posez vos questions IT — disponible 24h/24
                        </div>
                    </div>
                    <span className="topbar-badge">🟢 En ligne</span>
                </div>

                <div className="card" style={{ margin: "1.5rem", display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
                    {/* Messages */}
                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`msg-row ${m.role === "user" ? "user" : ""}`}>
                                <div className={`msg-avatar ${m.role === "user" ? "user" : "ai"}`}>
                                    {m.role === "user" ? user?.name?.charAt(0).toUpperCase() : "🤖"}
                                </div>
                                <div className={`msg-bubble ${m.role === "user" ? "user" : "ai"}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="msg-row">
                                <div className="msg-avatar ai">🤖</div>
                                <div className="msg-bubble ai" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <span style={{ animation: "pulse 1s infinite" }}>⏳</span>
                                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>L'IA réfléchit...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="chat-footer">
                        <input
                            className="chat-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder="Décrivez votre problème IT... (Ex: Mon VPN ne fonctionne plus)"
                        />
                        <button className="btn-send" onClick={sendMessage}>
                            ➤ Envoyer
                        </button>
                        <button onClick={() => navigate("/new-ticket")}
                                style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid #e2e8f0", background: "white", color: "#475569", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                            🎫 Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}