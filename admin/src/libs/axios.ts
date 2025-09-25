import axios from "axios";

// Tạo một instance
const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api", // Laravel API
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosClient;
