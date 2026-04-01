import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";
import { handleTanstackError } from "./handlers/error";
import type {
  BookingDetailResponse,
  BookingsResponse,
} from "./types/booking.types";

interface BookResponse {
  checkoutUrl: string;
  success: boolean;
}
export const useBookNowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      roomId: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      userId: string;
      additionalServices: { id: string }[] | null;
    }) => {
      const res = await api.post<BookResponse>(`/bookings`, data);

      return res.data;
    },
    onSuccess: ({ message }: any) => {
      toast.message(message, { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => handleTanstackError({ error }),
  });
};

export const useGetUserBookings = () => {
  return useQuery<BookingsResponse>({
    queryKey: ["bookings"],
    retry: false,
    queryFn: async () => {
      const res = await api.get<BookingsResponse>(`/bookings/user`);
      return res.data;
    },
  });
};

export const useGetSingleBookingDetail = ({ id }: { id: string }) => {
  return useQuery<BookingDetailResponse>({
    queryKey: ["bookings", id],
    queryFn: async () => {
      const res = await api.get<BookingDetailResponse>(
        `/bookings/user/${id}`
      );
      return res.data;
    },
  });
};
