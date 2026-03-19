import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Storage_keys } from "@/utils/storage";

export interface User {
  id: string;
  emailVerified: boolean;
  email: string;
  name: string;
  image: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

type AuthStatus = "loading" | "fetching" | "error" | "success";

export interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem(Storage_keys.AUTH_TOKEN) || null,
  status: "loading",
  user: null,
  isAuthenticated: !!localStorage.getItem(Storage_keys.AUTH_TOKEN),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{ user: User; token?: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      if (token) {
        state.token = token;
        localStorage.setItem(Storage_keys.AUTH_TOKEN, token);
      }
      state.isAuthenticated = true;
      state.status = "success";
    },

    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.status = "success";
      localStorage.removeItem(Storage_keys.AUTH_TOKEN);
    },

    updateUser: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.status = "success";
      localStorage.removeItem(Storage_keys.AUTH_TOKEN);
    },

    setUserToken: (state, action: PayloadAction<{ token: string }>) => {
      const { token } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem(Storage_keys.AUTH_TOKEN, token);
    },

    clearUserToken: (state, _action: PayloadAction<null | undefined>) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(Storage_keys.AUTH_TOKEN);
    },

    setStatus: (
      state,
      action: PayloadAction<{ status: AuthState["status"] }>
    ) => {
      state.status = action.payload.status;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  setUserToken,
  clearUserToken,
  setStatus,
} = authSlice.actions;

export default authSlice;
