import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import logo from "./assets/supporthub_logo_transparent.png";
import {
    FiMessageSquare, FiPlusSquare,
    FiList, FiSettings, FiUsers, FiLogOut, FiGrid
} from "react-icons/fi";
export default function Sidebar({ active }) {
    const navigate = useNavigate();
    const { logoutUser, user } = useAuth();

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo">
                </div>

            </div>

            <div className="sidebar-user">
                <div className="sidebar-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="sidebar-user-info">
                    <h4>{user?.name}</h4>
                   <span>
                  {user?.role === "admin" ? "Administrateur"
                      : user?.role === "technicien" ? "Technicien IT"
                          : "Utilisateur"}
                </span>
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
                        <button className={`sidebar-link ${active === "groups" ? "active" : ""}`}
                                onClick={() => navigate("/groups")}>
                            <FiGrid className="icon" /> Groupes
                        </button>
                    </>
                )}


                {user?.role === "technicien" && (
                    <>
                        <div className="sidebar-section">Mon espace</div>
                        <button className={`sidebar-link ${active === "technicien" ? "active" : ""}`}
                                onClick={() => navigate("/technicien")}>
                            <span className="icon">🔧</span> Mes tickets
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