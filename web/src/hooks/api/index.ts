// lib/axios.ts
import axios from "axios";
const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const api = axios.create({
  baseURL: `${SERVER_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 20_000,
});

// Attach Bearer token from localStorage on every request (needed on mobile where cookies aren't sent)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
