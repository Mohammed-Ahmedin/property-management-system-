import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_BASE_URL } from ".";

export const useBookNowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      roomId: string;
      checkIn: number;
      checkOut: number;
      guests: number;
      userId: string;
      additionalServices: { id: string }[];
    }) => axios.post(`${SERVER_BASE_URL}/bookings`, data, { timeout: 8000 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useGetUserBookingsQuery = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["bookings", userId],
    queryFn: () =>
      axios.get(`${SERVER_BASE_URL}/bookings/user-bookings/${userId}`),
  });
};

export const useBookingDetailQuery = (bookingId: string) => {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => axios.get(`${SERVER_BASE_URL}/bookings/${bookingId}`),
  });
};

// export const useGetSingleBookingQuery = ({
//   bookingId,
// }: {
//   bookingId: string;
// }) => {
//   return useQuery<{ name: string }>({
//     queryKey: ["bookings", bookingId],
//     queryFn: () => axios.get(`${SERVER_BASE_URL}/bookings/${bookingId}`),
//   });
// };
