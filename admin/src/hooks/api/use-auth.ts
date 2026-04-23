import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const ADMIN_TOKEN_KEY = "admin_session_token";
const ADMIN_USER_KEY = "admin_session_user";

export const useSignInWithEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await authClient.signIn.email(data);

      // Check for error in response
      if ((res as any)?.error) {
        throw new Error((res as any).error.message || "Login failed");
      }

      const resData = (res as any)?.data;
      let token = resData?.session?.token || resData?.token || (res as any)?.token;
      let user = resData?.user || (res as any)?.user;

      // Always fetch fresh session to get token + user reliably
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user) {
          user = session.user;
          if (session.session?.token) token = session.session.token;
        }
      } catch {}

      if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
      if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));

      return res;
    },
    onSuccess: () => {
      toast.message("Login successful");
      // Small delay to ensure session cookie is set before navigation
      setTimeout(() => { window.location.href = "/admin/dashboard"; }, 300);
    },
    onError: (error: any) => {
      const msg = error?.message || error?.response?.data?.message || "Login failed. Check your email and password.";
      toast.error(msg);
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
