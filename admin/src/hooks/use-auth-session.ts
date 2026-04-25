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
  const localUser = getLocalUser();

  // Merge: prefer session user as base, but overlay localStorage fields that
  // may be fresher (e.g. name/image updated via direct DB call when cookie
  // session cache hasn't invalidated yet on cross-origin Render backend).
  let user: any = null;
  if (sessionUser) {
    user = localUser
      ? { ...sessionUser, name: localUser.name ?? sessionUser.name, image: localUser.image ?? sessionUser.image }
      : sessionUser;
  } else {
    user = localUser ?? null;
  }

  const isAuthenticated = !!user?.id;
  const role: string | undefined = user?.role;
  return { isAuthenticated, role, user, isPending };
};
