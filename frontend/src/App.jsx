// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// === IMPORT TRANG ===
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail'; // ĐÃ THÊM
import ProductManagement from './pages/Admin/ProductManagement';
import ProtectedAdminRoute from './pages/Admin/ProtectedAdminRoute';

// === IMPORT HEADER ===
import Header from './components/Header';

// === TRANG ĐĂNG NHẬP / ĐĂNG KÝ (KHÔNG CÓ HEADER) ===
const AuthPage = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{
      display: 'flex',
      gap: '40px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      maxWidth: '900px',
      width: '100%'
    }}>
      <RegisterForm />
      <LoginForm />
    </div>
  </div>
);

// === TRANG CÓ HEADER ===
const UserPage = () => (
  <div>
    <Header />
    <ProductList />
  </div>
);

const ProductDetailPage = () => (
  <div>
    <Header />
    <ProductDetail />
  </div>
);

const AdminPage = () => (
  <div>
    <Header />
    <ProductManagement />
  </div>
);

// === APP CHÍNH ===
function App() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#2c3e50'
      }}>
        Đang tải ứng dụng...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* === TRANG CHỦ: TỰ ĐỘNG CHUYỂN === */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/products" replace />
              )
            ) : (
              <AuthPage />
            )
          }
        />

        {/* === USER === */}
        <Route path="/products" element={<UserPage />} />

        {/* === CHI TIẾT SẢN PHẨM (CÓ HEADER) === */}
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* === ADMIN === */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* === 404 === */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;