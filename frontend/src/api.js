import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const createTicket = (data) => API.post("/tickets", data);
export const getMyTickets = () => API.get("/tickets/my");
export const getAllTickets = () => API.get("/tickets/all");
export const updateTicket = (id, data) => API.patch(`/tickets/${id}`, data);
export const chatWithAI = (message) => API.post("/ai/chat", { message });
export const categorizeTicket = (description) => API.post("/ai/categorize", { description });
export const getUsers = () => API.get("/users");
export const createUser = (data) => API.post("/users", data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
