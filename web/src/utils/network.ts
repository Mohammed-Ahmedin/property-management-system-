import { toast } from "sonner";

let isOffline = !navigator.onLine;
const offlineToastId = "offline-toast-id";

// Listen globally for online/offline events
window.addEventListener("offline", () => {
  isOffline = true;
});

window.addEventListener("online", () => {
  isOffline = false;
});

/**
 * Call in any onError
 * @returns true if device offline (skip main error), false if online
 */
export function handleDeviceNetworkError(): boolean {
  if (isOffline) {
    toast.error("No internet connection. Please check your network.", {
      id: offlineToastId,
      position: "top-center",
    });
    return true; // skip main error
  }
  return false; // online → continue main error
}

/**
 * Check if device has internet connection
 * @returns true if online, false if offline
 */
export function isDeviceOnline(): boolean {
  return navigator.onLine;
}
