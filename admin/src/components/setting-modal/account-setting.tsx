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
  username: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value || null)
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters"),
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
          username: user.username ?? null,
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
    username: string | null;
    image: string | null;
  };
}) => {
  const [isSubmitting, startTransition] = useTransition();
  const { refetch } = authClient.useSession();
  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserUpdateForm>({
    resolver: yupResolver(userUpdateSchema as any),
    defaultValues: {
      name: userData?.name,
      username: userData.username || "",
      email: userData?.email,
    },
  });

  const handleProfileImageFileInputChage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (files) {
      setSelectedProfileImage(files[0]);
      console.log(files[0]);
    }
  };

  const onSubmit = async (data: UserUpdateForm) => {
    startTransition(async () => {
      try {
        await authClient.updateUser({ name: data.name });
        // Update localStorage so mobile sees the new name
        try {
          const raw = localStorage.getItem("admin_session_user");
          if (raw) {
            const stored = JSON.parse(raw);
            localStorage.setItem("admin_session_user", JSON.stringify({ ...stored, name: data.name }));
          }
        } catch {}
        toast.success("Profile updated");
        refetch();
      } catch {
        toast.error("Failed to update profile");
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
            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-black  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </Label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageFileInputChage}
          />
          <p className="text-xs text-gray-500">Or enter an image URL below</p>
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
          className="transition-colors text-sm py-6 "
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          className="transition-colors text-sm py-6"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-sm text-red-600">{errors.username.message}</p>
        )}
        <p className="text-xs text-gray-500">
          Optional. Can only contain letters, numbers, and underscores.
        </p>
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
          Email cannot be changed. Contact support if you need to update your
          email.
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button type="submit">Update Profile</Button>
      </div>
    </form>
  );
};
