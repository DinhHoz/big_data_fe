// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem("jwtToken");

  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Lỗi parse user từ localStorage", err);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post("/auth/login", { email, password });
      const { token, user: userData } = res.data;

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === "admin";

  // ← ĐÃ SỬA: Thêm getToken vào value
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      isAdmin,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};