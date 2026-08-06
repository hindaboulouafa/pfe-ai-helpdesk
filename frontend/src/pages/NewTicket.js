import { useState } from "react";
import { createTicket, categorizeTicket } from "../api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { FiClipboard, FiCheckCircle, FiLoader, FiBookmark, FiFileText, FiFolder, FiZap, FiSend } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function NewTicket() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "autre",
        priority: "moyen"
    });
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleAnalyze = async () => {
        if (!form.description) return;
        setLoading(true);
        try {
            const { data } = await categorizeTicket(form.description);
            setAiSuggestion(data);
            setForm(prev => ({ ...prev, category: data.category }));
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTicket({
                ...form,
                aiSuggestion: aiSuggestion?.suggestion || ""
            });
            setSuccess(true);
            setTimeout(() => navigate("/my-tickets"), 1500);
        } catch (err) {
            alert("Erreur lors de la création du ticket");
        }
    };

    return (
        <div className="app-layout">
            <Sidebar active="new-ticket" />
            <div className="main-content">
                <div className="topbar">
                    <div>
                        <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FiClipboard /> Créer un Ticket
                        </h2>
                        <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: 2 }}>
                            Décrivez votre problème IT en détail
                        </div>
                    </div>
                </div>

                <div style={{ padding: "1.5rem", maxWidth: 700 }}>
                    {success && (
                        <div className="alert alert-success" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <FiCheckCircle /> Ticket créé avec succès ! Redirection...
                        </div>
                    )}

                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>

                                {/* Titre */}
                                <div className="form-group">
                                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <FiBookmark size={14} /> Titre du problème
                                    </label>
                                    <input
                                        className="form-input"
                                        placeholder="Ex: Mon ordinateur ne démarre plus"
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="form-group">
                                    <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <FiFileText size={14} /> Description détaillée
                                    </label>
                                    <textarea
                                        className="form-input"
                                        rows={5}
                                        placeholder="Décrivez votre problème en détail : que s'est-il passé ? depuis quand ? quels messages d'erreur ?"
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Bouton IA */}
                                <button
                                    type="button"
                                    className="btn-ai"
                                    onClick={handleAnalyze}
                                    disabled={loading || !form.description}
                                    style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                                    {loading ? <><FiLoader /> Analyse en cours...</> : <><RiRobot2Line /> Analyser avec l'IA</>}
                                </button>

                                {/* Suggestion IA */}
                                {aiSuggestion && (
                                    <div className="alert alert-ai" style={{ marginBottom: 16 }}>
                                        <div style={{ fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                                            <RiRobot2Line /> Analyse IA
                                        </div>
                                        <div style={{ marginBottom: 6, display: "flex", alignItems: "flex-start", gap: 6 }}>
                                            <FiZap size={14} style={{ marginTop: 3, flexShrink: 0 }} />
                                            <span><strong>Suggestion :</strong> {aiSuggestion.suggestion}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <FiFolder size={14} />
                                            <strong>Catégorie détectée :</strong>{" "}
                                            <span className={`badge badge-${aiSuggestion.category}`}>
                        {aiSuggestion.category}
                      </span>
                                        </div>
                                    </div>
                                )}

                                {/* Catégorie et Priorité */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <FiFolder size={14} /> Catégorie
                                        </label>
                                        <select
                                            className="form-select"
                                            value={form.category}
                                            onChange={e => setForm({ ...form, category: e.target.value })}>
                                            <option value="réseau">Réseau</option>
                                            <option value="matériel">Matériel</option>
                                            <option value="logiciel">Logiciel</option>
                                            <option value="accès">Accès</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <FiZap size={14} /> Priorité
                                        </label>
                                        <select
                                            className="form-select"
                                            value={form.priority}
                                            onChange={e => setForm({ ...form, priority: e.target.value })}>
                                            <option value="faible">Faible</option>
                                            <option value="moyen">Moyen</option>
                                            <option value="élevé">Élevé</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button type="submit" className="btn-primary full" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                    <FiSend /> Soumettre le ticket
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}