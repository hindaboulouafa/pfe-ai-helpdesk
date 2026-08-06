import { useState, useEffect } from "react";
import { getAllTickets, updateTicket } from "../api";
import Sidebar from "../Sidebar";
import { Bar, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    BarElement, Title, Tooltip, Legend, ArcElement
} from "chart.js";
import {
    IconNetwork, IconHardware, IconSoftware, IconAccess, IconBox,
    IconGear, IconTicket, IconCheck, IconBarChart, IconPieChart,
    IconFolder, IconUser, IconCalendar, IconBot, IconLoader, IconInbox, Dot
} from "../Icons";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const CATEGORIES = {
    "réseau":   { Icon: IconNetwork,  color: "#3b82f6", bg: "#eff6ff" },
    "matériel": { Icon: IconHardware, color: "#8b5cf6", bg: "#f5f3ff" },
    "logiciel": { Icon: IconSoftware, color: "#f59e0b", bg: "#fffbeb" },
    "accès":    { Icon: IconAccess,   color: "#ef4444", bg: "#fef2f2" },
    "autre":    { Icon: IconBox,      color: "#64748b", bg: "#f8fafc" },
};

const PRIORITIES = {
    "élevé":  { color: "#ef4444", bg: "#fef2f2" },
    "moyen":  { color: "#f59e0b", bg: "#fffbeb" },
    "faible": { color: "#10b981", bg: "#f0fdf4" },
};

