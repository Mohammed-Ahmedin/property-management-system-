"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useClientAuth } from "@/hooks/use-client-auth";
import { HelpCircle, LogOut } from "lucide-react";

export function AccountFooter() {
  const { signOut } = useClientAuth();
  const handleContactSupport = () => {
    // Navigate to support page or open support modal
    window.location.href = "/support";
  };

  const handleLogout = async () => {
    // Handle logout logic
    await signOut();
    window.location.href = "/";
    // In a real app, you would clear auth tokens and redirect
  };

  return (
    <Card className="border-t border-border bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </Card>
  );
}
