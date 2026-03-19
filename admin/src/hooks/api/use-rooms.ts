import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from ".";
import { toast } from "sonner";
import { SuccessResponse } from "./types";
import { useAuthSession } from "../use-auth-session";

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ roomData }: { roomData: any }) => {
      const response = await api.post(
        `/rooms`, // your endpoint path
        roomData
      );

      return response.data;
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
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

interface GetRoomsForList {
  id: string;
  name: string;
  roomId: string;
  createdAt: Date;
  bookings: {
    id: string;
    userId: string;
    roomId: string;
    propertyId: string | null;
    createdAt: Date;
    updatedAt: Date;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    status: string;
    approvedById: string | null;
    paymentId: string;
  }[];
  type: string;
  price: number;
  description: string;
  property: {
    id: string;
    name: string;
    images: {
      id: string;
      name: string;
      propertyId: string;
      url: string;
    }[];
  };
  images: {
    id: string;
    name: string;
    roomId: string;
    createdAt: Date;
    updatedAt: Date;
    url: string;
  }[];
}

export const useGetRoomsQuery = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<any>({
    queryKey: ["rooms"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<any>(`/rooms/for-admins`);
      return response.data;
    },
  });
};


interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  bookedRooms: number;
  pendingRooms: number;
}

export const useGetRoomsStatsQuery = (enabled = true) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<RoomStats>({
    queryKey: ["rooms_stats"],
    enabled: isAuthenticated && enabled,
    retry: false,
    queryFn: async () => {
      const response = await api.get<RoomStats>(`/rooms/management/stats`);
      return response.data;
    },
  });
};

export const useRoomsForList = ({ propertyId }: { propertyId: string }) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<GetRoomsForList[]>({
    queryKey: ["rooms", propertyId],
    enabled: isAuthenticated && !!propertyId,
    retry: false,
    queryFn: async () => {
      const response = await api.get<GetRoomsForList[]>(`/rooms/management/for-list/${propertyId}`);
      return response.data;
    },
  });
};

export const useGetSingleRoomQuery = ({ id }: { id: string }) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<any>({
    queryKey: ["rooms", id],
    enabled: isAuthenticated && !!id,
    retry: false,
    queryFn: async () => {
      const response = await api.get<any>(`/rooms/management/${id}`);
      return response.data;
    },
  });
};

export const useGetRoomServicesQuery = ({ roomId }: { roomId: string }) => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<Service[]>({
    queryKey: ["room_service", roomId],
    enabled: isAuthenticated && !!roomId,
    retry: false,
    queryFn: async () => {
      const response = await api.get<Service[]>(`/rooms/${roomId}/get-services`);
      return response.data;
    },
  });
};

interface MutateService {
  name: string;
  price: number | null;
  description: string | null;
  isActive: boolean;
}

export const useUpdateRoomServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceId,
      data,
      roomId,
    }: {
      serviceId: string;
      data: MutateService;
      roomId: string;
    }) => {
      const response = await api.put<SuccessResponse>(
        `/rooms/${serviceId}/update-service`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }, { roomId }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["room_service", roomId] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
};

export const useAddRoomServicesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      roomId,
    }: {
      roomId: string;
      data: MutateService;
    }) => {
      const response = await api.post<SuccessResponse>(
        `/rooms/${roomId}/add-services`,
        data
      );
      return response.data;
    },
    onSuccess: ({ message }, { roomId }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["room_service", roomId] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });
};

export const useGetRoomsForManagementQuery = () => {
  const { isAuthenticated } = useAuthSession();
  return useQuery<any>({
    queryKey: ["rooms_for_management"],
    enabled: isAuthenticated,
    retry: false,
    queryFn: async () => {
      const response = await api.get<any>(`/rooms/management`);
      return response.data;
    },
  });
};

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete<SuccessResponse>(`/rooms/${id}`);
      return response.data;
    },
    onSuccess: ({ message }) => {
      toast.message(message);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message || "Failed to delete room");
    },
  });
};
