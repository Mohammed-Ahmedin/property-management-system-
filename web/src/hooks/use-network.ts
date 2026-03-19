"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Hook: useDeviceNetworkHandler
 * Call this once in your root component (App or layout)
 * Provides single offline/online toasts and network status flag
 */
export function useDeviceNetworkHandler() {
  const offlineToastId = useRef("offline-toast-id");
  const isOfflineRef = useRef(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      if (!isOfflineRef.current) {
        isOfflineRef.current = true;
        toast.error("No internet connection. Please check your network.", {
          id: offlineToastId.current,
          position: "top-center",
        });
      }
    };

    const handleOnline = () => {
      if (isOfflineRef.current) {
        isOfflineRef.current = false;
        toast.success("Back online!", {
          id: offlineToastId.current,
          position: "top-center",
        });
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  /**
   * Check if device is currently offline
   */
  const isOffline = () => isOfflineRef.current;

  return { isOffline };
}
