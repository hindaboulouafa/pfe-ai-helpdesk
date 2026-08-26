import { useState, useEffect } from "react";
import { getAllTickets, updateTicket, getGroups, chatWithAI } from "../api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../Sidebar";
import { FiList, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

const CATEGORIES = {
    "réseau":   { icon: "🌐", color: "#3b82f6", bg: "#eff6ff" },
    "matériel": { icon: "💻", color: "#8b5cf6", bg: "#f5f3ff" },
    "logiciel": { icon: "⚙️", color: "#f59e0b", bg: "#fffbeb" },
    "accès":    { icon: "🔐", color: "#ef4444", bg: "#fef2f2" },
    "autre":    { icon: "📦", color: "#64748b", bg: "#f8fafc" },
};

const STATUS = {
    "ouvert":   { color: "#f59e0b", bg: "#fffbeb" },
    "en cours": { color: "#3b82f6", bg: "#eff6ff" },
    "résolu":   { color: "#10b981", bg: "#f0fdf4" },
    "fermé":    { color: "#64748b", bg: "#f8fafc" },
};

export default function TechnicienDashboard() {
    const [tickets, setTickets] = useState([]);
    const [groups, setGroups] = useState([]);
    const [filter, setFilter] = useState("tous");
    const [loading, setLoading] = useState(true);
    const [activeTicket, setActiveTicket] = useState(null);
    const [comment, setComment] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        Promise.all([getAllTickets(), getGroups()])
            .then(([tRes, gRes]) => {
                setTickets(tRes.data);
                setGroups(gRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Tickets du groupe du technicien
    const myGroups = groups.filter(g =>
        g.members?.some(m => m._id === user?.id || m === user?.id)
    );

    const myGroupCategories = myGroups.map(g => g.category);

    const myTickets = tickets.filter(t =>
        myGroupCategories.includes(t.category)
    );

    const filtered = filter === "tous"
        ? myTickets
        : myTickets.filter(t => t.status === filter);

    const handleUpdate = async (id, field, value) => {
        try {
            const { data } = await updateTicket(id, { [field]: value });
            setTickets(prev => prev.map(t => t._id === id ? data : t));
            if (activeTicket?._id === id) setActiveTicket(data);
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        }
    };

    const handleAiHelp = async (ticket) => {
        setAiLoading(true);
        try {
            const { data } = await chatWithAI(
                `Aide-moi à résoudre ce problème IT: ${ticket.title}. Description: ${ticket.description}`
            );
            setAiSuggestion(data.answer);
        } catch {
            setAiSuggestion("L'IA n'est pas disponible.");
        }
        setAiLoading(false);
    };



    const stats = [
        { label: "Mes tickets", value: myTickets.length, Icon: FiList, color: "#3b82f6", bg: "#eff6ff" },
        { label: "Ouverts", value: myTickets.filter(t => t.status === "ouvert").length, Icon: FiAlertCircle, color: "#f59e0b", bg: "#fffbeb" },
        { label: "En cours", value: myTickets.filter(t => t.status === "en cours").length, Icon: FiClock, color: "#3b82f6", bg: "#eff6ff" },
        { label: "Résolus", value: myTickets.filter(t => t.status === "résolu").length, Icon: FiCheckCircle, color: "#10b981", bg: "#f0fdf4" },
    ];

    return (
        <div className="app-layout">
            <Sidebar active="technicien" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2>🔧 Espace Technicien</h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Tickets assignés à vos groupes — {myGroups.map(g => g.name).join(", ") || "Aucun groupe"}
                        </div>
                    </div>
                    <span className="topbar-badge">
            {myTickets.length} ticket{myTickets.length > 1 ? "s" : ""} assignés
          </span>
                </div>

                <div style={{ padding: "1.5rem" }}>

                    {/* Stats */}
                    <div className="stat-grid" style={{ marginBottom: 24 }}>
                        {stats.map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-icon" style={{ background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <s.Icon size={22} color={s.color} />
                                </div>
                                <div className="stat-info">
                                    <h3 style={{ color: s.color }}>{s.value}</h3>
                                    <p>{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mes groupes */}
                    {myGroups.length > 0 && (
                        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                            {myGroups.map(g => (
                                <div key={g._id} style={{
                                    padding: "6px 16px", borderRadius: 20,
                                    background: g.color + "20",
                                    border: `1px solid ${g.color}`,
                                    color: g.color, fontWeight: 600, fontSize: "0.85rem"
                                }}>
                                    {CATEGORIES[g.category]?.icon} {g.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Filtres */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                        {["tous", "ouvert", "en cours", "résolu", "fermé"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                    style={{
                                        padding: "7px 18px", borderRadius: 20, border: "none",
                                        fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                                        background: filter === f ? "linear-gradient(135deg, #1e3a5f, #3b82f6)" : "#f1f5f9",
                                        color: filter === f ? "white" : "#64748b",
                                        transition: "all 0.2s"
                                    }}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}{" "}
                                ({f === "tous" ? myTickets.length : myTickets.filter(t => t.status === f).length})
                            </button>
                        ))}
                    </div>

                    {loading && <div style={{ textAlign: "center", padding: 60 }}><div style={{ fontSize: 40 }}>⏳</div></div>}

                    {!loading && myTickets.length === 0 && (
                        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
                            <h3 style={{ color: "#0f172a" }}>Aucun ticket assigné</h3>
                            <p style={{ color: "#64748b" }}>Vous n'êtes membre d'aucun groupe ou il n'y a pas de tickets dans vos catégories</p>
                        </div>
                    )}

                    {/* Layout 2 colonnes si ticket actif */}
                    <div style={{ display: "grid", gridTemplateColumns: activeTicket ? "1fr 400px" : "1fr", gap: 16 }}>

                        {/* Liste tickets */}
                        <div>
                            {filtered.map(ticket => {
                                const cat = CATEGORIES[ticket.category] || CATEGORIES["autre"];
                                const sta = STATUS[ticket.status] || STATUS["ouvert"];
                                return (
                                    <div key={ticket._id}
                                         onClick={() => { setActiveTicket(ticket); setAiSuggestion(""); }}
                                         style={{
                                             background: activeTicket?._id === ticket._id ? "#f0f7ff" : "white",
                                             borderRadius: 14, padding: "1.25rem 1.5rem", marginBottom: 10,
                                             border: activeTicket?._id === ticket._id ? `2px solid ${cat.color}` : "1px solid #f1f5f9",
                                             boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                             borderLeft: `5px solid ${cat.color}`,
                                             cursor: "pointer", transition: "all 0.2s"
                                         }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a" }}>{ticket.title}</div>
                                                <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                                                    👤 {ticket.user?.name} — {ticket.user?.email}
                                                </div>
                                            </div>
                                            <span style={{ padding: "3px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 700, background: sta.bg, color: sta.color, border: `1px solid ${sta.color}` }}>
                        {ticket.status}
                      </span>
                                        </div>
                                        <div style={{ color: "#475569", fontSize: "0.85rem", marginBottom: 10 }}>{ticket.description}</div>
                                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, background: cat.bg, color: cat.color, border: `1px solid ${cat.color}` }}>
                        {cat.icon} {ticket.category}
                      </span>
                                            <span style={{ color: "#94a3b8", fontSize: "0.75rem", marginLeft: "auto" }}>
                        📅 {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Panneau ticket actif */}
                        {activeTicket && (
                            <div className="card" style={{ height: "fit-content", position: "sticky", top: 80 }}>
                                <div className="card-header">
                                    <h3 style={{ fontSize: "0.95rem" }}>🎫 {activeTicket.title}</h3>
                                    <button onClick={() => setActiveTicket(null)}
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 18 }}>✕</button>
                                </div>
                                <div style={{ padding: "1rem" }}>

                                    {/* Infos utilisateur */}
                                    <div style={{ marginBottom: 12, padding: "8px 12px", background: "#f8fafc", borderRadius: 8, fontSize: "0.85rem", color: "#475569" }}>
                                        👤 {activeTicket.user?.name} — {activeTicket.user?.email}
                                        {activeTicket.affectedUser && (
                                            <div style={{ marginTop: 4 }}>👥 Concerne : <strong>{activeTicket.affectedUser}</strong></div>
                                        )}
                                    </div>

                                    {/* Screenshot */}
                                    {activeTicket.screenshot && (
                                        <div style={{ marginBottom: 12 }}>
                                            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#64748b", marginBottom: 6 }}>
                                                📸 Capture d'écran :
                                            </div>
                                            <img src={activeTicket.screenshot} alt="screenshot"
                                                 style={{ width: "100%", borderRadius: 8, border: "1px solid #e2e8f0", cursor: "pointer" }}
                                                 onClick={() => window.open(activeTicket.screenshot, "_blank")} />
                                        </div>
                                    )}

                                    {/* Changer statut */}
                                    <div className="form-group">
                                        <label className="form-label">Statut</label>
                                        <select className="form-select"
                                                value={activeTicket.status}
                                                onChange={e => handleUpdate(activeTicket._id, "status", e.target.value)}>
                                            <option value="ouvert">🟡 Ouvert</option>
                                            <option value="en cours">🔵 En cours</option>
                                            <option value="résolu">✅ Résolu</option>
                                            <option value="fermé">⬛ Fermé</option>
                                        </select>
                                    </div>

                                    {/* Note technicien */}
                                    <div className="form-group">
                                        <label className="form-label">Note de résolution</label>
                                        <textarea className="form-input" rows={3}
                                                  placeholder="Décrivez la solution apportée..."
                                                  defaultValue={activeTicket.adminNote || ""}
                                                  onBlur={e => handleUpdate(activeTicket._id, "adminNote", e.target.value)} />
                                    </div>

                                    

                                    {/* Aide IA */}
                                    <button className="btn-ai" onClick={() => handleAiHelp(activeTicket)}
                                            disabled={aiLoading} style={{ marginBottom: 12, width: "100%" }}>
                                        <RiRobot2Line style={{ marginRight: 6 }} />
                                        {aiLoading ? "L'IA réfléchit..." : "Demander l'aide de l'IA"}
                                    </button>

                                    {aiSuggestion && (
                                        <div className="alert alert-ai" style={{ fontSize: "0.85rem" }}>
                                            🤖 <strong>Suggestion IA :</strong><br />{aiSuggestion}
                                        </div>
                                    )}

                                    {activeTicket.aiSuggestion && (
                                        <div className="alert alert-info" style={{ fontSize: "0.85rem", marginTop: 8 }}>
                                            💡 <strong>Suggestion initiale IA :</strong><br />{activeTicket.aiSuggestion}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}