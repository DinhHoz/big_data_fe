// src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; 
import './index.css';

// 1. SỬA ĐỔI: Bỏ phần mở rộng .jsx khỏi AuthContext
// Lý do: Đồng bộ hóa cách import và tránh lỗi phân giải của Dev Server.
import { AuthProvider } from './context/AuthContext'; 

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* 2. Bọc toàn bộ ứng dụng bằng AuthProvider để useAuth hoạt động */}
    <AuthProvider> 
      <App />
    </AuthProvider>
  </React.StrictMode>
);