"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "../ui/switch";

interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  sound: boolean;
}

const NotificationsSetting = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    marketing: false,
    sound: true,
  });

  // Load saved settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("notificationSettings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Handler for toggles
  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem("notificationSettings", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-foreground text-sm font-medium">
          Email Notifications
        </label>
        <Switch
          checked={settings.email}
          onCheckedChange={() => handleToggle("email")}
        />
      </div>

      {/* Push Notifications */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-foreground text-sm font-medium">
          Push Notifications
        </label>
        <Switch
          checked={settings.push}
          onCheckedChange={() => handleToggle("push")}
        />
      </div>

      {/* Marketing / Promotions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-foreground text-sm font-medium">
          Marketing & Promotions
        </label>
        <Switch
          checked={settings.marketing}
          onCheckedChange={() => handleToggle("marketing")}
        />
      </div>

      {/* Notification Sound */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-foreground text-sm font-medium">
          Notification Sound
        </label>
        <Switch
          checked={settings.sound}
          onCheckedChange={() => handleToggle("sound")}
        />
      </div>

      {/* Helper text */}
      <p className="text-muted-foreground text-xs">
        Toggle the notifications you want to receive. Your choices are saved
        automatically.
      </p>
    </div>
  );
};

export default NotificationsSetting;
