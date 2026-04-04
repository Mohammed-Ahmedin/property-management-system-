"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useUpdateCommission } from "@/hooks/api/use-commision";

const commissionSchema = yup.object({
  platformPercent: yup
    .number()
    .required("Platform percentage is required")
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .typeError("Must be a valid number"),
  brokerPercent: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0, "Must be at least 0")
    .max(100, "Must be at most 100")
    .typeError("Must be a valid number"),
  type: yup
    .string()
    .oneOf(["PLATFORM", "GUESTHOUSE"], "Invalid commission type")
    .required("Commission type is required"),
  isActive: yup.boolean().required(),
});

type CommissionFormData = yup.InferType<typeof commissionSchema>;

interface UpdateCommissionModalProps {
  commissionId: string;
  initialData: {
    platformPercent: number;
    brokerPercent?: number | null;
    type: "PLATFORM" | "GUESTHOUSE";
    description: string;
    isActive: boolean;
    property: {
      id: string;
      name: string;
    };
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function UpdateCommissionModal({
  commissionId,
  initialData,
  trigger,
  onSuccess,
}: UpdateCommissionModalProps) {
  const [open, setOpen] = useState(false);
  const updateCommission = useUpdateCommission();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CommissionFormData>({
    resolver: yupResolver(commissionSchema as any),
    defaultValues: {
      platformPercent: initialData.platformPercent,
      brokerPercent: initialData.brokerPercent,
      type: initialData.type,
      isActive: initialData.isActive,
    },
  });

  const commissionType = watch("type");
  const isActive = watch("isActive");

  // Reset form when initialData changes
  useEffect(() => {
    reset({
      platformPercent: initialData.platformPercent,
      brokerPercent: initialData.brokerPercent,
      type: initialData.type,
      isActive: initialData.isActive,
    });
  }, [initialData, reset]);

  const handleFormSubmit = async (data: CommissionFormData) => {
    try {
      await updateCommission.mutateAsync({
        id: commissionId,
        data: {
          ...data,
          propertyId: initialData.property?.id,
        },
      });
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update commission:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Edit Commission</Button>}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Update Commission Setting
          </DialogTitle>
          <DialogDescription>
            Modify commission percentages and settings for{" "}
            {commissionType === "GUESTHOUSE" && initialData.property?.id
              ? initialData.property?.name
              : "the platform"}
            .
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit as any)}
          className="space-y-6"
        >
          {/* Commission Type */}
          {/* <div className="space-y-2">
            <Label htmlFor="type">
              Commission Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={commissionType}
              onValueChange={(value) =>
                setValue("type", value as "PLATFORM" | "GUESTHOUSE", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select commission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLATFORM">Platform</SelectItem>
                <SelectItem value="GUESTHOUSE">Property</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
          </div> */}

          {/* Property Display (Read-only) */}
          {commissionType === "GUESTHOUSE" && initialData.property?.name && (
            <div className="space-y-2">
              <Label>Property</Label>
              <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
                {initialData.property?.name}
              </div>
              <p className="text-xs text-muted-foreground">Property assignment cannot be changed</p>
            </div>
          )}

          {/* Name (editable) */}
          <div className="space-y-2">
            <Label htmlFor="update-name">Commission Name</Label>
            <Input id="update-name" placeholder="e.g., Platform Standard Commission" defaultValue={(initialData as any).name || ""} onChange={(e) => (initialData as any)._nameOverride = e.target.value} />
          </div>

          {/* Platform Percent */}
          <div className="space-y-2">
            <Label htmlFor="platformPercent">
              Platform Percentage (%){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="platformPercent"
              type="number"
              step="0.01"
              placeholder="e.g., 15.5"
              {...register("platformPercent")}
            />
            {errors.platformPercent && (
              <p className="text-sm text-destructive">
                {errors.platformPercent.message}
              </p>
            )}
          </div>

          {/* description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="string"
              disabled
              placeholder="Description"
              value={initialData?.description ||''}
            />
          </div>

          {/* Broker Percent */}
          <div className="space-y-2">
            <Label htmlFor="brokerPercent">Broker Percentage (%)</Label>
            <Input
              id="brokerPercent"
              type="number"
              step="0.01"
              placeholder="e.g., 5.0 (optional)"
              {...register("brokerPercent")}
            />
            {errors.brokerPercent && (
              <p className="text-sm text-destructive">
                {errors.brokerPercent.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Optional commission for brokers
            </p>
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Active Status
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this commission setting
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) =>
                setValue("isActive", checked, { shouldValidate: true })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Commission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
