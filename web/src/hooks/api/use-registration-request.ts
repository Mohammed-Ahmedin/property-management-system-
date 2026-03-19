import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";

interface RegistrationRequest {
  companyName: string;
  companyDescription: string;
  businessFileUrl: any;
  contactName: string;
  email: string;
  password: string;
  phone: any;
  // nationalId: string;
}

export const useRegisterRequestMutation = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: RegistrationRequest }) => {
      const response = await api.post(`/registration-requests`, data);

      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.message(message);
    },
    onError: (error: any) => {
      const errMsg =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(errMsg);
    },
  });
};
