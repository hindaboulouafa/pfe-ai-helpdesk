import { useState, useEffect } from "react";
import { getMyTickets } from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { FiClipboard, FiCheckCircle, FiLoader, FiInbox, FiFolder, FiUserCheck } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

const Dot = ({ color }) => (
    <span style={{ width: 18, height: 18, borderRadius: "50%", background: color, display: "inline-block" }} />
);

const PRIORITY_COLOR = { "élevé": "#ef4444", "moyen": "#f59e0b", "faible": "#10b981" };

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
                        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FiClipboard /> Mes Tickets
                        </h2>
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
                            { label: "Total", value: tickets.length, Icon: FiClipboard, color: "#3b82f6", bg: "#eff6ff" },
                            { label: "Ouverts", value: tickets.filter(t => t.status === "ouvert").length, dot: "#f59e0b", color: "#f59e0b", bg: "#fffbeb" },
                            { label: "En cours", value: tickets.filter(t => t.status === "en cours").length, dot: "#3b82f6", color: "#3b82f6", bg: "#eff6ff" },
                            { label: "Résolus", value: tickets.filter(t => t.status === "résolu").length, Icon: FiCheckCircle, color: "#10b981", bg: "#f0fdf4" },
                        ].map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-icon" style={{ background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {s.Icon ? <s.Icon color={s.color} /> : <Dot color={s.dot} />}
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
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <FiLoader size={32} color="#94a3b8" />
                            </div>
                            <p style={{ color: "#64748b", marginTop: 12 }}>Chargement...</p>
                        </div>
                    )}


                    {/* Empty */}
                    {!loading && filtered.length === 0 && (
                        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                                <FiInbox size={48} color="#cbd5e1" />
                            </div>
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
                <span className={`badge badge-${ticket.priority}`} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Dot color={PRIORITY_COLOR[ticket.priority] || "#94a3b8"} /> {ticket.priority}
                </span>
                                <span className="badge" style={{ background: "#f1f5f9", color: "#475569", display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <FiFolder size={13} /> {ticket.category}
                </span>
                                <span style={{ color: "#94a3b8", fontSize: "0.8rem", marginLeft: "auto" }}>
                  {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                </span>
                            </div>

                            {ticket.aiSuggestion && (
                                <div className="alert alert-ai" style={{ marginTop: 12, marginBottom: 0, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                    <RiRobot2Line style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span><strong>Suggestion IA :</strong> {ticket.aiSuggestion}</span>
                                </div>
                            )}

                            {ticket.adminNote && (
                                <div className="alert alert-success" style={{ marginTop: 8, marginBottom: 0, display: "flex", alignItems: "flex-start", gap: 8 }}>
                                    <FiUserCheck style={{ flexShrink: 0, marginTop: 2 }} />
                                    <span><strong>Note admin :</strong> {ticket.adminNote}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}