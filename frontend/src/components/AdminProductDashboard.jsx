// src/pages/AdminProductDashboard.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
// Giả định bạn có một hook/service để gọi API sản phẩm
// import { useProducts } from '../hooks/useProducts'; 

// --- Component Giả Định (Mock) cho Form Thêm/Cập Nhật ---
const ProductForm = ({ product = null, onClose }) => {
    const [name, setName] = useState(product ? product.name : '');
    const [price, setPrice] = useState(product ? product.price : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = { name, price: parseFloat(price) };
        
        if (product) {
            console.log("Cập nhật sản phẩm:", product.id, productData);
            // ⚠️ THỰC TẾ: Gọi API PUT/PATCH để cập nhật
        } else {
            console.log("Thêm sản phẩm mới:", productData);
            // ⚠️ THỰC TẾ: Gọi API POST để thêm sản phẩm
        }
        onClose();
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
            <h3>{product ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Tên sản phẩm" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Giá" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    required 
                />
                <button type="submit">{product ? 'Cập Nhật' : 'Thêm Sản Phẩm'}</button>
                <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>Hủy</button>
            </form>
        </div>
    );
};

// --- Component Giả Định (Mock) cho Danh Sách Reviews ---
const ReviewItem = ({ review }) => {
    const [reply, setReply] = useState('');
    
    const handleReply = () => {
        if (!reply.trim()) return;
        console.log(`Phản hồi cho Review ID ${review.id}: ${reply}`);
        // ⚠️ THỰC TẾ: Gọi API POST để gửi phản hồi
        setReply('');
    };

    return (
        <div style={{ border: '1px dotted #ddd', padding: '10px', margin: '5px 0' }}>
            <p><strong>User:</strong> {review.user} | <strong>Rating:</strong> {review.rating} ⭐</p>
            <p>{review.comment}</p>
            <div style={{ marginTop: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Viết phản hồi của bạn..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    style={{ width: '70%', marginRight: '10px' }}
                />
                <button onClick={handleReply}>Gửi Phản Hồi</button>
            </div>
            {review.adminReply && <p style={{ color: 'blue' }}>**Đã phản hồi:** {review.adminReply}</p>}
        </div>
    );
};


// --- Component Dashboard Chính ---
const AdminProductDashboard = () => {
    const { user, isAdmin } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // ⚠️ Giả định dữ liệu sản phẩm và reviews (thực tế sẽ fetch từ API)
    const [products, setProducts] = useState([
        { id: 1, name: 'Laptop Gaming X1', price: 1200, reviews: [{id: 101, user: 'A', rating: 5, comment: 'Sản phẩm tuyệt vời!'}] },
        { id: 2, name: 'Màn Hình UltraWide', price: 450, reviews: [{id: 102, user: 'B', rating: 3, comment: 'Giá hơi cao'}, {id: 103, user: 'C', rating: 5, comment: 'Đã phản hồi tốt.', adminReply: 'Cảm ơn bạn đã phản hồi!'}] },
    ]);

    if (!isAdmin) {
        return <h2>❌ Truy Cập Bị Từ Chối</h2>;
    }

    const handleDelete = (productId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${productId}?`)) {
            console.log("Xóa sản phẩm ID:", productId);
            // ⚠️ THỰC TẾ: Gọi API DELETE
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    return (
        <div>
            <h1>⚙️ Bảng Điều Khiển Quản Trị Sản Phẩm</h1>
            <p>Chào mừng, **{user?.email}** ({user?.role})</p>

            {/* --- 1. Nút Thêm Sản Phẩm --- */}
            <button 
                onClick={() => { setIsAdding(true); setEditingProduct(null); }}
                style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: 'green', color: 'white' }}
            >
                ➕ Thêm Sản Phẩm Mới
            </button>

            {(isAdding || editingProduct) && (
                <ProductForm 
                    product={editingProduct} 
                    onClose={() => { setIsAdding(false); setEditingProduct(null); }}
                />
            )}

            <h2>📦 Danh Sách Sản Phẩm</h2>
            {products.map((product) => (
                <div key={product.id} style={{ border: '2px solid #333', padding: '15px', marginBottom: '15px' }}>
                    
                    {/* --- Thông tin Sản phẩm và Nút Cập Nhật/Xóa --- */}
                    <h3>{product.name} (ID: {product.id})</h3>
                    <p>Giá: ${product.price}</p>
                    <div>
                        <button 
                            onClick={() => { setEditingProduct(product); setIsAdding(false); }}
                            style={{ backgroundColor: 'orange', color: 'white', marginRight: '10px' }}
                        >
                            ✏️ Cập Nhật
                        </button>
                        <button 
                            onClick={() => handleDelete(product.id)}
                            style={{ backgroundColor: 'red', color: 'white' }}
                        >
                            🗑️ Xóa
                        </button>
                    </div>

                    <hr style={{ margin: '15px 0' }} />

                    {/* --- 4. Phản Hồi Review --- */}
                    <h4>💬 Reviews ({product.reviews.length})</h4>
                    {product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                        ))
                    ) : (
                        <p>Chưa có reviews nào.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AdminProductDashboard;