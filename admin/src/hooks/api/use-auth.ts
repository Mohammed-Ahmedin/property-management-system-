import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const ADMIN_TOKEN_KEY = "admin_session_token";
const ADMIN_USER_KEY = "admin_session_user";

export const useSignInWithEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await authClient.signIn.email(data);
      const resData = (res as any)?.data;
      const token = resData?.session?.token || resData?.token || (res as any)?.token;
      const user = resData?.user || (res as any)?.user;
      if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
      if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      return res;
    },
    onSuccess: () => {
      toast.message("Login successful");
      window.location.href = "/admin/dashboard";
    },
    onError: ({ message }: any) => {
      toast.error(message || "Login failed");
    },
  });
};

export const useSignUpWithEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
      role: string;
    }) => {
      const res = await authClient.signUp.email(data);
      const resData = (res as any)?.data;
      const token = resData?.session?.token || resData?.token;
      const user = resData?.user;
      if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
      if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      return res;
    },
    onSuccess: () => {
      toast.message("Account created successfully");
      window.location.href = "/admin/dashboard";
    },
    onError: ({ message }: any) => {
      toast.error(message || "Signup failed");
    },
  });
};
