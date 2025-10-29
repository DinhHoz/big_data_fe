// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/" className="header-logo-link">
          PhoneZone
        </Link>
      </div>

      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <>
                <Link to="/admin/products" className="header-btn admin-btn">
                  🛒 Quản lý sản phẩm
                </Link>
                <Link to="/admin/reviews" className="header-btn admin-btn">
                  💬 Quản lý phản hồi
                </Link>
              </>
            )}
            <span className="user-name">👋 {user?.name}</span>
            <button onClick={logout} className="header-btn logout-btn">
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="header-btn login-btn">
              Đăng nhập
            </Link>
            <Link to="/register" className="header-btn register-btn">
              Đăng ký
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
