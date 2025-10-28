import axios from "axios";

// 1. Tạo một instance Axios
const apiClient = axios.create({
  // Thay thế bằng URL Backend của bạn (đọc từ .env nếu cần)
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Thêm Interceptor cho Request
// Interceptor này sẽ chạy trước MỌI yêu cầu đi ra.
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ LocalStorage hoặc nơi bạn lưu trữ
    const token = localStorage.getItem("jwtToken");

    // Nếu có token, đính kèm vào header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
