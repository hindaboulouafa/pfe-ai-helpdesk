import { useState } from "react";
import { login } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/supporthub_logo_transparent.png";
import { RiRobot2Line } from "react-icons/ri";
import { FiTag, FiBarChart2, FiZap } from "react-icons/fi";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(form);
            loginUser(data.token, data.user);
            if (data.user.role === "admin") {
                navigate("/admin");
            } else if (data.user.role === "technicien") {
                navigate("/technicien");
            } else {
                navigate("/chat");
            }
        } catch (err) {
            setError("Email ou mot de passe incorrect");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <img src={logo} alt="SupportHub" style={{ width: 700, marginBottom: 5 }} />
                <p>Système de support informatique intelligent propulsé par l'intelligence artificielle</p>
                <div className="auth-features">
                    <div className="auth-feature">
                        <span className="fi"><RiRobot2Line /></span>
                        <span>Assistant IA disponible 24h/24</span>
                    </div>
                    <div className="auth-feature">
                        <span className="fi"><FiTag /></span>
                        <span>Gestion intelligente des tickets</span>
                    </div>
                    <div className="auth-feature">
                        <span className="fi"><FiBarChart2 /></span>
                        <span>Tableau de bord analytique</span>
                    </div>
                    <div className="auth-feature">
                        <span className="fi"><FiZap /></span>
                        <span>Résolution rapide des incidents</span>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-box">
                    <h2>Bonjour</h2>
                    <p>Connectez-vous à votre espace de support</p>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
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
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary full" style={{ marginTop: 8 }}>
                            Se connecter →
                        </button>
                    </form>

                    <div className="divider">ou</div>

                    <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.9rem" }}>
                        Pas encore de compte ?{" "}
                        <Link to="/register" style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>
                            S'inscrire gratuitement
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}