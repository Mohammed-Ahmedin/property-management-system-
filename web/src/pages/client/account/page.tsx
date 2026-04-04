"use client";

import { UserProfile } from "./user-profile";
import { AccountOptions } from "./account-options";
import { AccountFooter } from "./account-footer";
import { authClient } from "@/lib/auth-client";
import { useAppSelector } from "@/store/hooks";
import LoaderState from "@/components/shared/loader-state";

export default function AccountPage() {
  const { data, isPending } = authClient.useSession();
  const reduxUser = useAppSelector((state) => state.auth.user);

  // Prefer session data, fall back to Redux store (handles mobile cookie issues)
  const user = (data?.user ?? reduxUser) as any;

  return (
    <div className="min-h-screen bg-background p-3 c-px">
      <div className="md:mb-8">
        <h1 className="text-xl font-bold tracking-tight mb-2">Account settings</h1>
      </div>

      {isPending && !user ? (
        <LoaderState />
      ) : user ? (
        <main className="mx-auto max-w-2xl pt-6 pb-8 sm:px-6 lg:px-8">
          <UserProfile user={user} />
          <AccountOptions user={user} />
          <AccountFooter />
        </main>
      ) : (
        <div className="flex justify-center items-center min-h-[40vh]">
          <p className="text-muted-foreground">Please sign in to view your account.</p>
        </div>
      )}
    </div>
  );
}
