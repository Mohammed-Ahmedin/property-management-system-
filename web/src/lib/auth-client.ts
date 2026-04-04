import { createAuthClient } from "better-auth/react";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const authClient = createAuthClient({
  baseURL: SERVER_BASE_URL,
  fetchOptions: {
    credentials: "include",
    headers: {
      // Include stored token as fallback for mobile browsers that block cookies
      ...(typeof window !== "undefined" && localStorage.getItem("bete_token")
        ? { Authorization: `Bearer ${localStorage.getItem("bete_token")}` }
        : {}),
    },
  },
});
