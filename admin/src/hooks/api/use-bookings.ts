import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from ".";
import { useAuthSession } from "../use-auth-session";

export const useManualBookMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookData }: { bookData: any }) => {
      const response = await api.post(`/bookings/management/manual-booking`, bookData);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

export const useUpdateBookingStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, newStatus }: { bookingId: string; newStatus: any }) => {
      const response = await api.post(`/bookings/management/${bookingId}/status`, { status: newStatus });
      return response.data;
    },
    onSuccess: ({ message }, { bookingId }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["bookings", bookingId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    },
  });
};

export const useGetBookings = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery({
    queryKey: ["bookings"],
    enabled: isAuthenticated,
    retry: false,
    refetchInterval: isAuthenticated ? 2000 : false,
    queryFn: async () => {
      const response = await api.get(`/bookings/management`);
      return response.data;
    },
  });
};

export const useGetRecentBookings = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery({
    queryKey: ["bookings_recent"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/bookings/management/recent`);
      return response.data;
    },
  });
};

interface BookingStats {
  totalBookings: string;
  upcomingBookings: string;
  pastBookings: string;
  totalGuests: string;
  totalRevenue: string;
}

export const useGetBookingsStats = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<BookingStats>({
    queryKey: ["bookings_stats"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<BookingStats>(`/bookings/management/stats`);
      return response.data;
    },
  });
};

export const useGetBookingDetailById = ({ bookingId }: { bookingId: string }) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery({
    queryKey: ["bookings", bookingId],
    enabled: isAuthenticated && !!bookingId,
    retry: false,
    queryFn: async () => {
      const response = await api.get(`/bookings/management/${bookingId}`);
      return response.data;
    },
  });
};
