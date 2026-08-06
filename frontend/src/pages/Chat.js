import { useState } from "react";
import { chatWithAI } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../Sidebar";
import { FiSend, FiTag } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Chat() {
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Bonjour ! Je suis votre assistant IT. Décrivez votre problème et je vais vous aider immédiatement." }
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
            setMessages(prev => [...prev, { role: "assistant", text: "L'IA n'est pas disponible. Créez un ticket pour contacter le support." }]);
        }
        setLoading(false);
    };

    return (
        <div className="app-layout">
            <Sidebar active="chat" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <RiRobot2Line /> Assistant IA
                        </h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Posez vos questions IT — disponible 24h/24
                        </div>
                    </div>
                    <span className="topbar-badge" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            En ligne
          </span>
                </div>

                <div className="card" style={{ margin: "1.5rem", display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
                    <div className="chat-messages">
                        {messages.map((m, i) => (
                            <div key={i} className={`msg-row ${m.role === "user" ? "user" : ""}`}>
                                <div className={`msg-avatar ${m.role === "user" ? "user" : "ai"}`}>
                                    {m.role === "user"
                                        ? user?.name?.charAt(0).toUpperCase()
                                        : <RiRobot2Line size={18} />}
                                </div>
                                <div className={`msg-bubble ${m.role === "user" ? "user" : "ai"}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="msg-row">
                                <div className="msg-avatar ai"><RiRobot2Line size={18} /></div>
                                <div className="msg-bubble ai" style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                    L'IA réfléchit...
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="chat-footer">
                        <input
                            className="chat-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder="Décrivez votre problème IT..."
                        />
                        <button className="btn-send" onClick={sendMessage}
                                style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <FiSend /> Envoyer
                        </button>
                        <button onClick={() => navigate("/new-ticket")}
                                style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid #e2e8f0", background: "white", color: "#475569", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            <FiTag /> Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}