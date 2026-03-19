// lib/axios.ts
import axios from "axios";
const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export const api = axios.create({
  baseURL: `${SERVER_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status !== 401 && status !== 403) {
      console.error("API error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);
