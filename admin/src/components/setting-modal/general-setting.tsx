"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTheme } from "next-themes";

const GeneralSetting = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  // Display "system" as the active theme if theme is set to system
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="space-y-5">
      {/* Theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-foreground text-sm font-medium">Theme</label>
        <Select value={theme} onValueChange={(val) => setTheme(val)}>
          <SelectTrigger className="w-full sm:w-32 bg-background border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-foreground text-sm font-medium">Language</label>
        <Select defaultValue="auto-detect">
          <SelectTrigger className="w-full sm:w-32 bg-background border-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto-detect">Auto-detect</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spoken Language */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-foreground text-sm font-medium">
            Spoken Language
          </label>
          <Select defaultValue="auto-detect">
            <SelectTrigger className="w-full sm:w-32 bg-background border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto-detect">Auto-detect</SelectItem>
              <SelectItem value="en-us">English (US)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground text-xs">
          For best results, select the language you mainly speak. If it's not
          listed, it may still be supported via auto-detection.
        </p>
      </div>
    </div>
  );
};

export default GeneralSetting;
