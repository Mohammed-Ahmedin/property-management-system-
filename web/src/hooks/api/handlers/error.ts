import { isDeviceOnline } from "@/utils/network";
import { toast } from "sonner";

const offlineToastId = "offline-toast-id";

/**
 * TanStack Query error handler
 * @param error - incoming error from server or throw
 * @param options - optional custom message
 * @returns true if offline (main onError should skip), false otherwise
 */
export function handleTanstackError({
  error,
  options,
}: {
  error: any;
  options?: { customMessage?: string; skipOfflineToast?: boolean };
}): boolean {
  const { customMessage = "Something went wrong", skipOfflineToast = false } =
    options || {};

  // Check network first
  if (!isDeviceOnline()) {
    if (!skipOfflineToast) {
      toast.error("No internet connection. Please check your network.", {
        id: offlineToastId,
        position: "top-center",
      });
    }
    return true; // skip main error
  }

  // Extract actual server error
  const errMsg =
    error?.response?.data?.message || error?.message || customMessage;

  // Show toast
  toast.error(errMsg, { position: "top-center" });

  return false; // proceed with main onError logic
}
