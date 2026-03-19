"use client";

import { useState } from "react";
import { UserProfile } from "./user-profile";
import { AccountOptions } from "./account-options";
import { AccountFooter } from "./account-footer";
import { authClient } from "@/lib/auth-client";
import LoaderState from "@/components/shared/loader-state";

export default function AccountPage() {
  const { data, isPending, error } = authClient.useSession();

  return (
    <div className="min-h-screen bg-background p-3 c-px">
      {/* Header */}
      <div className=" md:mb-8">
        <h1 className="text-xl font-bold tracking-tight mb-2">
          Account settings
        </h1>
      </div>

      {isPending ? (
        <LoaderState />
      ) : error ? (
        ""
      ) : (
        data?.user && (
          <main className="mx-auto max-w-2xl pt-6 pb-8 sm:px-6 lg:px-8">
            {/* User Profile Section */}
            <UserProfile user={data?.user} />

            {/* Account Options Section */}
            <AccountOptions user={data?.user} />

            {/* Footer Section */}
            <AccountFooter />
          </main>
        )
      )}
    </div>
  );
}
