import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    api
      .get("/products")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setError("Dữ liệu API trả về không hợp lệ.");
        }
      })
      .catch((err) => {
        console.error("Lỗi gọi API /products:", err);
        setError("Không thể tải sản phẩm. Kiểm tra kết nối Backend.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading)
    return (
      <div style={{ padding: 40, textAlign: "center", fontSize: 18 }}>
        🔄 Đang tải danh sách sản phẩm...
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        ❌ Lỗi: {error}
      </div>
    );

  if (products.length === 0)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        😔 Chưa có sản phẩm nào.
      </div>
    );

  return (
    // ✅ Toàn trang có nền xám nhẹ
    <div
      style={{
        backgroundColor: "#fefeffff",
        minHeight: "100vh",
        padding: "40px 5%",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
          fontSize: 32,
          color: "#222",
          fontWeight: "700",
          letterSpacing: 1,
        }}
      >
        Danh sách sản phẩm ({products.length})
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        {products.map((p) => {
          const imageUrl =
            Array.isArray(p.images) && p.images.length > 0
              ? p.images[0]
              : "https://via.placeholder.com/300x300?text=No+Image";

          return (
            <div
              key={p._key || p._id}
              style={{
                border: "1px solid #eee",
                borderRadius: 16,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0,0,0,0.08)";
              }}
            >
              {/* Ảnh sản phẩm */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#fafafa",
                }}
              >
                <img
                  src={imageUrl}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: 240,
                    objectFit: "contain",
                    transition: "transform 0.4s ease",
                    padding: 16,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1.0)")
                  }
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/300x300?text=Image+Not+Found")
                  }
                />
              </div>

              {/* Nội dung sản phẩm */}
              <div style={{ padding: "16px 18px" }}>
                <h3
                  style={{
                    fontSize: 18,
                    marginBottom: 8,
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: 14,
                    minHeight: 40,
                    marginBottom: 10,
                    lineHeight: "1.4em",
                  }}
                >
                  {p.description}
                </p>
                <p style={{ fontSize: 15, marginBottom: 4 }}>
                  <b>Giá:</b>{" "}
                  <span style={{ color: "#d32f2f", fontWeight: "600" }}>
                    {p.price?.toLocaleString("vi-VN")}₫
                  </span>
                </p>
                <p style={{ fontSize: 14, color: "#777" }}>
                  ⭐ <b>Đánh giá TB:</b> {p.meta?.avgRating ?? "Chưa có"}
                </p>
              </div>

              {/* Nút xem chi tiết */}
              <div style={{ textAlign: "center", padding: "12px 0 16px" }}>
                <Link
                  to={`/product/${p._key}`}
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    background:
                      "linear-gradient(135deg, #007bff 0%, #0056d2 100%)",
                    color: "#fff",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  🔍 Xem chi tiết
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
