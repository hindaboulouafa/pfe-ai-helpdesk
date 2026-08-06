import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
    FiMonitor,
    FiMessageSquare,
    FiPlusSquare,
    FiList,
    FiSettings,
    FiUsers,
    FiLogOut
} from "react-icons/fi";

export default function Sidebar({ active }) {
    const navigate = useNavigate();
    const { logoutUser, user } = useAuth();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <h1><FiMonitor style={{ marginRight: 8 }} /> Helpdesk IT</h1>
                <p>Système de support intelligent</p>
            </div>

            <div className="sidebar-user">
                <div className="sidebar-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="sidebar-user-info">
                    <h4>{user?.name}</h4>
                    <span>{user?.role === "admin" ? "Administrateur" : "Utilisateur"}</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section">Menu principal</div>

                <button className={`sidebar-link ${active === "chat" ? "active" : ""}`}
                        onClick={() => navigate("/chat")}>
                    <FiMessageSquare className="icon" /> Assistant IA
                </button>

                <button className={`sidebar-link ${active === "new-ticket" ? "active" : ""}`}
                        onClick={() => navigate("/new-ticket")}>
                    <FiPlusSquare className="icon" /> Créer un ticket
                </button>

                <button className={`sidebar-link ${active === "my-tickets" ? "active" : ""}`}
                        onClick={() => navigate("/my-tickets")}>
                    <FiList className="icon" /> Mes tickets
                </button>

                {user?.role === "admin" && (
                    <>
                        <div className="sidebar-section">Administration</div>
                        <button className={`sidebar-link ${active === "admin" ? "active" : ""}`}
                                onClick={() => navigate("/admin")}>
                            <FiSettings className="icon" /> Tableau de bord
                        </button>
                        <button className={`sidebar-link ${active === "users" ? "active" : ""}`}
                                onClick={() => navigate("/users")}>
                            <FiUsers className="icon" /> Utilisateurs
                        </button>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={logoutUser}>
                    <FiLogOut /> Déconnexion
                </button>
            </div>
        </div>
    );
}