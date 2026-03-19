import { useQuery } from "@tanstack/react-query";
import type { RoomResponse } from "./types/room.types";
import { api } from ".";

export const useGetSingleRoom = ({ roomId }: { roomId: string }) => {
  return useQuery<RoomResponse>({
    queryKey: ["rooms", roomId],
    queryFn: async () => {
      const res = await api.get<RoomResponse>(`/rooms/${roomId}`);
      return res.data;
    },
  });
};
