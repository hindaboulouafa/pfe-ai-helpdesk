import { useState, useEffect } from "react";
import { getGroups, createGroup, updateGroup, deleteGroup, getUsers } from "../api";
import Sidebar from "../Sidebar";
import { FiUsers, FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";

const CATEGORIES = {
    "réseau":   { color: "#3b82f6", bg: "#eff6ff" },
    "matériel": { color: "#8b5cf6", bg: "#f5f3ff" },
    "logiciel": { color: "#f59e0b", bg: "#fffbeb" },
    "accès":    { color: "#ef4444", bg: "#fef2f2" },
    "autre":    { color: "#64748b", bg: "#f8fafc" },
};

export default function Groups() {
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editGroup, setEditGroup] = useState(null);
    const [form, setForm] = useState({
        name: "", description: "", category: "réseau",
        members: [], color: "#3b82f6"
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([getGroups(), getUsers()])
            .then(([gRes, uRes]) => {
                setGroups(gRes.data);
                setUsers(uRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editGroup) {
                const { data } = await updateGroup(editGroup._id, form);
                setGroups(prev => prev.map(g => g._id === editGroup._id ? data : g));
                setSuccess("Groupe modifié ✅");
            } else {
                const { data } = await createGroup(form);
                setGroups(prev => [data, ...prev]);
                setSuccess("Groupe créé ✅");
            }
            setForm({ name: "", description: "", category: "réseau", members: [], color: "#3b82f6" });
            setShowForm(false);
            setEditGroup(null);
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur");
        }
    };

    const handleEdit = (group) => {
        setEditGroup(group);
        setForm({
            name: group.name,
            description: group.description || "",
            category: group.category,
            members: group.members.map(m => m._id),
            color: group.color || "#3b82f6"
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce groupe ?")) return;
        try {
            await deleteGroup(id);
            setGroups(prev => prev.filter(g => g._id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression");
        }
    };

    const toggleMember = (userId) => {
        setForm(prev => ({
            ...prev,
            members: prev.members.includes(userId)
                ? prev.members.filter(id => id !== userId)
                : [...prev.members, userId]
        }));
    };

    return (
        <div className="app-layout">
            <Sidebar active="groups" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FiUsers /> Groupes d'Affectation
                        </h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Organisez vos équipes IT par spécialité
                        </div>
                    </div>
                    <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditGroup(null); setForm({ name: "", description: "", category: "réseau", members: [], color: "#3b82f6" }); }}>
                        <FiPlus style={{ marginRight: 6 }} />
                        {showForm ? "Annuler" : "Nouveau groupe"}
                    </button>
                </div>

                <div style={{ padding: "1.5rem" }}>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-error">{error}</div>}

                    {/* Formulaire */}
                    {showForm && (
                        <div className="card" style={{ marginBottom: 24 }}>
                            <div className="card-header">
                                <h3>{editGroup ? "✏️ Modifier le groupe" : "➕ Créer un groupe"}</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                        <div className="form-group" style={{ margin: 0 }}>
                                            <label className="form-label">Nom du groupe</label>
                                            <input className="form-input"
                                                   placeholder="Ex: Équipe Réseau"
                                                   value={form.name}
                                                   onChange={e => setForm({ ...form, name: e.target.value })}
                                                   required />
                                        </div>
                                        <div className="form-group" style={{ margin: 0 }}>
                                            <label className="form-label">Catégorie spécialisée</label>
                                            <select className="form-select"
                                                    value={form.category}
                                                    onChange={e => setForm({ ...form, category: e.target.value })}>
                                                <option value="réseau">🌐 Réseau</option>
                                                <option value="matériel">💻 Matériel</option>
                                                <option value="logiciel">⚙️ Logiciel</option>
                                                <option value="accès">🔐 Accès</option>
                                                <option value="autre">📦 Autre</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Description</label>
                                        <input className="form-input"
                                               placeholder="Description du groupe..."
                                               value={form.description}
                                               onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Couleur du groupe</label>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            {["#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#10b981", "#0f172a"].map(c => (
                                                <div key={c} onClick={() => setForm({ ...form, color: c })}
                                                     style={{ width: 32, height: 32, borderRadius: "50%", background: c, cursor: "pointer", border: form.color === c ? "3px solid #0f172a" : "3px solid transparent", transition: "all 0.2s" }} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Membres ({form.members.length} sélectionnés)</label>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, maxHeight: 200, overflowY: "auto" }}>
                                            {users.filter(u => u.role === "technicien" || u.role === "admin").map(user => (                                                <div key={user._id}
                                                     onClick={() => toggleMember(user._id)}
                                                     style={{
                                                         padding: "8px 12px", borderRadius: 10, cursor: "pointer",
                                                         border: `2px solid ${form.members.includes(user._id) ? form.color : "#e2e8f0"}`,
                                                         background: form.members.includes(user._id) ? `${form.color}15` : "white",
                                                         display: "flex", alignItems: "center", gap: 8,
                                                         transition: "all 0.2s"
                                                     }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: form.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 }}>
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{user.name}</div>
                                                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{user.role}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary">
                                        {editGroup ? "✅ Modifier" : "✅ Créer le groupe"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Liste groupes */}
                    {loading && <div style={{ textAlign: "center", padding: 60 }}><div style={{ fontSize: 40 }}>⏳</div></div>}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                        {groups.map(group => {
                            const cat = CATEGORIES[group.category] || CATEGORIES["autre"];
                            return (
                                <div key={group._id} className="card">
                                    <div style={{ padding: "1.25rem" }}>
                                        {/* Header */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <div style={{ width: 44, height: 44, borderRadius: 12, background: group.color || cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                                                    {group.category === "réseau" ? "🌐" : group.category === "matériel" ? "💻" : group.category === "logiciel" ? "⚙️" : group.category === "accès" ? "🔐" : "📦"}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>{group.name}</div>
                                                    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 600, background: cat.bg, color: cat.color, border: `1px solid ${cat.color}` }}>
                            {group.category}
                          </span>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <button onClick={() => handleEdit(group)}
                                                        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#475569" }}>
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(group._id)}
                                                        style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #fca5a5", background: "#fef2f2", cursor: "pointer", color: "#ef4444" }}>
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {group.description && (
                                            <p style={{ color: "#64748b", fontSize: "0.85rem", marginBottom: 12 }}>{group.description}</p>
                                        )}

                                        {/* Membres */}
                                        <div>
                                            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: 8 }}>
                                                MEMBRES ({group.members?.length || 0})
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                {group.members?.length === 0 && (
                                                    <span style={{ color: "#94a3b8", fontSize: "0.82rem" }}>Aucun membre</span>
                                                )}
                                                {group.members?.map(member => (
                                                    <div key={member._id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "#f1f5f9", fontSize: "0.8rem" }}>
                                                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: group.color || "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.65rem", fontWeight: 700 }}>
                                                            {member.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span style={{ color: "#475569", fontWeight: 500 }}>{member.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {!loading && groups.length === 0 && (
                        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                            <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
                            <h3 style={{ color: "#0f172a", marginBottom: 8 }}>Aucun groupe créé</h3>
                            <p style={{ color: "#64748b", marginBottom: 24 }}>Créez des groupes pour organiser vos équipes IT</p>
                            <button className="btn-primary" onClick={() => setShowForm(true)}>
                                Créer mon premier groupe
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}