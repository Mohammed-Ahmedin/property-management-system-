import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";
import { useAuthSession } from "../use-auth-session";

export const useAddPlatformCommision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await api.post(`/commision-settings/platform`, data);
      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["commisionSettings"] });
      toast.message(message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

export const useUpdateCommission = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/commision-settings/${id}`, data);
      return response.data;
    },
    onSuccess: ({ message }) => { toast.message(message); },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

export const useAddPropertyCommision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await api.post(`/commision-settings/property`, data);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["commisionSettings"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

interface CommisionSetting {
  id: string;
  propertyId: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: any;
  platformPercent: number;
  description: string;
  brokerPercent: number | null;
  isActive: boolean;
}

export const useGetCommisionSettings = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<CommisionSetting[]>({
    queryKey: ["commisionSettings"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<CommisionSetting[]>(`/commision-settings`);
      return response.data;
    },
  });
};
