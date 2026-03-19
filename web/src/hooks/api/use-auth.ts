import { authClient } from "@/lib/auth-client";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/slices/auth.slices";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { handleTanstackError } from "./handlers/error";

interface SignInput {
  email: string;
  password: string;
}

export const useSignInWithEmailMutation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: SignInput) => {
      const res = await authClient.signIn.email(data);

      if (res.data?.user) {
        toast.success("Login successful!", { position: "top-center" });
        dispatch(
          loginUser({ user: res.data?.user as any, token: res.data?.token })
        );
        navigate("/account");

        return res.data;
      } else if (res.error) {
        handleTanstackError({
          error: null,
          options: {
            customMessage: res.error?.message,
            skipOfflineToast: false,
          },
        });
      }
    },
    onError: (error) => {
      handleTanstackError({
        error: null,
        options: {
          customMessage: error?.message,
          skipOfflineToast: false,
        },
      });
    },
  });
};

interface SignUpInput {
  email: string;
  password: string;
  name: string;
  phone: string;
}
export const useSignUpWithEmailMutation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: SignUpInput) => {
      const res = await (authClient as any).signUp.email({
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
      });

      if (res.data?.user && res.data?.token) {
        toast.success("Login successful!", { position: "top-center" });
        dispatch(
          loginUser({ user: res.data?.user as any, token: res.data?.token })
        );
        navigate("/account");

        return res.data;
      } else if (res.error) {
        handleTanstackError({
          error: null,
          options: {
            customMessage: res.error?.message,
            skipOfflineToast: false,
          },
        });
      }
    },
    onError: (error) => {
      handleTanstackError({
        error: null,
        options: {
          customMessage: error?.message,
          skipOfflineToast: false,
        },
      });
    },
  });
};

// export const useSignUpWithEmailMutation = () => {
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: (data: {}) => {
//       return authClient.signUp.email(data, {
//         onSuccess: () => {
//           toast("Success", {
//             description: "Your account has been created successfully",
//             position: "top-center",
//           });
//           navigate("/account");
//         },
//         onError: ({ error }) => {
//           toast("Unsuccessfull", {
//             description: error.message,
//             position: "top-center",
//           });
//         },
//       });
//     },
//   });
// };
