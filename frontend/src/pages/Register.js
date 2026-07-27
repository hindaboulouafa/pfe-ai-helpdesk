import { useState } from "react";
import { register } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await register(form);
            loginUser(data.token, data.user);
            navigate("/chat");
        } catch (err) {
            setError("Erreur lors de l'inscription");
        }
    };

    return (
        <div className="auth-page">
            {/* Côté gauche */}
            <div className="auth-left">
                <div style={{ fontSize: 64, marginBottom: 16 }}>🚀</div>
                <h1>Rejoignez-nous !</h1>
                <p>Créez votre compte et accédez à un support IT intelligent et réactif</p>

                <div className="auth-features">
                    <div className="auth-feature">
                        <span className="fi">✅</span>
                        <span>Inscription gratuite et rapide</span>
                    </div>
                    <div className="auth-feature">
                        <span className="fi">🔐</span>
                        <span>Données sécurisées et chiffrées</span>
                    </div>
                    <div className="auth-feature">
                        <span className="fi">🤖</span>
                        <span>IA prête à vous aider</span>
                    </div>
                    <div className="auth-feature">
                        <span className="fi">📱</span>
                        <span>Accès depuis n'importe où</span>
                    </div>
                </div>
            </div>

            {/* Côté droit */}
            <div className="auth-right">
                <div className="auth-form-box">
                    <h2>Créer un compte 🎉</h2>
                    <p>Remplissez le formulaire pour commencer</p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nom complet</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Votre prénom et nom"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Adresse email</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="votre@email.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Minimum 6 caractères"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary full" style={{ marginTop: 8 }}>
                            Créer mon compte →
                        </button>
                    </form>

                    <div className="divider">ou</div>

                    <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.9rem" }}>
                        Déjà un compte ?{" "}
                        <Link to="/login" style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}