import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { SuccessResponse } from "./types/index";
import { toast } from "sonner";
import { Payment } from "@/types/payments.type";
import { useAuthSession } from "../use-auth-session";

export const useCreateSubAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      bankCode: number;
      accountNumber: string;
      accountName: string;
      businessName?: string;
    }) => {
      const response = await api.post<SuccessResponse>(
        "/payments/subaccount",
        data
      );

      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["subaccount"] });
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

interface SubAccountResponse {
  type: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  businessName: string | null;
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  chapaSubId: string;
  splitType: string;
  splitValue: number;
  balance: number;
  ownerId: string;
}

export const useGetSubaccountDetail = (enabled = true) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<SubAccountResponse>({
    queryFn: async () => {
      const response = await api.get<SubAccountResponse>(
        "/payments/subaccount"
      );

      return response.data;
    },
    queryKey: ["subaccount"],
    enabled: isAuthenticated && enabled,
    retry: false,
  });
};

export const useGetSubaccounts = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<SubAccountResponse[]>({
    queryFn: async () => {
      const response = await api.get<SubAccountResponse[]>("/payments/subaccount/get-all");
      return response.data;
    },
    queryKey: ["subaccounts_all"],
    enabled: isAuthenticated,
    retry: false,
  });
};

export const useGetPayments = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<Payment[]>({
    queryFn: async () => {
      const response = await api.get<Payment[]>("/payments");
      return response.data;
    },
    queryKey: ["payments"],
    enabled: isAuthenticated,
    retry: false,
  });
};

export const useGetPaymentsStats = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<any>({
    queryFn: async () => {
      const response = await api.get<any>("/payments/stats");
      return response.data;
    },
    queryKey: ["payments_stats"],
    enabled: isAuthenticated,
    retry: false,
  });
};
