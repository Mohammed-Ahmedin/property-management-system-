import { useQuery } from "@tanstack/react-query";
import { api } from ".";
import { useAuthSession } from "../use-auth-session";

interface AdminDashboardStatsRes {
  totalUsers: number;
  totalProperties: number;
  totalAdmins: number;
  activeAdmins: number;
  totalBookings: number;
  totalRooms: number;
  totalTransactions: number;
  avgPaymentValue: number;
}

type PropertyStat = {
  name: string;
  bookings: number;
  revenue: number;
};

export interface StaffStats {
  property: any;
  totalContribution: number;
  totalRooms: number;
  occupancyRate: number;
}

interface OwnerDashboardStatsRes {
  propertiesCount: number;
  roomsCount: number;
  bookingsCount: number;
  staffsCount: number;
}

export const useGetAdminDashboardStats = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<AdminDashboardStatsRes>({
    queryKey: ["dashboard_admin_stats"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<AdminDashboardStatsRes>("/dashboard/admin/stats");
      return response.data;
    },
  });
};

export const useGetAdminDashboardSummary = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<PropertyStat[]>({
    queryKey: ["dashboard_admin_summary"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<PropertyStat[]>("/dashboard/admin/summary");
      return response.data;
    },
  });
};

export const useGetStaffDashboardStats = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<StaffStats[]>({
    queryKey: ["dashboard_staff_stats"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<StaffStats[]>("/dashboard/staff/stats");
      return response.data;
    },
  });
};

export const useGetBrokerDashboardStats = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery({
    queryKey: ["dashboard_broker_stats"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<{
        propertiesCount: number;
        roomsCount: number;
        bookingsCount: number;
      }>("/dashboard/broker");
      return response.data;
    },
  });
};

export const useGetOwnerDashboardStats = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<OwnerDashboardStatsRes>({
    queryKey: ["dashboard_owner_stats"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<OwnerDashboardStatsRes>("/dashboard/owner");
      return response.data;
    },
  });
};

export const useGetOwnerDashboardSummary = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<PropertyStat[]>({
    queryKey: ["dashboard_owner_summary"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<PropertyStat[]>("/dashboard/admin/summary");
      return response.data;
    },
  });
};
