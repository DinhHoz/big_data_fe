import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 Dùng Context
import "./Header.css";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Xóa token & user trong localStorage
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <Link to="/" className="header-logo-link">
          PhoneZone
        </Link>
      </div>

      {/* Menu bên phải */}
      <nav className="header-nav">
        {!isAuthenticated ? (
          // Nếu chưa đăng nhập
          <>
            <Link to="/login" className="header-btn login-btn">
              Đăng nhập
            </Link>
            <Link to="/register" className="header-btn register-btn">
              Đăng ký
            </Link>
          </>
        ) : (
          // Nếu đã đăng nhập
          <div className="header-user">
            <span className="header-username">👋 Xin chào, {user?.name}</span>
            <button onClick={handleLogout} className="header-btn logout-btn">
              Đăng xuất
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
