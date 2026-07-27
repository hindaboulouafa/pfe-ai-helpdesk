import { useState, useEffect } from "react";
import { getMyTickets } from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("tous");
    const navigate = useNavigate();

    useEffect(() => {
        getMyTickets()
            .then(({ data }) => setTickets(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === "tous"
        ? tickets
        : tickets.filter(t => t.status === filter);

    return (
        <div className="app-layout">
            <Sidebar active="my-tickets" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2>📋 Mes Tickets</h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Suivez l'état de vos demandes de support
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => navigate("/new-ticket")}>
                        + Nouveau ticket
                    </button>
                </div>

                <div style={{ padding: "1.5rem" }}>

                    {/* Stats */}
                    <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
                        {[
                            { label: "Total", value: tickets.length, icon: "🎫", color: "#3b82f6", bg: "#eff6ff" },
                            { label: "Ouverts", value: tickets.filter(t => t.status === "ouvert").length, icon: "🟡", color: "#f59e0b", bg: "#fffbeb" },
                            { label: "En cours", value: tickets.filter(t => t.status === "en cours").length, icon: "🔵", color: "#3b82f6", bg: "#eff6ff" },
                            { label: "Résolus", value: tickets.filter(t => t.status === "résolu").length, icon: "✅", color: "#10b981", bg: "#f0fdf4" },
                        ].map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-icon" style={{ background: s.bg }}>
                                    {s.icon}
                                </div>
                                <div className="stat-info">
                                    <h3 style={{ color: s.color }}>{s.value}</h3>
                                    <p>{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filtres */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                        {["tous", "ouvert", "en cours", "résolu", "fermé"].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                    style={{
                                        padding: "7px 18px",
                                        borderRadius: 20,
                                        border: "none",
                                        fontWeight: 600,
                                        fontSize: "0.85rem",
                                        cursor: "pointer",
                                        background: filter === f ? "linear-gradient(135deg, #1e3a5f, #3b82f6)" : "#f1f5f9",
                                        color: filter === f ? "white" : "#64748b",
                                        transition: "all 0.2s"
                                    }}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div style={{ textAlign: "center", padding: 60 }}>
                            <div style={{ fontSize: 40 }}>⏳</div>
                            <p style={{ color: "#64748b", marginTop: 12 }}>Chargement...</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && filtered.length === 0 && (
                        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
                            <h3 style={{ color: "#0f172a", marginBottom: 8 }}>Aucun ticket</h3>
                            <p style={{ color: "#64748b", marginBottom: 24 }}>
                                Vous n'avez pas encore de tickets dans cette catégorie
                            </p>
                            <button className="btn-primary" onClick={() => navigate("/new-ticket")}>
                                Créer mon premier ticket
                            </button>
                        </div>
                    )}

                    {/* Tickets */}
                    {filtered.map(ticket => (
                        <div key={ticket._id}
                             className={`ticket-item priority-${ticket.priority}`}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                <div className="ticket-title">{ticket.title}</div>
                                <span className={`badge badge-${ticket.status.replace(" ", "-")}`}>
                  {ticket.status}
                </span>
                            </div>

                            <div className="ticket-desc">{ticket.description}</div>

                            <div className="ticket-meta">
                <span className={`badge badge-${ticket.priority}`}>
                  {ticket.priority === "élevé" ? "🔴" : ticket.priority === "moyen" ? "🟡" : "🟢"} {ticket.priority}
                </span>
                                <span className="badge" style={{ background: "#f1f5f9", color: "#475569" }}>
                  📂 {ticket.category}
                </span>
                                <span style={{ color: "#94a3b8", fontSize: "0.8rem", marginLeft: "auto" }}>
                  {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                </span>
                            </div>

                            {ticket.aiSuggestion && (
                                <div className="alert alert-ai" style={{ marginTop: 12, marginBottom: 0 }}>
                                    💡 <strong>Suggestion IA :</strong> {ticket.aiSuggestion}
                                </div>
                            )}

                            {ticket.adminNote && (
                                <div className="alert alert-success" style={{ marginTop: 8, marginBottom: 0 }}>
                                    👨‍💼 <strong>Note admin :</strong> {ticket.adminNote}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}