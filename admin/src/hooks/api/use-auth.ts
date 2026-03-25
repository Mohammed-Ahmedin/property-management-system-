import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      name: string;
      role: string;
    }) => {
      return authClient.signUp.email(data, {
        onSuccess: () => {
          router.push("/admin/dashboard");
          toast.message("Account created successfull");
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      });
    },
  });
};
