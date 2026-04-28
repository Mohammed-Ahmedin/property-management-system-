import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { useAuthSession } from "../use-auth-session";
import { toast } from "sonner";

interface User {
  name: string;
  id: string;
  createdAt: any;
  email: string;
  emailVerified: boolean;
  image: string | null;
  phone: string | null;
  role: any;
  banned: boolean;
  banReason: string | null;
  banExpires: any | null;
}

export const useGetClientsQuery = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<any[]>({
    queryKey: ["clients"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<any[]>("/users/clients");
      return response.data;
    },
  });
};

export const useGetUsersForManagement = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<{ data: User[] }>({
    queryKey: ["users"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<{ data: User[] }>("/users/management");
      return response.data;
    },
  });
};

export interface UserStatsResponse {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  bannedUsers: number;
  usersToday: number;
  totalAdmins: number;
  totalStaffs: number;
  totalOwners: number;
  totalBrokers: number;
  totalGuests: number;
}

export const useGetUsersStats = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<UserStatsResponse>({
    queryKey: ["users_stats"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<UserStatsResponse>("/users/management/stats");
      return response.data;
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: {
      id: string;
      data: {
        name?: string; role?: string; phone?: string; image?: string;
        companyName?: string; companyDescription?: string;
        businessFileUrl?: string; nationalId?: string;
      }
    }) => {
      const response = await api.put(`/users/management/${id}`, data);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });
};

export const useGetUserRegistration = (userId: string | null) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<{ data: any }>({
    queryKey: ["user_registration", userId],
    enabled: isAuthenticated && !!userId,
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/users/management/${userId}/registration`);
      return response.data;
    },
  });
};

export const useBanUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, banReason }: { id: string; banReason?: string }) => {
      const response = await api.post(`/users/management/${id}/ban`, { banReason });
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to ban user");
    },
  });
};

export const useUnbanUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/users/management/${id}/unban`, {});
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to unban user");
    },
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/management/${id}`);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string; role: string }) => {
      const response = await api.post("/users/management", data);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users_stats"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create user");
    },
  });
};

export const useVerifyUserByEmailMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, emailVerified }: { email: string; emailVerified: boolean }) => {
      const response = await api.post("/users/management/verify-by-email", { email, emailVerified });
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update verification status");
    },
  });
};
