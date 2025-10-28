// src/context/AuthContext.jsx (Phiên bản đầy đủ)

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/api'; // Giả định bạn đã tạo file này

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Trạng thái user: {id, name, email}
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi tạo: Đọc LocalStorage khi ứng dụng tải
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('jwtToken');
    
    if (storedUser && storedToken) {
      // 1. Phục hồi trạng thái người dùng
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      // 2. Token đã được lưu, nó sẽ tự động được Axios Interceptor đính kèm
    }
    setIsLoading(false);
  }, []);

  // Hàm đăng nhập (được gọi từ LoginForm)
  const login = async (email, password) => {
    try {
      // Gọi API Backend
      const response = await apiClient.post('/auth/login', { email, password });
      
      // Backend trả về { token, user: { id, name, email } }
      const { token, user: userData } = response.data;
      
      // 🔥 LƯU TRỮ TRẠNG THÁI VÀO LOCAL STORAGE 🔥
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Cập nhật trạng thái Context
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      throw error; // Ném lỗi để LoginForm xử lý hiển thị thông báo
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};