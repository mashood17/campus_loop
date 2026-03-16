import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (token) {
    api.get("/api/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("access_token"))
      .finally(() => setLoading(false));
  } else {
    setTimeout(() => setLoading(false), 0);
  }
}, []);

  const login = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);
  setUser(res.data.user);
  return res.data.user;
};


  const register = async (formData) => {
  const res = await api.post("/api/auth/register", formData);
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);
  setUser(res.data.user);
  return res.data.user;
};

 const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}