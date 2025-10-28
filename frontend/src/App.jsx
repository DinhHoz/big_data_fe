// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import LoginForm from './components/LoginForm'; // Giả định đã tạo
import RegisterForm from './components/RegisterForm'; // Giả định đã tạo
import Header from './components/Header'; // Giả định đã tạo và nằm trong components/Header.jsx

// Component Layout cơ bản để giữ Header và Footer
const Layout = ({ children }) => {
    return (
        <>
            <Header /> {/* Header hiển thị ở mọi trang */}
            <main style={{ padding: '20px' }}>
                {children}
            </main>
            {/* Thêm Footer nếu có */}
        </>
    );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dùng Layout cho các route */}
        <Route path="/" element={<Layout><ProductList /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        
        {/* Route không dùng Layout (nếu muốn form login/register full-page) */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Route có bảo vệ (Protected Route) sẽ cần logic khác */}
        <Route path="/profile" element={<Layout><div>Trang cá nhân</div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;