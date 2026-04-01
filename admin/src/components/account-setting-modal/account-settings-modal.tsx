"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./profile-tab";
import { PaymentTab } from "./payment-tab";
import { NotificationsTab } from "./notifications-tab";
import { SessionTab } from "./session-tab";
import { UserIcon, CreditCardIcon, BellIcon, ShieldCheckIcon } from "lucide-react";
import { useAuthSession } from "@/hooks/use-auth-session";

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSettingsModal({ open, onOpenChange }: AccountSettingsModalProps) {
  const { role } = useAuthSession();
  const showPayment = role !== "ADMIN";
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-xl">Account Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-[calc(90vh-80px)]" orientation="vertical">
          <TabsList className="flex flex-col h-full w-48 justify-start rounded-none border-r border-border bg-muted/30 p-2 gap-1">
            <TabsTrigger value="profile" className="w-full justify-start gap-3 data-[state=active]:bg-background">
              <UserIcon className="h-4 w-4" /> Profile
            </TabsTrigger>
            {showPayment && (
              <TabsTrigger value="payment" className="w-full justify-start gap-3 data-[state=active]:bg-background">
                <CreditCardIcon className="h-4 w-4" /> Payment
              </TabsTrigger>
            )}
            <TabsTrigger value="notifications" className="w-full justify-start gap-3 data-[state=active]:bg-background">
              <BellIcon className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="session" className="w-full justify-start gap-3 data-[state=active]:bg-background">
              <ShieldCheckIcon className="h-4 w-4" /> Session
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="profile" className="m-0 p-6"><ProfileTab /></TabsContent>
            {showPayment && <TabsContent value="payment" className="m-0 p-6"><PaymentTab /></TabsContent>}
            <TabsContent value="notifications" className="m-0 p-6"><NotificationsTab /></TabsContent>
            <TabsContent value="session" className="m-0 p-6"><SessionTab /></TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface AccountSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSettingsModal({
  open,
  onOpenChange,
}: AccountSettingsModalProps) {
  const [activeTab, setActiveTab] = useState("payment");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle className="text-xl">Account Settings</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-[calc(90vh-80px)]"
          orientation="vertical"
        >
          <TabsList className="flex flex-col h-full w-48 justify-start rounded-none border-r border-border bg-muted/30 p-2 gap-1">
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-3 data-[state=active]:bg-background"
            >
              <UserIcon className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="w-full justify-start gap-3 data-[state=active]:bg-background"
            >
              <CreditCardIcon className="h-4 w-4" />
              Payment
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="w-full justify-start gap-3 data-[state=active]:bg-background"
            >
              <BellIcon className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="session"
              className="w-full justify-start gap-3 data-[state=active]:bg-background"
            >
              <ShieldCheckIcon className="h-4 w-4" />
              Session
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="profile" className="m-0 p-6">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="payment" className="m-0 p-6">
              <PaymentTab />
            </TabsContent>
            <TabsContent value="notifications" className="m-0 p-6">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="session" className="m-0 p-6">
              <SessionTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
