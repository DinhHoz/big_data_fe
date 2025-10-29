// src/components/ReviewForm.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReviewForm({ productId, onAdded, initialReview, onCancelEdit }) {
  // Nếu có initialReview (chế độ chỉnh sửa) thì dùng giá trị cũ
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]); // File list for new uploads
  // Lưu URL ảnh cũ để hiển thị trong chế độ chỉnh sửa (nếu có)
  const [existingImageUrls] = useState(initialReview?.images?.map(path => {
    if (path.startsWith("http")) return path;
    const BASE_URL = "http://localhost:4000";
    return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
  }) || []);
  const [previewUrls, setPreviewUrls] = useState([]); // URLs for new uploads

  const { isAuthenticated, user } = useAuth();
  
  // Xác định chế độ: Chỉnh sửa (true) hay Tạo mới (false)
  const isEditMode = !!initialReview;

  // ======= Xử lý chọn ảnh =======
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    if (files.length + existingImageUrls.length > 5) {
      alert(`Tổng cộng tối đa 5 ảnh (đã có ${existingImageUrls.length} ảnh cũ). Bạn chỉ được chọn thêm tối đa ${5 - existingImageUrls.length} ảnh.`);
      e.target.value = null; // Xóa file đã chọn
      return;
    }
    setImages(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  }

  // ======= Gửi đánh giá / Chỉnh sửa =======
async function submit() {
  // ... (kiểm tra auth và comment giữ nguyên)

  setIsSubmitting(true);
  try {
    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);

    // Thêm productId khi tạo mới (Giữ nguyên)
    if (!isEditMode) {
      formData.append('productId', productId);
    }
    
    // 👇 THÊM: Xử lý mảng ảnh cũ khi CHỈNH SỬA (Quan trọng!)
    if (isEditMode) {
        // Backend (review.js) kỳ vọng trường 'existingImages' dưới dạng chuỗi JSON
        // chứa các đường dẫn ảnh cũ muốn giữ lại.
        // existingImageUrls là mảng các URL hoàn chỉnh, cần chuyển đổi về path tương đối
        const BASE_URL = "http://localhost:4000";
        const relativePathsToKeep = existingImageUrls.map(url => 
            url.startsWith(BASE_URL) ? url.substring(BASE_URL.length) : url
        );
        formData.append('existingImages', JSON.stringify(relativePathsToKeep)); // Gửi mảng ảnh cũ dưới dạng JSON string
    }

    // Thêm ảnh mới (cả tạo mới và chỉnh sửa) (Giữ nguyên)
    images.forEach(file => formData.append('images', file));
      // Lựa chọn endpoint và method
      const url = isEditMode ? `/reviews/${initialReview.reviewId}` : '/reviews';
      const method = isEditMode ? 'put' : 'post'; // API cần hỗ trợ PUT/PATCH cho chỉnh sửa

      const res = await api[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Xóa dữ liệu form (chỉ khi tạo mới)
      if (!isEditMode) {
        setComment('');
        setRating(5);
        setImages([]);
        setPreviewUrls([]);
      }

      alert(`🎉 Đánh giá của bạn đã được ${isEditMode ? 'cập nhật' : 'gửi'} thành công!`);
      onAdded && onAdded(res.data);
    } catch (err) {
      console.error('❌ Lỗi gửi/cập nhật review:', err.response || err);
      alert(err.response?.data?.error || `Lỗi ${isEditMode ? 'cập nhật' : 'gửi'} đánh giá, vui lòng thử lại.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          marginTop: 8,
          padding: 15,
          border: '1px dashed orange',
          textAlign: 'center',
        }}
      >
        <p>
          ⚠️ Bạn cần <a href="/login">đăng nhập</a> để gửi đánh giá sản phẩm này.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 8,
        padding: 15,
        border: '1px solid #ccc',
        borderRadius: 5,
        backgroundColor: isEditMode ? '#fff3cd' : '#fff', // Màu nền khác khi chỉnh sửa
      }}
    >
      <h3>{isEditMode ? `Chỉnh sửa đánh giá của bạn (ID: ${initialReview.reviewId})` : `Viết đánh giá của bạn`} (Đăng nhập là: {user?.name})</h3>

      {/* Rating */}
      <div>
        <label>Đánh giá sao: </label>
        <select
          value={rating}
          onChange={(e) => setRating(+e.target.value)}
          disabled={isSubmitting}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} sao
            </option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div style={{ marginTop: 10 }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          cols={60}
          placeholder="Viết nhận xét chi tiết..."
          disabled={isSubmitting}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      {/* Upload ảnh */}
      <div style={{ marginTop: 10 }}>
        <label>Ảnh minh họa (tối đa 5 ảnh, **chỉ chọn thêm ảnh mới**): </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={isSubmitting}
          // Reset input file sau khi chọn
          key={images.length} 
        />
        {isEditMode && <p style={{fontSize: 12, color: '#666'}}>* Ảnh cũ sẽ được giữ lại. Nếu muốn xóa ảnh cũ, bạn cần thao tác trên backend hoặc thiết kế thêm giao diện.</p>}
      </div>

      {/* Preview ảnh (Ảnh cũ + Ảnh mới) */}
      {(existingImageUrls.length > 0 || previewUrls.length > 0) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {/* Ảnh cũ */}
            {existingImageUrls.map((src, i) => (
                <div
                    key={`old-${i}`}
                    style={{
                        width: 80,
                        height: 80,
                        border: '1px solid #007bff', // Dễ phân biệt
                        borderRadius: 5,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <img
                        src={src}
                        alt={`old-preview-${i}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,123,255,0.7)', color: 'white', fontSize: 10, padding: '2px 4px', borderRadius: '0 0 0 5px' }}>Cũ</span>
                </div>
            ))}
            {/* Ảnh mới */}
          {previewUrls.map((src, i) => (
            <div
              key={`new-${i}`}
              style={{
                width: 80,
                height: 80,
                border: '1px solid #ccc',
                borderRadius: 5,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={src}
                alt={`new-preview-${i}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(220,53,69,0.7)', color: 'white', fontSize: 10, padding: '2px 4px', borderRadius: '0 0 0 5px' }}>Mới</span>

            </div>
          ))}
        </div>
      )}

      {/* Submit */}
      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <button
          onClick={submit}
          disabled={isSubmitting || !comment.trim()}
          style={{
            padding: '8px 15px',
            backgroundColor: isEditMode ? '#28a745' : '#007bff', // Màu xanh lá cho Edit
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {isSubmitting ? `Đang ${isEditMode ? 'cập nhật' : 'gửi'}...` : (isEditMode ? 'Cập Nhật Đánh Giá' : 'Gửi Đánh Giá')}
        </button>

        {/* Nút Hủy (chỉ hiện khi đang chỉnh sửa) */}
        {isEditMode && (
            <button
                onClick={onCancelEdit}
                disabled={isSubmitting}
                style={{
                    padding: '8px 15px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                }}
            >
                Hủy
            </button>
        )}
      </div>
    </div>
  );
}