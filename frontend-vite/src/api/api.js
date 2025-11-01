import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:5000/api", // Use HTTPS
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: Handle expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
