import { authClient } from "@/lib/auth-client";

/**
 * Returns true only when the session has loaded and the user is authenticated.
 * Use this as the `enabled` flag for all protected queries.
 */
export const useAuthSession = () => {
  const { data, isPending } = authClient.useSession();
  const user = data?.user as any;
  const isAuthenticated = !isPending && !!user?.id;
  const role: string | undefined = user?.role;
  return { isAuthenticated, role, user, isPending };
};
