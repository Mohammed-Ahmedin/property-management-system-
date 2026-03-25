import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignInWithEmailMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return authClient.signIn.email(data, {
        onSuccess: () => {
          toast.message("Login successful");
          window.location.href = "/admin/dashboard";
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      });
    },
  });
};

export const useSignUpWithEmailMutation = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      name: string;
      role: string;
    }) => {
      return authClient.signUp.email(data, {
        onSuccess: () => {
          toast.message("Account created successfully");
          window.location.href = "/admin/dashboard";
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      });
    },
  });
};
