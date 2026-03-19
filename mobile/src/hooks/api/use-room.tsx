import { useQuery } from "@tanstack/react-query";
import api from "./index";

export const useGetSingleRoom = ({ roomId }: { roomId: string }) => {
  return useQuery({
    queryKey: ["room"],
    queryFn: () => api.get(`/rooms/${roomId}`),
  });
};
