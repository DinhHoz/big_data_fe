import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import apiClient from "../services/api";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate(); // Khởi tạo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {
      const response = await apiClient.post("/auth/register", {
        name,
        email,
        password,
      });

      setMessage(response.data.message || "Đăng ký thành công!");
      
      // Xóa form
      setName("");
      setEmail("");
      setPassword("");

      // Chuyển hướng sau 1.5s
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.msg || "Đăng ký thất bại, vui lòng thử lại.");
    }
  };

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
          Đăng Ký Tài Khoản
        </h2>

        {message && (
          <p
            style={{
              color: isError ? "red" : "#28a745",
              marginBottom: 12,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {isError ? "Lỗi: " : "Thành công: "} {message}
          </p>
        )}

        <div style={{ marginBottom: 15, textAlign: "left" }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Họ và tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
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
            placeholder="Tạo mật khẩu"
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
          Đăng Ký
        </button>

        <p
          style={{
            marginTop: 20,
            fontSize: 14,
            color: "#555",
          }}
        >
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            style={{
              color: "#007bff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;