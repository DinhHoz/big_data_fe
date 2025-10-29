// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ReviewForm from "../components/ReviewForm";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditingReviewId, setIsEditingReviewId] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:4000${path.startsWith("/") ? path : "/" + path}`;
  };

  // ===== TẢI CHI TIẾT SẢN PHẨM =====
  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    }
  };

  // ===== TẢI DANH SÁCH ĐÁNH GIÁ =====
  const loadReviews = async () => {
    try {
      const res = await api.get(`/reviews/product/${id}`);
      const { reviews: fetchedReviews, avgRating, totalReviews } = res.data;

      setReviews(fetchedReviews || []);
      setProduct((prev) => ({
        ...prev,
        meta: { avgRating: avgRating || 0, totalReviews: totalReviews || 0 },
      }));
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err.response?.data || err);
    }
  };

  const loadAll = async () => {
    await Promise.all([loadProduct(), loadReviews()]);
    setIsEditingReviewId(null);
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  // ===== XỬ LÝ THÊM / SỬA / XÓA =====
  const handleReviewUpdate = (data) => {
    const { review } = data;
    if (!review) {
      loadAll();
      return;
    }

    setReviews((prev) => {
      const exists = prev.some((r) => r.reviewId === review.reviewId);
      return exists
        ? prev.map((r) => (r.reviewId === review.reviewId ? review : r))
        : [review, ...prev];
    });

    if (isEditingReviewId) setIsEditingReviewId(null);
    loadProduct();
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Xóa đánh giá này?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
      loadProduct();
      alert("Xóa thành công!");
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi xóa");
    }
  };

  if (!product) {
    return <div style={{ padding: 50, textAlign: "center" }}>Đang tải...</div>;
  }

  return (
    <div
      style={{
        padding: "40px 5%",
        background: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* ===== THÔNG TIN SẢN PHẨM ===== */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          background: "#fff",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          marginBottom: 40,
        }}
      >
        <div style={{ flex: "1 1 400px", textAlign: "center" }}>
          <img
            src={
              product.images?.[0]
                ? getImageUrl(product.images[0])
                : "https://via.placeholder.com/400"
            }
            alt={product.name}
            style={{ maxWidth: "100%", height: "auto", borderRadius: 12 }}
          />
        </div>
        <div style={{ flex: "1 1 400px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>
            {product.name}
          </h1>
          <p style={{ color: "#555", lineHeight: "1.6" }}>
            {product.description}
          </p>
          <div
            style={{
              marginTop: 20,
              fontSize: 18,
              background: "#f3f4f6",
              padding: "12px 16px",
              borderRadius: 8,
              display: "inline-block",
            }}
          >
            Giá:{" "}
            <strong style={{ color: "#d32f2f" }}>
              {product.price?.toLocaleString("vi-VN")} ₫
            </strong>
          </div>
          <div style={{ marginTop: 10 }}>
            Đánh giá:{" "}
            <strong>
              {product.meta?.avgRating
                ? `${product.meta.avgRating.toFixed(1)} / 5`
                : "Chưa có"}
            </strong>{" "}
            ({product.meta?.totalReviews || 0} lượt)
          </div>
        </div>
      </div>

      {/* ===== DANH SÁCH ĐÁNH GIÁ ===== */}
      <section
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
          marginBottom: 40,
        }}
      >
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            borderBottom: "2px solid #007bff",
            display: "inline-block",
            marginBottom: 20,
            paddingBottom: 4,
          }}
        >
          Đánh giá sản phẩm
        </h2>

        {reviews.length === 0 ? (
          <p style={{ color: "#777" }}>Chưa có đánh giá nào.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviews.map((rv) => (
              <div
                key={rv.reviewId}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 16,
                  background: "#fdfdfd",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#007bff",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "1.1em",
                      flexShrink: 0,
                    }}
                  >
                    {rv.userName?.[0]?.toUpperCase() || "?"}
                  </div>

                  {/* Tên + Rating */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "1.05em",
                        color: "#333",
                        marginBottom: 4,
                      }}
                    >
                      {rv.userName || "Người dùng ẩn"}{" "}
                      <span style={{ color: "#f39c12" }}>
                        {"⭐".repeat(rv.rating)}
                      </span>
                    </div>
                    <div
                      style={{
                        color: "#555",
                        background: "#f8f9fa",
                        borderRadius: 8,
                        padding: "8px 12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {rv.comment}
                    </div>
                  </div>

                  {/* Nút Sửa / Xóa */}
                  {isAuthenticated && user?._key === rv.userId && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <button
                        onClick={() => setIsEditingReviewId(rv.reviewId)}
                        style={{
                          padding: "6px 8px",
                          background: "#ffc107",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(rv.reviewId)}
                        style={{
                          padding: "6px 8px",
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          cursor: "pointer",
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                {/* FORM CHỈNH SỬA */}
                {isEditingReviewId === rv.reviewId && (
                  <div
                    style={{
                      marginTop: 15,
                      paddingTop: 10,
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <ReviewForm
                      productId={id}
                      initialReview={rv}
                      onAdded={handleReviewUpdate}
                      onCancelEdit={() => setIsEditingReviewId(null)}
                    />
                  </div>
                )}

                {/* ẢNH REVIEW */}
                {rv.images?.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginTop: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {rv.images.map((img, i) => (
                      <img
                        key={i}
                        src={getImageUrl(img)}
                        alt="review"
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 10,
                          objectFit: "cover",
                          border: "1px solid #ddd",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== FORM TẠO MỚI ===== */}
      <section
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>Viết đánh giá</h3>
        {!isEditingReviewId ? (
          <ReviewForm productId={id} onAdded={handleReviewUpdate} />
        ) : (
          <p style={{ color: "#007bff" }}>Đang chỉnh sửa. Hủy để thêm mới.</p>
        )}
      </section>
    </div>
  );
}
