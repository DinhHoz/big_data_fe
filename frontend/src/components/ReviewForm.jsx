import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReviewForm({ productId, onAdded, initialReview, onCancelEdit }) {
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [comment, setComment] = useState(initialReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImageUrls] = useState(
    initialReview?.images?.map(path => {
      const BASE_URL = "http://localhost:4000";
      if (path.startsWith("http")) return path;
      return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
    }) || []
  );
  const [previewUrls, setPreviewUrls] = useState([]);

  const { isAuthenticated, user } = useAuth();
  const isEditMode = !!initialReview;

  const displayUserName = isEditMode
    ? initialReview.userName || user?.name || "Bạn"
    : user?.name || "Bạn";

  // ======= Xử lý chọn ảnh =======
  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    const totalImages = files.length + existingImageUrls.length;
    if (totalImages > 5) {
      alert(`Tổng cộng tối đa 5 ảnh. Bạn đã có ${existingImageUrls.length} ảnh cũ, chỉ được thêm tối đa ${5 - existingImageUrls.length} ảnh.`);
      e.target.value = null;
      return;
    }
    setImages(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  }

  // ======= Gửi / Cập nhật đánh giá =======
  async function submit() {
    if (!comment.trim()) {
      alert("Vui lòng nhập bình luận.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('comment', comment);

      if (!isEditMode) {
        formData.append('productId', productId);
      }

      if (isEditMode) {
        const BASE_URL = "http://localhost:4000";
        const relativePathsToKeep = existingImageUrls.map(url =>
          url.startsWith(BASE_URL) ? url.substring(BASE_URL.length) : url
        );
        formData.append('existingImages', JSON.stringify(relativePathsToKeep));
      }

      images.forEach(file => formData.append('images', file));

      const url = isEditMode ? `/reviews/${initialReview.reviewId}` : '/reviews';
      const method = isEditMode ? 'put' : 'post';

      const res = await api[method](url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!isEditMode) {
        setComment('');
        setRating(5);
        setImages([]);
        setPreviewUrls([]);
      }

      alert(`Đánh giá đã được ${isEditMode ? 'cập nhật' : 'gửi'} thành công!`);
      onAdded && onAdded(res.data.review || res.data);
    } catch (err) {
      console.error('Lỗi gửi/cập nhật review:', err.response || err);
      alert(err.response?.data?.error || `Lỗi ${isEditMode ? 'cập nhật' : 'gửi'} đánh giá.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        marginTop: 12,
        padding: 20,
        border: '1px dashed #ffa94d',
        textAlign: 'center',
        borderRadius: 8,
        background: '#fff8e1'
      }}>
        <p>
          Bạn cần{' '}
          <a href="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
            đăng nhập
          </a>{' '}
          để gửi đánh giá.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        maxWidth: 600,
        marginInline: 'auto'
      }}
    >
      <h3
        style={{
          marginBottom: 16,
          fontSize: '1.25em',
          color: '#333',
          borderBottom: '2px solid #007bff',
          paddingBottom: 6
        }}
      >
        {isEditMode ? ' Chỉnh sửa đánh giá' : ' Viết đánh giá của bạn'}{' '}
        <span style={{ fontSize: '0.9em', color: '#666' }}>
          – <strong>{displayUserName}</strong>
        </span>
      </h3>

      {/* Rating */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>
          Đánh giá sao:
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(+e.target.value)}
          disabled={isSubmitting}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: '1em',
            cursor: 'pointer'
          }}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{'⭐'.repeat(n)}</option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div style={{ marginBottom: 16 }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #ccc',
            fontSize: '1em',
            boxSizing: 'border-box',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Upload ảnh */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>
          Ảnh minh họa{' '}
          <span style={{ fontWeight: 'normal', color: '#888' }}>
            (tối đa 5 ảnh, còn lại {5 - existingImageUrls.length})
          </span>
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={isSubmitting}
          key={images.length + existingImageUrls.length}
          style={{
            padding: '8px',
            border: '1px dashed #aaa',
            borderRadius: 6,
            width: '100%',
            backgroundColor: '#fdfdfd',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Preview ảnh */}
      {(existingImageUrls.length > 0 || previewUrls.length > 0) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Ảnh cũ */}
          {existingImageUrls.map((src, i) => (
            <div
              key={`old-${i}`}
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
                overflow: 'hidden',
                border: '2px solid #007bff',
                position: 'relative',
              }}
            >
              <img
                src={src}
                alt={`Ảnh cũ ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.2s ease',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  background: 'rgba(0,123,255,0.85)',
                  color: 'white',
                  fontSize: '0.7em',
                  padding: '2px 6px',
                  borderRadius: '0 6px 0 0',
                }}
              >
                Cũ
              </span>
            </div>
          ))}

          {/* Ảnh mới */}
          {previewUrls.map((src, i) => (
            <div
              key={`new-${i}`}
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
                overflow: 'hidden',
                border: '2px dashed #28a745',
                position: 'relative',
              }}
            >
              <img
                src={src}
                alt={`Ảnh mới ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  background: 'rgba(40,167,69,0.9)',
                  color: 'white',
                  fontSize: '0.7em',
                  padding: '2px 6px',
                  borderRadius: '0 6px 0 0',
                }}
              >
                Mới
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Nút hành động */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={submit}
          disabled={isSubmitting || !comment.trim()}
          style={{
            flex: 1,
            padding: '10px 16px',
            backgroundColor: isEditMode ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: '1em',
            cursor: 'pointer',
            opacity: (isSubmitting || !comment.trim()) ? 0.7 : 1,
            transition: 'background 0.3s ease',
          }}
        >
          {isSubmitting
            ? `Đang ${isEditMode ? 'cập nhật' : 'gửi'}...`
            : (isEditMode ? ' Cập Nhật' : ' Gửi Đánh Giá')}
        </button>

        {isEditMode && (
          <button
            onClick={onCancelEdit}
            disabled={isSubmitting}
            style={{
              flex: 0.6,
              padding: '10px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: '1em',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
          >
            ❌ Hủy
          </button>
        )}
      </div>
    </div>
  );
}
