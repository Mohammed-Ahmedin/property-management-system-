"use client";

import React, { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { toast } from "sonner";

// Create QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Pause retries if device is offline
        if (!navigator.onLine) return false;
        return failureCount < 1; // default: 1 retry
      },
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (!navigator.onLine) return false;
        return failureCount < 1;
      },
    },
  },
});

const TanstackQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const offlineToastId = useRef<string>("offline-toast-id");
  const isOfflineRef = useRef<boolean>(!navigator.onLine);

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

        // Optionally, refetch all queries automatically
        // queryClient.refetchQueries({ active: true });
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default TanstackQueryProvider;
