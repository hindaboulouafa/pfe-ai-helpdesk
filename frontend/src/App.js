import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import NewTicket from "./pages/NewTicket";
import MyTickets from "./pages/MyTickets";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";
import Groups from "./pages/Groups";
import TechnicienDashboard from "./pages/TechnicienDashboard";

function PrivateRoute({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/chat" />;
  return children;
}

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
            <Route path="/new-ticket" element={<PrivateRoute><NewTicket /></PrivateRoute>} />
            <Route path="/my-tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute adminOnly><Users /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/groups" element={<PrivateRoute adminOnly><Groups /></PrivateRoute>} />
            <Route path="/technicien" element={<PrivateRoute><TechnicienDashboard /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;