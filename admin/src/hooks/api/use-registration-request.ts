import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";
import { useAuthSession } from "../use-auth-session";

interface RegistrationRequest {
  companyName: string;
  companyDescription: string;
  businessFileUrl: any;
  contactName: string;
  email: string;
  password: string;
  phone: any;
}

export const useRegisterRequestMutation = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: RegistrationRequest }) => {
      const response = await api.post(`/registration-requests`, data);
      return response.data;
    },
    onSuccess: ({ message }) => { toast.message(message); },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

export const useUpdateRegisterationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: any }) => {
      const response = await api.post(`/registration-requests/management/${id}/status`, { newStatus });
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

export const useGetRegistrationRequestsQuery = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<RegistrationRequest[]>({
    queryKey: ["requests"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<RegistrationRequest[]>(`/registration-requests/management`);
      return response.data;
    },
  });
};

export const useGetRegistrationRequestStatusQuery = (encryptedId: any) => {
  return useQuery<{ status: any }>({
    queryKey: ["request_status", encryptedId],
    enabled: !!encryptedId,
    retry: false,
    queryFn: async () => {
      const response = await api.get<{ status: any }>(`/registration-requests/status/${encryptedId}`);
      return response.data;
    },
  });
};

export const useGetRegistrationRequestsStatsQuery = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<{ total: number; pending: number; approved: number; rejected: number }>({
    queryKey: ["requests_stats"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<{ total: number; pending: number; approved: number; rejected: number }>(
        `/registration-requests/management/stats`
      );
      return response.data;
    },
  });
};
