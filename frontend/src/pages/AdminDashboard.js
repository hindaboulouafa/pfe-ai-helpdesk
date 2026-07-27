import { useState, useEffect } from "react";
import { getAllTickets, updateTicket } from "../api";
import Sidebar from "../Sidebar";

const CATEGORIES = {
    "réseau":   { icon: "🌐", color: "#3b82f6", bg: "#eff6ff" },
    "matériel": { icon: "💻", color: "#8b5cf6", bg: "#f5f3ff" },
    "logiciel": { icon: "⚙️", color: "#f59e0b", bg: "#fffbeb" },
    "accès":    { icon: "🔐", color: "#ef4444", bg: "#fef2f2" },
    "autre":    { icon: "📦", color: "#64748b", bg: "#f8fafc" },
};

const PRIORITIES = {
    "élevé":  { icon: "🔴", color: "#ef4444", bg: "#fef2f2" },
    "moyen":  { icon: "🟡", color: "#f59e0b", bg: "#fffbeb" },
    "faible": { icon: "🟢", color: "#10b981", bg: "#f0fdf4" },
};

const STATUS = {
    "ouvert":    { color: "#f59e0b", bg: "#fffbeb" },
    "en cours":  { color: "#3b82f6", bg: "#eff6ff" },
    "résolu":    { color: "#10b981", bg: "#f0fdf4" },
    "fermé":     { color: "#64748b", bg: "#f8fafc" },
};

