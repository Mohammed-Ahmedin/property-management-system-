import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const ADMIN_TOKEN_KEY = "admin_session_token";

export const useSignInWithEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await authClient.signIn.email(data);
      if ((res as any)?.data?.session?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, (res as any).data.session.token);
      } else if ((res as any)?.data?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, (res as any).data.token);
      }
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
      if ((res as any)?.data?.session?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, (res as any).data.session.token);
      } else if ((res as any)?.data?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, (res as any).data.token);
      }
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
