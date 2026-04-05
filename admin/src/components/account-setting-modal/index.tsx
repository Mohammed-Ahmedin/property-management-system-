"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell } from "lucide-react";
import { toast } from "sonner";
import { ProfileTab as ProfileTabComponent } from "./profile-tab";

// Validation schemas
const generalSettingsSchema = yup.object({
  language: yup.string().required("Language is required"),
  timezone: yup.string().required("Timezone is required"),
});

const accountSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  currentPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters"),
  newPassword: yup.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

const notificationSchema = yup.object({
  emailNotifications: yup.boolean(),
  pushNotifications: yup.boolean(),
  marketingEmails: yup.boolean(),
});

type GeneralSettingsForm = yup.InferType<typeof generalSettingsSchema>;
type AccountForm = yup.InferType<typeof accountSchema>;
type NotificationForm = yup.InferType<typeof notificationSchema>;

interface AccountSettingsDialogProps {
  children?: React.ReactNode;
  user?: any;
}

export function AccountSettingsModal({
  children,
  user,
}: AccountSettingsDialogProps) {
  const [open, setOpen] = useState(false);

  // General Settings Form
  const generalForm = useForm<GeneralSettingsForm>({
    resolver: yupResolver(generalSettingsSchema),
    defaultValues: {
      language: "en",
      timezone: "UTC",
    },
  });

  // Account Form
  const accountForm = useForm<AccountForm>({
    resolver: yupResolver(accountSchema as any),
    defaultValues: {
      name: "John Doe",
      email: "john.doe@example.com",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification Form
  const notificationForm = useForm<NotificationForm>({
    resolver: yupResolver(notificationSchema as any),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: false,
    },
  });

  const onGeneralSubmit = (data: GeneralSettingsForm) => {
    console.log("General settings:", data);
    toast.message("Settings updated");
  };

  const onAccountSubmit = (data: AccountForm) => {
    console.log("Account data:", data);

    toast.message("Account updated");
  };

  const onNotificationSubmit = (data: NotificationForm) => {
    console.log("Notification settings:", data);
    toast.message("Preferences saved");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-semibold">
            Account Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <Tabs
          defaultValue={user ? "profile" : "general"}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-6 h-auto p-0">
            {user && (
              <TabsTrigger
                value="profile"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            )}
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              <Settings className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Profile Tab */}
            {user && (
              <TabsContent value="profile" className="mt-0">
                <ProfileTabComponent initialUser={user} />
              </TabsContent>
            )}
            {/* General Settings Tab */}
            <TabsContent value="general" className="mt-0 space-y-6">
              <form
                onSubmit={generalForm.handleSubmit(onGeneralSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Input
                      id="language"
                      {...generalForm.register("language")}
                      placeholder="Select language"
                    />
                    {generalForm.formState.errors.language && (
                      <p className="text-sm text-destructive">
                        {generalForm.formState.errors.language.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      {...generalForm.register("timezone")}
                      placeholder="Select timezone"
                    />
                    {generalForm.formState.errors.timezone && (
                      <p className="text-sm text-destructive">
                        {generalForm.formState.errors.timezone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account" className="mt-0 space-y-6">
              <form
                onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Profile Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          {...accountForm.register("name")}
                          placeholder="Enter your name"
                        />
                        {accountForm.formState.errors.name && (
                          <p className="text-sm text-destructive">
                            {accountForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...accountForm.register("email")}
                          placeholder="Enter your email"
                        />
                        {accountForm.formState.errors.email && (
                          <p className="text-sm text-destructive">
                            {accountForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          {...accountForm.register("currentPassword")}
                          placeholder="Enter current password"
                        />
                        {accountForm.formState.errors.currentPassword && (
                          <p className="text-sm text-destructive">
                            {
                              accountForm.formState.errors.currentPassword
                                .message
                            }
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          {...accountForm.register("newPassword")}
                          placeholder="Enter new password"
                        />
                        {accountForm.formState.errors.newPassword && (
                          <p className="text-sm text-destructive">
                            {accountForm.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...accountForm.register("confirmPassword")}
                          placeholder="Confirm new password"
                        />
                        {accountForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-destructive">
                            {
                              accountForm.formState.errors.confirmPassword
                                .message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0 space-y-6">
              <form
                onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}
                className="space-y-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="emailNotifications"
                        className="text-base font-medium"
                      >
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account activity
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      {...notificationForm.register("emailNotifications")}
                      defaultChecked={notificationForm.getValues(
                        "emailNotifications"
                      )}
                      onCheckedChange={(checked) =>
                        notificationForm.setValue("emailNotifications", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="pushNotifications"
                        className="text-base font-medium"
                      >
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your devices
                      </p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      {...notificationForm.register("pushNotifications")}
                      defaultChecked={notificationForm.getValues(
                        "pushNotifications"
                      )}
                      onCheckedChange={(checked) =>
                        notificationForm.setValue("pushNotifications", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="marketingEmails"
                        className="text-base font-medium"
                      >
                        Marketing Emails
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and updates
                      </p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      {...notificationForm.register("marketingEmails")}
                      defaultChecked={notificationForm.getValues(
                        "marketingEmails"
                      )}
                      onCheckedChange={(checked) =>
                        notificationForm.setValue("marketingEmails", checked)
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Preferences</Button>
                </div>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
