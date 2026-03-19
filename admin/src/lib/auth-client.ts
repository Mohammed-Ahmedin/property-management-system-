import { createAuthClient } from "better-auth/react";

export type UserRole = "GUEST" | "OWNER" | "STAFF" | "ADMIN" | "BROKER";

export interface UserAdditionalFields {
  role: UserRole;
}

const SERVER_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export const authClient = createAuthClient({
  baseURL: SERVER_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
});
