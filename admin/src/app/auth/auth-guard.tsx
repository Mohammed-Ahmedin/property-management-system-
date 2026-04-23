"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_USER_KEY = "admin_session_user";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      if (raw) {
        const user = JSON.parse(raw);
        // If already logged in with a non-guest role, go to dashboard
        if (user?.id && user?.role && user.role !== "GUEST") {
          router.replace("/admin/dashboard");
          return;
        }
      }
    } catch {}
    setChecked(true);
  }, []);

  if (!checked) return null;
  return <>{children}</>;
}
