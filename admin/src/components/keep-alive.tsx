"use client";

import { useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

// Pings the backend every 13 minutes to prevent Render free tier cold starts
export function KeepAlive() {
  useEffect(() => {
    const ping = () => {
      fetch(`${BACKEND_URL}/api/v1/health`, { method: "GET" }).catch(() => {});
    };
    ping(); // ping immediately on mount
    const id = setInterval(ping, 13 * 60 * 1000); // every 13 min
    return () => clearInterval(id);
  }, []);
  return null;
}
