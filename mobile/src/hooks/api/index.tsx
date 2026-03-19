// src/lib/api.ts
import axios from "axios";

// export const SERVER_BASE_URL = "https://solomongetnet.pro.et/api/v1";
export const SERVER_BASE_URL =
  "https://03105309961186fbccef4ea0c645d009.serveo.net/api/v1";

// Create an Axios instance
const api = axios.create({
  baseURL: SERVER_BASE_URL,
  timeout: 15_000, // optional: 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
  fetchOptions: { credentials: "include" },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle global errors
    return Promise.reject(error);
  }
);

export default api;
