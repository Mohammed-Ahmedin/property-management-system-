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
import { updateUser } from "@/store/slices/auth.slices";
import { api } from "@/hooks/api";

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

      // Upload image if a new file was selected
      if (pendingFile) {
        const SERVER_URL = import.meta.env.VITE_SERVER_BASE_URL || "";
        const fd = new FormData();
        fd.append("file", pendingFile);
        const uploadRes = await fetch(`${SERVER_URL}/api/v1/users/upload-avatar`, {
          method: "POST",
          body: fd,
          headers: { Authorization: `Bearer ${localStorage.getItem("AUTH_TOKEN") || ""}` },
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url || imageUrl;
        }
      }

      const { error } = await authClient.updateUser({ name: data.name, image: imageUrl });
      if (error) {
        toast.error(error.message, { position: "top-center" });
      } else {
        const updatedUser = { ...user, name: data.name, image: imageUrl };
        dispatch(updateUser({ user: updatedUser as any }));
        localStorage.setItem("AUTH_USER", JSON.stringify(updatedUser));
        setProfileImage(imageUrl);
        setPendingFile(null);
        toast.success("Profile updated successfully", { position: "top-center" });
      }
    } catch {
      toast.error("Failed to update profile");
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
