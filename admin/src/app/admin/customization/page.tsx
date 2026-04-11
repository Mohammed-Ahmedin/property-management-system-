"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/hooks/api";
import { Palette, Youtube, Send, Instagram, Globe, Image, Type, RefreshCw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const TIKTOK_ICON = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
  </svg>
);

export default function CustomizationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: "Bete",
    logoUrl: "",
    youtube: "",
    tiktok: "",
    telegram: "",
    instagram: "",
  });

  useEffect(() => {
    api.get("/site-config").then(res => {
      const d = res.data;
      setForm({
        siteName: d.siteName || "Bete",
        logoUrl: d.logoUrl || "",
        youtube: d.youtube || "",
        tiktok: d.tiktok || "",
        telegram: d.telegram || "",
        instagram: d.instagram || "",
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/site-config", form);
      toast.success("Site settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Spinner className="size-8" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Site Customization</h1>
            <p className="text-sm text-muted-foreground">Edit site name, logo and social media links</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" /> Branding
              </CardTitle>
              <CardDescription>Site name and logo shown across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Site Name</Label>
                <Input
                  value={form.siteName}
                  onChange={e => setForm(f => ({ ...f, siteName: e.target.value }))}
                  placeholder="e.g. Bete"
                />
                <p className="text-xs text-muted-foreground">Shown in the header, footer and browser tab</p>
              </div>
              <div className="space-y-1.5">
                <Label>Logo URL</Label>
                <Input
                  value={form.logoUrl}
                  onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                  placeholder="https://... (upload to Cloudinary first)"
                />
                {form.logoUrl && (
                  <img src={form.logoUrl} alt="Logo preview" className="h-12 w-12 rounded-lg object-contain border border-border mt-2" />
                )}
                <p className="text-xs text-muted-foreground">Leave empty to use the default "B" letter logo</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Social Media Links
              </CardTitle>
              <CardDescription>Links shown in the footer. Leave empty to hide.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4 text-red-500" />, placeholder: "https://youtube.com/@yourhandle" },
                { key: "tiktok", label: "TikTok", icon: <TIKTOK_ICON />, placeholder: "https://tiktok.com/@yourhandle" },
                { key: "telegram", label: "Telegram", icon: <Send className="w-4 h-4 text-blue-500" />, placeholder: "https://t.me/yourhandle" },
                { key: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4 text-pink-500" />, placeholder: "https://instagram.com/yourhandle" },
              ].map(({ key, label, icon, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <Label className="flex items-center gap-2">{icon} {label}</Label>
                  <Input
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full h-11 font-semibold">
            {saving ? <><Spinner className="mr-2 size-4" /> Saving...</> : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
