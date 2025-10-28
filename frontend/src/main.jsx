// src/main.jsx

import React from 'react';
import { createRoot } from 'react-dom/client';
// ❌ BỎ import { BrowserRouter, Routes, Route } từ đây
import App from './App.jsx'; // Import component App chính
import './index.css';

// Import AuthProvider (giả định nằm trong src/context/AuthContext.jsx)
import { AuthProvider } from './context/AuthContext'; 

// ❌ BỎ định nghĩa lại hàm App() ở đây

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* Bọc toàn bộ ứng dụng bằng AuthProvider */}
    <AuthProvider> 
      <App />
    </AuthProvider>
  </React.StrictMode>
);

/* ❌ BỎ các lệnh render trùng lặp hoặc sai vị trí 
ReactDOM.createRoot(document.getElementById('root')).render(...)
createRoot(document.getElementById('root')).render(<App />); 
*/