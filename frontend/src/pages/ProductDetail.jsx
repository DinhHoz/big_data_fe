import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ReviewForm from "../components/ReviewForm";
import RecommendationList from "../components/RecommendationList";
import { useAuth } from "../context/AuthContext"; // Import useAuth

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEditingReviewId, setIsEditingReviewId] = useState(null); // State để theo dõi review đang chỉnh sửa
  const { user, isAuthenticated } = useAuth(); // Lấy thông tin user

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const BASE_URL = "http://localhost:4000";
    return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  };

  // ⭐️ Hàm chỉ tải chi tiết sản phẩm (dùng để cập nhật meta data)
  async function loadProductMeta() {
    try {
      const p = await api.get(`/products/${id}`);
      setProduct(p.data);
    } catch (err) {
      console.error("❌ Lỗi tải chi tiết sản phẩm:", err);
    }
  }

  // ⭐️ Hàm chỉ tải danh sách đánh giá
  async function loadReviews() {
    try {
      const r = await api.get(`/reviews/product/${id}`);
      setReviews(r.data.reviews || []);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách đánh giá:", err);
    }
  }

  // Hàm load ban đầu (tải cả 2)
  async function load() {
    try {
      // Tải chi tiết sản phẩm VÀ danh sách đánh giá song song
      await Promise.all([loadProductMeta(), loadReviews()]);
      setIsEditingReviewId(null); // Đặt lại trạng thái chỉnh sửa sau khi tải lại toàn bộ
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu:", err);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  // Hàm xử lý cập nhật state reviews sau khi POST/PUT thành công
  function handleReviewUpdate(newReviewData) {
    // res.data có cấu trúc { message, review }
    const { review, message } = newReviewData;

    // Fallback: nếu backend không trả về review object, phải tải lại toàn bộ
    if (!review) {
      console.warn("API không trả về đối tượng review đầy đủ, đang tải lại toàn bộ...");
      load();
      return;
    }

    // ⭐ CẬP NHẬT STATE REVIEWS TỐI ƯU (KHÔNG GỌI API) ⭐
    setReviews(prevReviews => {
      // Kiểm tra xem đây là thao tác TẠO MỚI (POST) hay CẬP NHẬT (PUT)
      // Dùng message từ backend để phân biệt
      const isNew = message.includes("gửi thành công") || !prevReviews.some(r => r.reviewId === review.reviewId);
      
      if (isNew) {
        // THAO TÁC POST: Thêm review mới lên đầu danh sách
        return [review, ...prevReviews];
      } else {
        // THAO TÁC PUT: Thay thế review cũ bằng review mới
        return prevReviews.map(r =>
          r.reviewId === review.reviewId ? review : r
        );
      }
    });

    // Tắt chế độ chỉnh sửa sau khi cập nhật thành công (chỉ áp dụng cho PUT)
    if (isEditingReviewId) {
      setIsEditingReviewId(null);
    }

    // ⭐ CHỈ Tải lại meta data để cập nhật avgRating/totalReviews (Tối ưu)
    loadProductMeta();
  }

  // Hàm xử lý xóa đánh giá
  async function handleDelete(reviewId) {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      alert("✅ Xóa đánh giá thành công!");
      
      // ⭐ Cập nhật state Reviews và Meta sau khi xóa thành công (Tối ưu)
      setReviews(prevReviews => prevReviews.filter(r => r.reviewId !== reviewId));
      loadProductMeta(); // Chỉ tải lại Product Meta để cập nhật avgRating/totalReviews
      
    } catch (err) {
      console.error("❌ Lỗi xóa review:", err.response || err);
      alert(err.response?.data?.error || 'Lỗi xóa đánh giá, vui lòng thử lại.');
    }
  }

  if (!product)
    return (
      <div
        style={{
          padding: 50,
          textAlign: "center",
          fontSize: 18,
          color: "#555",
        }}
      >
        🔄 Đang tải dữ liệu sản phẩm...
      </div>
    );

  const reviewToEdit = reviews.find(rv => rv.reviewId === isEditingReviewId);

  return (
    <div
      style={{
        padding: "40px 5%",
        background: "#f8f9fa",
        minHeight: "100vh",
        animation: "fadeIn 0.6s ease",
      }}
    >
      {/* ... Phần hiển thị thông tin sản phẩm (Giữ nguyên) ... */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: 30,
          marginBottom: 40,
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-4px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        {/* Ảnh sản phẩm */}
        <div
          style={{
            flex: "1 1 400px",
            textAlign: "center",
            background: "#fafafa",
            borderRadius: 12,
            padding: 20,
            overflow: "hidden",
          }}
        >
          <img
            src={
              product.images && product.images.length > 0
                ? getImageUrl(product.images[0])
                : "https://via.placeholder.com/400x400?text=No+Image"
            }
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: 400,
              height: "auto",
              objectFit: "contain",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ flex: "1 1 400px", paddingTop: 20 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 10,
              color: "#222",
            }}
          >
            {product.name}
          </h1>

          <p style={{ fontSize: 16, color: "#555", lineHeight: "1.6em" }}>
            {product.description}
          </p>

          <div
            style={{
              marginTop: 20,
              fontSize: 18,
              background: "#f3f4f6",
              borderRadius: 8,
              padding: "12px 16px",
              display: "inline-block",
            }}
          >
            💰 <b>Giá:</b>{" "}
            <span style={{ color: "#d32f2f" }}>
              {product.price?.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          <div style={{ marginTop: 10, fontSize: 16 }}>
            ⭐ <b>Đánh giá trung bình:</b>{" "}
            {product.meta?.avgRating
              ? `${product.meta.avgRating.toFixed(1)} / 5`
              : "Chưa có"}
          </div>
        </div>
      </div>
      {/* ... Hết phần hiển thị thông tin sản phẩm ... */}


      {/* Danh sách đánh giá */}
      <section
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
          marginBottom: 40,
        }}
      >
        <h2 style={{ fontSize: 22, marginBottom: 20, color: "#333" }}>
          💬 Đánh giá sản phẩm
        </h2>

        {reviews.length === 0 ? (
          <div style={{ color: "#777", fontSize: 15 }}>
            Chưa có đánh giá nào.
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              animation: "fadeIn 0.5s ease",
            }}
          >
            {reviews.map((rv) => (
              <div
                key={rv.reviewId || rv._key}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 10,
                  padding: 16,
                  background: "#fafafa",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.01)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#007bff",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    {rv.userName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: "bold", color: "#333" }}>
                      {rv.userName || "Người dùng ẩn"} — ⭐ {rv.rating}
                    </div>
                    <div style={{ color: "#666", fontSize: 14 }}>
                      {rv.comment}
                    </div>
                  </div>

                  {/* Nút Chỉnh sửa/Xóa */}
                  {isAuthenticated && user?.id === rv.userId && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => setIsEditingReviewId(rv.reviewId)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: 'rgb(207, 205, 198)',
                          color: '#333',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(rv.reviewId)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                {/* Form chỉnh sửa hiện ra ngay bên dưới review */}
                {isEditingReviewId === rv.reviewId && (
                  <div style={{ marginTop: 15, borderTop: '1px solid #ddd', paddingTop: 10 }}>
                    <ReviewForm
                      productId={id}
                      initialReview={reviewToEdit}
                      // ⭐️ Đã SỬA: Thay load bằng handleReviewUpdate để cập nhật state reviews tức thì
                      onAdded={handleReviewUpdate} 
                      onCancelEdit={() => setIsEditingReviewId(null)}
                    />
                  </div>
                )}

                {/* Hình ảnh đánh giá */}
                {rv.images && rv.images.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    {rv.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={getImageUrl(img)}
                        alt={`review-${idx}`}
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 8,
                          objectFit: "cover",
                          border: "1px solid #ccc",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/100?text=No+Image")
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Form đánh giá (Tạo mới) */}
      <section
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
          marginBottom: 40,
        }}
      >
        <h3 style={{ fontSize: 20, marginBottom: 16 }}>✍️ Viết đánh giá của bạn</h3>
        <div
          style={{
            animation: "slideUp 0.6s ease",
            borderTop: "1px solid #eee",
            paddingTop: 16,
          }}
        >
          {/* Chỉ hiện form tạo mới nếu KHÔNG CÓ review nào đang được chỉnh sửa */}
          {!isEditingReviewId && <ReviewForm productId={id} onAdded={handleReviewUpdate} />}
          {isEditingReviewId && (
            <p style={{ color: '#007bff' }}>
              Bạn đang chỉnh sửa đánh giá. Hoàn tất hoặc Hủy bỏ để thêm đánh giá mới.
            </p>
          )}
        </div>
      </section>

      {/* Sản phẩm đề xuất */}
      {/* <RecommendationList userId={"user1"} /> */}
    </div>
  );
}

/* ✨ Animation CSS */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);