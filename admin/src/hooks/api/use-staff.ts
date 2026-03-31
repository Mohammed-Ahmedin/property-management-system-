import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { UserRoleType } from "@/types";
import { SuccessResponse } from "./types/index";
import { toast } from "sonner";
import { useAuthSession } from "../use-auth-session";

export const useAddStaffToGHMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      propertyId: string;
      email: string;
      name: string;
      phone: string;
      password: string;
    }) => {
      const response = await api.post<SuccessResponse>("/properties/staff/add-staff", data);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["staffs", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["staffs-for-list"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

interface GetGHStaffsResponse {
  name: string;
  id: string;
  email: string;
  image: string;
  role: UserRoleType;
}

export const useGetGhStaffsQuery = ({ propertyId }: { propertyId: string }) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<GetGHStaffsResponse[]>({
    queryKey: ["staffs", propertyId],
    enabled: isAuthenticated && !!propertyId,
    retry: false,
    queryFn: async () => {
      const response = await api.get<GetGHStaffsResponse[]>(`/properties/staff/get-staffs/${propertyId}`);
      return response.data;
    },
  });
};

interface GetStaffForListResponse {
  name: string;
  id: string;
  email: string;
  image: string;
  role: UserRoleType;
}

export const useGetStaffsForListQuery = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<GetStaffForListResponse[]>({
    queryKey: ["staffs-for-list"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<GetStaffForListResponse[]>("/properties/staff/for-list");
      return response.data;
    },
  });
};

export const useRemoveStaffFromGHMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { userId: string; propertyId: string }) => {
      const response = await api.post<SuccessResponse>("/properties/staff/remove-staff", data);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["staffs", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["staffs-for-list"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
};

export const useAddBrokerToPropertyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { propertyId: string; email: string; name?: string }) => {
      const response = await api.post<SuccessResponse>("/properties/staff/add-broker", data);
      return response.data;
    },
    onSuccess: ({ message }, { propertyId }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["staffs", propertyId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};
