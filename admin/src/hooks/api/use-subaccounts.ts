import { useQuery } from "@tanstack/react-query";
import { api } from ".";
import { useAuthSession } from "../use-auth-session";

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
  anydAt: any;
}

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
