import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSignInWithEmailMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => {
      return authClient.signIn.email(data, {
        onSuccess: ({ data, response }) => {
          console.log("-----------------", {
            data,
            response,
          });

          router.push("/admin/dashboard");
          toast.message("Login successfull");
        },
        onError: ({ error }) => {
          console.log("-----------------", {
            error,
          });
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
