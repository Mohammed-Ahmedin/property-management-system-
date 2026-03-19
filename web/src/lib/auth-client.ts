import { createAuthClient } from "better-auth/react";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export const authClient = createAuthClient({
  baseURL: SERVER_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});