const STATUS = {
    "ouvert":   { color: "#f59e0b", bg: "#fffbeb" },
    "en cours": { color: "#3b82f6", bg: "#eff6ff" },
    "résolu":   { color: "#10b981", bg: "#f0fdf4" },
    "fermé":    { color: "#64748b", bg: "#f8fafc" },
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
        { label: "Total", value: tickets.length, color: "#3b82f6", bg: "#eff6ff", Icon: IconTicket },
        { label: "Ouverts", value: tickets.filter(t => t.status === "ouvert").length, color: "#f59e0b", bg: "#fffbeb", dot: "#f59e0b" },
        { label: "En cours", value: tickets.filter(t => t.status === "en cours").length, color: "#3b82f6", bg: "#eff6ff", dot: "#3b82f6" },
        { label: "Résolus", value: tickets.filter(t => t.status === "résolu").length, color: "#10b981", bg: "#f0fdf4", Icon: IconCheck },
    ];

    const barData = {
        labels: ["Réseau", "Matériel", "Logiciel", "Accès", "Autre"],
        datasets: [{
            label: "Tickets",
            data: [
                tickets.filter(t => t.category === "réseau").length,
                tickets.filter(t => t.category === "matériel").length,
                tickets.filter(t => t.category === "logiciel").length,
                tickets.filter(t => t.category === "accès").length,
                tickets.filter(t => t.category === "autre").length,
            ],
            backgroundColor: ["#3b82f6","#8b5cf6","#f59e0b","#ef4444","#64748b"],
            borderRadius: 8,
        }]
    };

    const doughnutData = {
        labels: ["Ouvert", "En cours", "Résolu", "Fermé"],
        datasets: [{
            data: [
                tickets.filter(t => t.status === "ouvert").length,
                tickets.filter(t => t.status === "en cours").length,
                tickets.filter(t => t.status === "résolu").length,
                tickets.filter(t => t.status === "fermé").length,
            ],
            backgroundColor: ["#f59e0b","#3b82f6","#10b981","#64748b"],
            borderWidth: 0,
        }]
    };

    return (
        <div className="app-layout">
            <Sidebar active="admin" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <IconGear size={20} /> Tableau de Bord Admin
                        </h2>
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
                                <div className="stat-icon" style={{ background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {s.Icon ? <s.Icon size={22} color={s.color} /> : <Dot size={16} color={s.dot} />}
                                </div>
                                <div className="stat-info">
                                    <h3 style={{ color: s.color }}>{s.value}</h3>
                                    <p>{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Graphiques */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                        <div className="card" style={{ padding: "1.25rem" }}>
                            <div style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}>
                                <IconBarChart size={18} color="#3b82f6" /> Tickets par catégorie
                            </div>
                            <Bar data={barData} options={{
                                responsive: true,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                            }} />
                        </div>

                        <div className="card" style={{ padding: "1.25rem" }}>
                            <div style={{ fontWeight: 700, marginBottom: 16, color: "#0f172a", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}>
                                <IconPieChart size={18} color="#3b82f6" /> Répartition par statut
                            </div>
                            <Doughnut data={doughnutData} options={{
                                responsive: true,
                                plugins: { legend: { position: "bottom" } },
                                cutout: "65%"
                            }} />
                        </div>
                    </div>

                    {/* Répartition cliquable */}
                    <div className="card" style={{ marginBottom: 24, padding: "1.25rem 1.5rem" }}>
                        <div style={{ fontWeight: 700, marginBottom: 14, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                            <IconFolder size={18} color="#3b82f6" /> Filtrer par catégorie
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {Object.entries(CATEGORIES).map(([cat, info]) => {
                                const count = tickets.filter(t => t.category === cat).length;
                                const { Icon } = info;
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
                                        <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}>
                                            <Icon size={22} color={catFilter === cat ? "white" : info.color} />
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: "1.4rem", color: catFilter === cat ? "white" : info.color }}>{count}</div>
                                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: catFilter === cat ? "rgba(255,255,255,0.85)" : info.color, textTransform: "capitalize" }}>{cat}</div>
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

                    {loading && (
                        <div style={{ textAlign: "center", padding: 60 }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <IconLoader size={36} color="#94a3b8" />
                            </div>
                            <p style={{ color: "#64748b", marginTop: 12 }}>Chargement...</p>
                        </div>
                    )}

                    {filtered.map(ticket => {
                        const cat = CATEGORIES[ticket.category] || CATEGORIES["autre"];
                        const pri = PRIORITIES[ticket.priority] || PRIORITIES["moyen"];
                        const sta = STATUS[ticket.status] || STATUS["ouvert"];
                        const CatIcon = cat.Icon;
                        return (
                            <div key={ticket._id} style={{
                                background: "white", borderRadius: 14,
                                padding: "1.25rem 1.5rem", marginBottom: 12,
                                border: "1px solid #f1f5f9",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                borderLeft: `5px solid ${cat.color}`
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: 3 }}>{ticket.title}</div>
                                        <div style={{ color: "#64748b", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: 6 }}>
                                            <IconUser size={14} /> {ticket.user?.name} — {ticket.user?.email}
                                        </div>
                                    </div>
                                    <span style={{ padding: "4px 14px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 700, background: sta.bg, color: sta.color, border: `1px solid ${sta.color}` }}>
                    {ticket.status}
                  </span>
                                </div>

                                <div style={{ color: "#475569", fontSize: "0.88rem", marginBottom: 12, lineHeight: 1.6 }}>{ticket.description}</div>

                                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600, background: cat.bg, color: cat.color, border: `1px solid ${cat.color}`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <CatIcon size={13} color={cat.color} /> {ticket.category}
                  </span>
                                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600, background: pri.bg, color: pri.color, border: `1px solid ${pri.color}`, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Dot size={9} color={pri.color} /> {ticket.priority}
                  </span>
                                    <span style={{ color: "#94a3b8", fontSize: "0.78rem", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <IconCalendar size={13} /> {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                                </div>

                                {ticket.aiSuggestion && (
                                    <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: "10px 14px", fontSize: "0.85rem", color: "#5b21b6", marginBottom: 12, display: "flex", gap: 8, alignItems: "flex-start" }}>
                                        <IconBot size={16} color="#5b21b6" style={{ flexShrink: 0, marginTop: 2 }} />
                                        <span><strong>Suggestion IA :</strong> {ticket.aiSuggestion}</span>
                                    </div>
                                )}

                                <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 10 }}>
                                    <select className="form-select" style={{ padding: "8px 12px", fontSize: "0.88rem" }}
                                            value={ticket.status}
                                            onChange={e => handleUpdate(ticket._id, "status", e.target.value)}>
                                        <option value="ouvert">Ouvert</option>
                                        <option value="en cours">En cours</option>
                                        <option value="résolu">Résolu</option>
                                        <option value="fermé">Fermé</option>
                                    </select>
                                    <input className="form-input" style={{ padding: "8px 12px", fontSize: "0.88rem" }}
                                           placeholder="Ajouter une note admin..."
                                           defaultValue={ticket.adminNote || ""}
                                           onBlur={e => handleUpdate(ticket._id, "adminNote", e.target.value)} />
                                </div>
                            </div>
                        );
                    })}

                    {!loading && filtered.length === 0 && (
                        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                                <IconInbox size={48} color="#cbd5e1" />
                            </div>
                            <h3 style={{ color: "#0f172a" }}>Aucun ticket dans cette catégorie</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}