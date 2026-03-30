"use client";

import type * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Download } from "lucide-react";
import { useAddStaffToGHMutation } from "@/hooks/api/use-staff";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export function AddStaffModal({ propertyId }: { propertyId: string }) {
  const [open, setOpen] = useState(false);
  const addStaffMutation = useAddStaffToGHMutation();

  const [lastAddedStaff, setLastAddedStaff] = useState<FormData | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await addStaffMutation.mutateAsync({
      propertyId,
      email: formData.email.trim(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    });

    setLastAddedStaff({ ...formData });
    setShowSuccess(true);

    // Reset form
    setFormData({ name: "", email: "", phone: "", password: "" });
    setErrors({});
  };

  const handleDownloadCredentials = () => {
    if (!lastAddedStaff) return;

    const credentialsText = `Staff Credentials
==================

Name: ${lastAddedStaff.name}
Email: ${lastAddedStaff.email}
Phone: ${lastAddedStaff.phone}
Password: ${lastAddedStaff.password}

==================
Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([credentialsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${lastAddedStaff.name.replace(
      /\s+/g,
      "_"
    )}_credentials.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setFormData({ name: "", email: "", phone: "", password: "" });
      setErrors({});
      setShowSuccess(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showSuccess ? "Staff Added Successfully" : "Add New Staff Member"}
          </DialogTitle>
        </DialogHeader>

        {showSuccess && lastAddedStaff ? (
          <div className="space-y-4 mt-4">
            <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
              <p className="text-sm font-medium">
                Staff member has been added:
              </p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Name:</span>{" "}
                  {lastAddedStaff.name}
                </p>
                <p>
                  <span className="font-medium text-foreground">Email:</span>{" "}
                  {lastAddedStaff.email}
                </p>
                <p>
                  <span className="font-medium text-foreground">Phone:</span>{" "}
                  {lastAddedStaff.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleDownloadCredentials}
                className="w-full"
                variant="default"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Credentials
              </Button>
              <Button
                onClick={handleCloseSuccess}
                variant="outline"
                className="w-full bg-transparent"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={addStaffMutation.isPending}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={addStaffMutation.isPending}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={addStaffMutation.isPending}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-muted-foreground text-xs">(only needed for new accounts)</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Leave empty if assigning existing user"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                disabled={addStaffMutation.isPending}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Enter an existing user's email to assign them, or create a new staff account with a password
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={addStaffMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addStaffMutation.isPending}>
                {addStaffMutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
