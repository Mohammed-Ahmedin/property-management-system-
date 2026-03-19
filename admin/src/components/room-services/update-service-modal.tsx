"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateRoomServiceMutation } from "@/hooks/api/use-rooms";

interface UpdateServiceDialogProps {
  serviceId: string;
  initialData: {
    name: string;
    description: string;
    price: number;
    isActive: boolean;
  };
  roomId: string;
}

// ✅ Yup schema for validation
const schema = yup.object({
  name: yup.string().required("Service name is required").min(4),
  description: yup.string().required("Description is required").min(5),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  isActive: yup.boolean().default(true),
});

type FormValues = yup.InferType<typeof schema>;

export function UpdateServiceDialog({
  serviceId,
  initialData,
  roomId,
}: UpdateServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateService = useUpdateRoomServiceMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  // Load data when dialog opens
  useEffect(() => {
    if (isOpen && initialData) reset(initialData);
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    await updateService.mutateAsync({ serviceId, data, roomId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update the existing service details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              placeholder="e.g., Laundry"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the service..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="price">Price (ETB)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Active switch */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">
                Toggle availability for guests
              </p>
            </div>
            <Switch
              id="isActive"
              {...register("isActive")}
              defaultChecked={initialData.isActive}
              onCheckedChange={(val) => setValue("isActive", val)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateService.isPending}>
              {updateService.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
