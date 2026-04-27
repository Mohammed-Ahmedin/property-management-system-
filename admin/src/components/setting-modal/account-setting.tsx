"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "../shared/avatar";
import { toast } from "sonner";

// Validation schema
const userUpdateSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

type UserUpdateForm = yup.InferType<typeof userUpdateSchema>;

export default function AccountSetting({
  activeSection,
  isModalOpen,
}: {
  activeSection: string;
  isModalOpen: boolean;
}) {
  const { data } = authClient.useSession();
  const sessionUser = data?.user as any;

  // Fall back to localStorage on mobile where cookie session fails
  const user = sessionUser ?? (() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("admin_session_user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  if (!user) {
    return (
      <div className="px-0 h-full max-w-2xl mx-auto flex items-center justify-center py-20">
        <p className="text-muted-foreground text-sm">Could not load profile. Please sign out and sign in again.</p>
      </div>
    );
  }

  return (
    <div className="px-0 h-full max-w-2xl mx-auto">
      <FormContainer
        userData={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
        }}
      />
    </div>
  );
}

const FormContainer = ({
  userData,
}: {
  userData: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}) => {
  const [isSubmitting, startTransition] = useTransition();
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateForm>({
    resolver: yupResolver(userUpdateSchema as any),
    defaultValues: {
      name: userData?.name,
      email: userData?.email,
    },
  });

  const handleProfileImageFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setSelectedProfileImage(files[0]);
  };

  const onSubmit = async (data: UserUpdateForm) => {
    startTransition(async () => {
      try {
        let imageUrl = userData.image || "";

        if (selectedProfileImage) {
          const fd = new FormData();
          fd.append("file", selectedProfileImage);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            imageUrl = uploadData.secure_url || imageUrl;
          } else {
            toast.error("Image upload failed");
            return;
          }
        }

        await authClient.updateUser({ name: data.name });

        const { api } = await import("@/hooks/api");
        const payload: any = { name: data.name };
        if (imageUrl) payload.image = imageUrl;
        await api.put("/users/me", payload);

        try {
          const raw = localStorage.getItem("admin_session_user");
          const stored = raw ? JSON.parse(raw) : {};
          localStorage.setItem("admin_session_user", JSON.stringify({ ...stored, name: data.name, image: imageUrl }));
        } catch {}

        toast.success("Profile updated");
        setTimeout(() => window.location.reload(), 600);
      } catch (e: any) {
        toast.error(`Failed to update profile: ${e?.message || "unknown"}`);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar
          size={"2xl"}
          className="md:w-24 md:h-24"
          alt=""
          src={
            (selectedProfileImage
              ? URL.createObjectURL(selectedProfileImage)
              : userData?.image) || ""
          }
          loading="eager"
          interactive
          fallback={userData.name}
        />
        <div className="flex flex-col items-center space-y-2">
          <Label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageFileInputChange}
          />
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          className="transition-colors text-sm py-6"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Email Input (Disabled) */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address *
        </Label>
        <Input
          id="email"
          type="email"
          disabled
          className="cursor-not-allowed py-6 text-sm"
          {...register("email")}
        />
        <p className="text-xs text-gray-500">
          Email cannot be changed. Contact support if you need to update your email.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
};
