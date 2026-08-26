import { useState, useEffect } from "react";
import { getUsers, createUser, deleteUser } from "../api";
import Sidebar from "../Sidebar";
import { FiUsers, FiUser, FiCalendar, FiX, FiPlusCircle, FiCheckCircle, FiLoader, FiTrash2 } from "react-icons/fi";
import { RiVipCrownLine } from "react-icons/ri";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        getUsers()
            .then(({ data }) => setUsers(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const { data } = await createUser(form);
            setUsers(prev => [data, ...prev]);
            setForm({ name: "", email: "", password: "", role: "user" });
            setShowForm(false);
            setSuccess("Utilisateur créé avec succès");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la création");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cet utilisateur ?")) return;
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const roleColor = {
        admin: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
        technicien: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
        user: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" }
    };

    return (
        <div className="app-layout">
            <Sidebar active="users" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FiUsers /> Gestion des Utilisateurs
                        </h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Créez et gérez les comptes utilisateurs
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => setShowForm(!showForm)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {showForm ? <><FiX /> Annuler</> : <>+ Nouvel utilisateur</>}
                    </button>
                </div>

                <div style={{ padding: "1.5rem" }}>

                    {/* Stats */}
                    <div className="stat-grid" style={{ marginBottom: 24 }}>
                        {[
                            { label: "Total utilisateurs", value: users.length, Icon: FiUsers, color: "#3b82f6", bg: "#eff6ff" },
                            { label: "Administrateurs", value: users.filter(u => u.role === "admin").length, Icon: RiVipCrownLine, color: "#6d28d9", bg: "#f5f3ff" },
                            { label: "Utilisateurs", value: users.filter(u => u.role === "user").length, Icon: FiUser, color: "#10b981", bg: "#f0fdf4" },
                            { label: "Ce mois", value: users.filter(u => new Date(u.createdAt).getMonth() === new Date().getMonth()).length, Icon: FiCalendar, color: "#f59e0b", bg: "#fffbeb" },
                            { label: "Techniciens", value: users.filter(u => u.role === "technicien").length, Icon: FiUsers, color: "#c2410c", bg: "#fff7ed" },

                        ].map((s, i) => (
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

                    {/* Alerts */}
                    {success && (
                        <div className="alert alert-success" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FiCheckCircle /> {success}
                        </div>
                    )}
                    {error && <div className="alert alert-error">{error}</div>}

                    {/* Formulaire création */}
                    {showForm && (
                        <div className="card" style={{ marginBottom: 24 }}>
                            <div className="card-header">
                                <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <FiPlusCircle /> Créer un nouvel utilisateur
                                </h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleCreate}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Nom complet</label>
                                            <input className="form-input" placeholder="Prénom Nom"
                                                   value={form.name}
                                                   onChange={e => setForm({ ...form, name: e.target.value })}
                                                   required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Email</label>
                                            <input className="form-input" type="email" placeholder="email@exemple.com"
                                                   value={form.email}
                                                   onChange={e => setForm({ ...form, email: e.target.value })}
                                                   required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Mot de passe</label>
                                            <input className="form-input" type="password" placeholder="Minimum 6 caractères"
                                                   value={form.password}
                                                   onChange={e => setForm({ ...form, password: e.target.value })}
                                                   required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Rôle</label>
                                            <select className="form-select"
                                                    value={form.role}
                                                    onChange={e => setForm({ ...form, role: e.target.value })}>
                                                <option value="user">👤 Utilisateur</option>
                                                <option value="technicien">🔧 Technicien IT</option>
                                                <option value="admin">👑 Administrateur</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                        <FiCheckCircle /> Créer l'utilisateur
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Liste utilisateurs */}
                    <div className="card">
                        <div className="card-header">
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <FiUsers /> Liste des utilisateurs ({users.length})
                            </h3>
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            {loading && (
                                <div style={{ textAlign: "center", padding: 40 }}>
                                    <FiLoader size={28} color="#94a3b8" />
                                </div>
                            )}
                            {!loading && users.map((user, i) => (
                                <div key={user._id} style={{
                                    display: "flex", alignItems: "center", gap: 16,
                                    padding: "1rem 1.5rem",
                                    borderBottom: i < users.length - 1 ? "1px solid #f1f5f9" : "none",
                                    transition: "background 0.2s"
                                }}
                                     onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                                     onMouseLeave={e => e.currentTarget.style.background = "white"}>

                                    {/* Avatar */}
                                    <div style={{
                                        width: 44, height: 44, borderRadius: "50%",
                                        background: user.role === "admin"
                                            ? "linear-gradient(135deg, #6d28d9, #8b5cf6)"
                                            : "linear-gradient(135deg, #1e3a5f, #3b82f6)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "white", fontWeight: 700, fontSize: "1.1rem",
                                        flexShrink: 0
                                    }}>
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{user.name}</div>
                                        <div style={{ color: "#64748b", fontSize: "0.85rem" }}>{user.email}</div>
                                    </div>

                                    {/* Role badge */}
                                    <span style={{
                                        padding: "4px 14px", borderRadius: 20,
                                        fontSize: "0.78rem", fontWeight: 700,
                                        background: roleColor[user.role]?.bg,
                                        color: roleColor[user.role]?.color,
                                        border: `1px solid ${roleColor[user.role]?.border}`,
                                        display: "inline-flex", alignItems: "center", gap: 5
                                    }}>
                               {user.role === "admin"
                        ? <><RiVipCrownLine size={13} /> Admin</>
                        : user.role === "technicien"
                            ? <>🔧 Technicien IT</>
                            : <><FiUser size={13} /> Utilisateur</>}
                                                        </span>

                                    {/* Date */}
                                    <div style={{ color: "#94a3b8", fontSize: "0.8rem", minWidth: 90, textAlign: "right", display: "inline-flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                                        <FiCalendar size={13} /> {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                                    </div>

                                    {/* Delete */}
                                    <button onClick={() => handleDelete(user._id)}
                                            style={{
                                                background: "#fef2f2", color: "#ef4444",
                                                border: "1px solid #fca5a5",
                                                padding: "6px 12px", borderRadius: 8,
                                                cursor: "pointer", fontSize: "0.82rem", fontWeight: 600,
                                                display: "inline-flex", alignItems: "center", gap: 5
                                            }}>
                                        <FiTrash2 size={13} /> Supprimer
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}