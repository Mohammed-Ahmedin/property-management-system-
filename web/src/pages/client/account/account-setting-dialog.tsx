"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/shared/avatar";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/store/slices/auth.slices";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Please enter a valid email address"),
  phone: yup.string().notRequired(),
});

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

async function uploadToCloudinary(file: File): Promise<string> {
  const { api } = await import("@/hooks/api");
  const fd = new FormData();
  fd.append("file", file);
  // Use axios api instance which has auth headers
  const res = await api.post("/users/upload-avatar", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data?.url) throw new Error("No URL returned");
  return res.data.url;
}

export function AccountSettingsDialog({ open, onOpenChange, user }: AccountSettingsDialogProps) {
  const [profileImage, setProfileImage] = useState(user.image);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: user.name, email: user.email, phone: (user as any).phone || "" },
  });

  const onSubmit = async (data: any) => {
    setIsPending(true);
    try {
      let imageUrl = user.image || "";

      if (pendingFile) {
        try {
          imageUrl = await uploadToCloudinary(pendingFile);
        } catch (e: any) {
          toast.error(`Image upload failed: ${e?.message || "unknown error"}`);
          setIsPending(false);
          return;
        }
      }

      // Use the api axios instance which has auth headers configured
      const { api } = await import("@/hooks/api");
      const updateRes = await api.put("/users/me", { name: data.name, image: imageUrl || undefined });

      if (!updateRes.data?.success) {
        toast.error("Failed to save profile");
        setIsPending(false);
        return;
      }

      // Also update Better Auth session name
      await authClient.updateUser({ name: data.name }).catch(() => {});

      const updatedUser = { ...user, name: data.name, image: imageUrl || user.image };
      dispatch(loginUser({ user: updatedUser as any }));
      localStorage.setItem("AUTH_USER", JSON.stringify(updatedUser));
      setProfileImage(imageUrl || user.image || "");
      setPendingFile(null);
      toast.success("Profile updated successfully", { position: "top-center" });
      setTimeout(() => window.location.reload(), 800);
    } catch (e: any) {
      toast.error(`Failed to update profile: ${e?.message || "unknown error"}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) { reset(); setProfileImage(user.image); setPendingFile(null); }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Account Settings</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar fallback={user.name} src={profileImage || ""} alt="Profile" className="h-24 w-24" />
            <div className="flex flex-col items-center gap-2">
              <Label htmlFor="image-input" className="cursor-pointer text-sm font-medium">Change Profile Image</Label>
              <Input id="image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("image-input")?.click()}>
                Upload Image
              </Button>
              {pendingFile && <p className="text-xs text-primary">✓ {pendingFile.name} selected</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="Enter your phone number" {...register("phone")} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" {...register("email")} disabled />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
