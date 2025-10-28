import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/"); // Chuyển về trang chủ sau khi đăng nhập
    } catch (err) {
      setError(err.response?.data?.msg || "Đăng nhập thất bại.");
    }
  };

  if (isAuthenticated) {
    return (
      <p style={{ textAlign: "center", color: "green", marginTop: "40px" }}>
        ✅ Bạn đã đăng nhập thành công!
      </p>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #8cbdf1 0%, #00c6ff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 35px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          textAlign: "center",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <h2
          style={{
            marginBottom: 20,
            color: "#007bff",
            fontWeight: 700,
            fontSize: 28,
          }}
        >
          Đăng Nhập
        </h2>

        {error && (
          <p style={{ color: "red", marginBottom: 12, fontSize: 14 }}>
            ❌ {error}
          </p>
        )}

        <div style={{ marginBottom: 15, textAlign: "left" }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              marginTop: 6,
              border: "1px solid #ccc",
              borderRadius: 8,
              fontSize: 15,
            }}
          />
        </div>

        <div style={{ marginBottom: 20, textAlign: "left" }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              marginTop: 6,
              border: "1px solid #ccc",
              borderRadius: 8,
              fontSize: 15,
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(90deg, #007bff, #00aaff)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          🔐 Đăng Nhập
        </button>

        <p
          style={{
            marginTop: 20,
            fontSize: 14,
            color: "#555",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#007bff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
