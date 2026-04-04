import { authClient } from "@/lib/auth-client";

const ADMIN_USER_KEY = "admin_session_user";

const getLocalUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const useAuthSession = () => {
  const { data, isPending } = authClient.useSession();
  const sessionUser = data?.user as any;
  // Fall back to localStorage user when cookie session isn't available (mobile)
  const user = sessionUser ?? getLocalUser();
  const isAuthenticated = !!user?.id;
  const role: string | undefined = user?.role;
  return { isAuthenticated, role, user, isPending };
};