export default function AdminDashboard() {
    const [tickets, setTickets] = useState([]);
    const [filter, setFilter] = useState("tous");
    const [catFilter, setCatFilter] = useState("tous");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllTickets()
            .then(({ data }) => setTickets(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdate = async (id, field, value) => {
        try {
            const { data } = await updateTicket(id, { [field]: value });
            setTickets(prev => prev.map(t => t._id === id ? data : t));
        } catch (err) {
            alert("Erreur lors de la mise à jour");
        }
    };

    const filtered = tickets
        .filter(t => filter === "tous" || t.status === filter)
        .filter(t => catFilter === "tous" || t.category === catFilter);

    const stats = [
        { label: "Total", value: tickets.length, icon: "🎫", color: "#3b82f6", bg: "#eff6ff" },
        { label: "Ouverts", value: tickets.filter(t => t.status === "ouvert").length, icon: "🟡", color: "#f59e0b", bg: "#fffbeb" },
        { label: "En cours", value: tickets.filter(t => t.status === "en cours").length, icon: "🔵", color: "#3b82f6", bg: "#eff6ff" },
        { label: "Résolus", value: tickets.filter(t => t.status === "résolu").length, icon: "✅", color: "#10b981", bg: "#f0fdf4" },
    ];

    return (
        <div className="app-layout">
            <Sidebar active="admin" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2>⚙️ Tableau de Bord Admin</h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Gérez tous les tickets de support
                        </div>
                    </div>
                    <span className="topbar-badge">
            {tickets.length} ticket{tickets.length > 1 ? "s" : ""} au total
          </span>
                </div>

                <div style={{ padding: "1.5rem" }}>

                    {/* Stats */}
                    <div className="stat-grid" style={{ marginBottom: 24 }}>
                        {stats.map((s, i) => (
                            <div key={i} className="stat-card">
                                <div className="stat-icon" style={{ background: s.bg, fontSize: "1.6rem" }}>
                                    {s.icon}
                                </div>
                                <div className="stat-info">
                                    <h3 style={{ color: s.color }}>{s.value}</h3>
                                    <p>{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    { /* Répartition par catégorie */ }
                    <div className="card" style={{ marginBottom: 24, padding: "1.25rem 1.5rem" }}>
                        <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a" }}>
                            📊 Répartition par catégorie
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {Object.entries(CATEGORIES).map(([cat, info]) => {
                                const count = tickets.filter(t => t.category === cat).length;
                                return (
                                    <div key={cat}
                                         onClick={() => setCatFilter(catFilter === cat ? "tous" : cat)}
                                         style={{
                                             flex: 1, minWidth: 100,
                                             background: catFilter === cat ? info.color : info.bg,
                                             border: `2px solid ${info.color}`,
                                             borderRadius: 12, padding: "14px 16px",
                                             textAlign: "center", cursor: "pointer",
                                             transition: "all 0.2s"
                                         }}>
                                        <div style={{ fontSize: 24, marginBottom: 4 }}>{info.icon}</div>
                                        <div style={{
                                            fontWeight: 700, fontSize: "1.4rem",
                                            color: catFilter === cat ? "white" : info.color
                                        }}>{count}</div>
                                        <div style={{
                                            fontSize: "0.78rem", fontWeight: 600,
                                            color: catFilter === cat ? "rgba(255,255,255,0.85)" : info.color,
                                            textTransform: "capitalize"
                                        }}>{cat}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filtres statut */}
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
                                ({f === "tous" ? tickets.length : tickets.filter(t => t.status === f).length})
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

                    {/* Tickets */}
                    {filtered.map(ticket => {
                        const cat = CATEGORIES[ticket.category] || CATEGORIES["autre"];
                        const pri = PRIORITIES[ticket.priority] || PRIORITIES["moyen"];
                        const sta = STATUS[ticket.status] || STATUS["ouvert"];

                        return (
                            <div key={ticket._id} style={{
                                background: "white",
                                borderRadius: 14,
                                padding: "1.25rem 1.5rem",
                                marginBottom: 12,
                                border: "1px solid #f1f5f9",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                borderLeft: `5px solid ${cat.color}`,
                                transition: "all 0.2s"
                            }}>

                                {/* Header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: 3 }}>
                                            {ticket.title}
                                        </div>
                                        <div style={{ color: "#64748b", fontSize: "0.82rem" }}>
                                            👤 {ticket.user?.name} — {ticket.user?.email}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: "4px 14px", borderRadius: 20,
                                        fontSize: "0.78rem", fontWeight: 700,
                                        background: sta.bg, color: sta.color,
                                        border: `1px solid ${sta.color}`
                                    }}>
                    {ticket.status}
                  </span>
                                </div>

                                {/* Description */}
                                <div style={{ color: "#475569", fontSize: "0.88rem", marginBottom: 12, lineHeight: 1.6 }}>
                                    {ticket.description}
                                </div>

                                {/* Badges */}
                                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{
                      padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600,
                      background: cat.bg, color: cat.color, border: `1px solid ${cat.color}`
                  }}>
                    {cat.icon} {ticket.category}
                  </span>
                                    <span style={{
                                        padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600,
                                        background: pri.bg, color: pri.color, border: `1px solid ${pri.color}`
                                    }}>
                    {pri.icon} {ticket.priority}
                  </span>
                                    <span style={{ color: "#94a3b8", fontSize: "0.78rem", marginLeft: "auto" }}>
                    📅 {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                                </div>

                                {/* AI Suggestion */}
                                {ticket.aiSuggestion && (
                                    <div style={{
                                        background: "#f5f3ff", border: "1px solid #ddd6fe",
                                        borderRadius: 10, padding: "10px 14px",
                                        fontSize: "0.85rem", color: "#5b21b6", marginBottom: 12
                                    }}>
                                        🤖 <strong>Suggestion IA :</strong> {ticket.aiSuggestion}
                                    </div>
                                )}

                                {/* Actions */}
                                <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 10 }}>
                                    <select
                                        className="form-select"
                                        style={{ padding: "8px 12px", fontSize: "0.88rem" }}
                                        value={ticket.status}
                                        onChange={e => handleUpdate(ticket._id, "status", e.target.value)}>
                                        <option value="ouvert">🟡 Ouvert</option>
                                        <option value="en cours">🔵 En cours</option>
                                        <option value="résolu">✅ Résolu</option>
                                        <option value="fermé">⬛ Fermé</option>
                                    </select>
                                    <input
                                        className="form-input"
                                        style={{ padding: "8px 12px", fontSize: "0.88rem" }}
                                        placeholder="✏️ Ajouter une note admin..."
                                        defaultValue={ticket.adminNote || ""}
                                        onBlur={e => handleUpdate(ticket._id, "adminNote", e.target.value)}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {!loading && filtered.length === 0 && (
                        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
                            <h3 style={{ color: "#0f172a" }}>Aucun ticket dans cette catégorie</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}