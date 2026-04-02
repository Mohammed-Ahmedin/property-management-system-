"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Lock, Palette, BookOpen } from "lucide-react";
import { AccountSettingsDialog } from "./account-setting-dialog";
import { SecurityDialog } from "./security-dialog";
import { AppearanceDialog } from "./apperence-dialog";

interface AccountOptionsProps {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
}

export function AccountOptions({ user }: AccountOptionsProps) {
  const [openSettings, setOpenSettings] = useState(false);
  const [openSecurity, setOpenSecurity] = useState(false);
  const [openAppearance, setOpenAppearance] = useState(false);

  const handleNavigateBookings = () => {
    window.location.href = "/account/bookings";
  };

  return (
    <>
      <div className="mb-8 space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          Settings
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Account Settings Button */}
          <Card className="p-4">
            <Button
              onClick={() => setOpenSettings(true)}
              variant="ghost"
              className="h-auto w-full md:flex-col items-center md:items-start justify-start gap-2 p-4 hover:bg-accent"
            >
              <Settings className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  Account Settings
                </p>
                <p className="text-sm text-muted-foreground">
                  Update your profile information
                </p>
              </div>
            </Button>
          </Card>

          {/* My Bookings Button */}
          <Card className="p-4">
            <Button
              onClick={handleNavigateBookings}
              variant="ghost"
              className="h-auto w-full md:flex-col items-center md:items-start justify-start gap-2 p-4 hover:bg-accent"
            >
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">My Bookings</p>
                <p className="text-sm text-muted-foreground">
                  View your reservations
                </p>
              </div>
            </Button>
          </Card>

          {/* Security Button */}
          <Card className="p-4">
            <Button
              onClick={() => setOpenSecurity(true)}
              variant="ghost"
              className="h-auto w-full md:flex-col items-center md:items-start justify-start gap-2 p-4 hover:bg-accent"
            >
              <Lock className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Security</p>
                <p className="text-sm text-muted-foreground">
                  Change your password
                </p>
              </div>
            </Button>
          </Card>

          {/* Appearance Button */}
          <Card className="p-4">
            <Button
              onClick={() => setOpenAppearance(true)}
              variant="ghost"
              className="h-auto w-full md:flex-col items-center md:items-start justify-start gap-2 p-4 hover:bg-accent"
            >
              <Palette className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Appearance</p>
                <p className="text-sm text-muted-foreground">
                  Customize your preferences
                </p>
              </div>
            </Button>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AccountSettingsDialog
        open={openSettings}
        onOpenChange={setOpenSettings}
        user={user}
      />
      <SecurityDialog open={openSecurity} onOpenChange={setOpenSecurity} />
      <AppearanceDialog
        open={openAppearance}
        onOpenChange={setOpenAppearance}
      />
    </>
  );
}
