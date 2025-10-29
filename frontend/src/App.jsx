// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';  // ✅ đúng

// ✅ Các trang & component
import LoginForm from './components/LoginForm';  // ✅ đúng
import RegisterForm from './components/RegisterForm';  // ✅ đúng
import ProductManagement from './pages/Admin/ProductManagement';  // SỬA: Bỏ .jsx
import ProtectedAdminRoute from './pages/Admin/ProtectedAdminRoute';  // SỬA: Bỏ .jsx
// ✅ Layout đơn giản cho trang người dùng
const HomeContent = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Xin chào, {user?.name}!</h2>
      <p>Email: {user?.email}</p>
      <p>Vai trò: <strong>{user?.role}</strong></p>

      <button
        onClick={logout}
        style={{
          padding: '10px 15px',
          backgroundColor: 'gray',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Đăng Xuất
      </button>

      {/* Nếu là admin thì hiển thị link đến trang quản lý */}
      {user?.role?.toLowerCase() === 'admin' && (
        <div style={{ marginTop: '20px' }}>
          <a
            href="/admin"
            style={{
              padding: '10px 15px',
              backgroundColor: '#2ecc71',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
            }}
          >
            👉 Vào Trang Quản Lý Sản Phẩm
          </a>
        </div>
      )}
    </div>
  );
};

// ✅ App chính
function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ textAlign: 'center' }}>Đang tải...</div>;
  }

  return (
    <BrowserRouter>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        Hệ thống Đánh giá Sản phẩm
      </h1>

      <Routes>
        {/* --- TRANG CHÍNH --- */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <HomeContent />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <RegisterForm />
                <LoginForm />
              </div>
            )
          }
        />

        {/* --- TRANG ADMIN ĐƯỢC BẢO VỆ --- */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<ProductManagement />} />
        </Route>

        {/* --- Mặc định chuyển hướng nếu không khớp route --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
