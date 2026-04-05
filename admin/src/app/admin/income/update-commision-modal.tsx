"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useUpdateCommission } from "@/hooks/api/use-commision";

interface UpdateCommissionModalProps {
  commissionId: string;
  initialData: {
    name?: string;
    platformPercent: number;
    brokerPercent?: number | null;
    flatAmount?: number | null;
    calcType?: string;
    type: "PLATFORM" | "GUESTHOUSE";
    description?: string;
    isActive: boolean;
    property?: { id: string; name: string };
  };
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function UpdateCommissionModal({ commissionId, initialData, trigger, onSuccess }: UpdateCommissionModalProps) {
  const [open, setOpen] = useState(false);
  const updateCommission = useUpdateCommission();

  const calcType = (initialData as any).calcType || "PERCENTAGE";
  const isFlat = calcType === "FLAT_AMOUNT";

  const { register, handleSubmit, formState: { isSubmitting }, setValue, watch, reset } = useForm({
    defaultValues: {
      name: initialData.name || "",
      platformPercent: initialData.platformPercent ?? 0,
      brokerPercent: initialData.brokerPercent ?? null,
      flatAmount: initialData.flatAmount ?? null,
      calcType,
      isActive: initialData.isActive,
    },
  });

  const isActive = watch("isActive");
  const currentCalcType = watch("calcType");
  const isCurrentFlat = currentCalcType === "FLAT_AMOUNT";

  useEffect(() => {
    if (open) {
      reset({
        name: initialData.name || "",
        platformPercent: initialData.platformPercent ?? 0,
        brokerPercent: initialData.brokerPercent ?? null,
        flatAmount: initialData.flatAmount ?? null,
        calcType: (initialData as any).calcType || "PERCENTAGE",
        isActive: initialData.isActive,
      });
    }
  }, [open, initialData]);

  const handleFormSubmit = async (data: any) => {
    try {
      await updateCommission.mutateAsync({
        id: commissionId,
        data: {
          name: data.name,
          calcType: data.calcType,
          platformPercent: data.calcType === "FLAT_AMOUNT" ? 0 : (Number(data.platformPercent) || 0),
          brokerPercent: data.calcType === "FLAT_AMOUNT" ? null : (data.brokerPercent ? Number(data.brokerPercent) : null),
          flatAmount: data.calcType === "FLAT_AMOUNT" ? (Number(data.flatAmount) || 0) : null,
          isActive: data.isActive,
          propertyId: initialData.property?.id,
        },
      });
      setOpen(false);
      onSuccess?.();
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline" size="sm">Edit Commission</Button>}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Commission Setting</DialogTitle>
          <DialogDescription>
            Modify commission settings for {currentCalcType === "GUESTHOUSE" && initialData.property?.name ? initialData.property.name : "the platform"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Property (read-only) */}
          {initialData.type === "GUESTHOUSE" && initialData.property?.name && (
            <div className="space-y-1">
              <Label>Property</Label>
              <div className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">{initialData.property.name}</div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <Label>Commission Name</Label>
            <Input placeholder="e.g., Platform Standard Commission" {...register("name")} />
          </div>

          {/* Calc type toggle */}
          <div className="space-y-2">
            <Label>Calculation Type</Label>
            <div className="flex gap-2">
              {[{ value: "PERCENTAGE", label: "By Percentage (%)" }, { value: "FLAT_AMOUNT", label: "Flat Amount (ETB)" }].map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setValue("calcType", opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    currentCalcType === opt.value
                      ? "bg-primary/90 text-primary-foreground border-primary"
                      : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flat amount */}
          {isCurrentFlat && (
            <div className="space-y-1">
              <Label>Flat Amount (ETB) <span className="text-destructive">*</span></Label>
              <Input type="number" step="0.01" placeholder="e.g., 500" {...register("flatAmount")} />
            </div>
          )}

          {/* Platform % */}
          {!isCurrentFlat && (
            <div className="space-y-1">
              <Label>Platform Percentage (%)</Label>
              <Input type="number" step="0.01" placeholder="e.g., 15.5" {...register("platformPercent")} />
            </div>
          )}

          {/* Broker % */}
          {!isCurrentFlat && (
            <div className="space-y-1">
              <Label>Broker Percentage (%) <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <Input type="number" step="0.01" placeholder="e.g., 5.0" {...register("brokerPercent")} />
            </div>
          )}

          {/* Description (read-only) */}
          {initialData.description && (
            <div className="space-y-1">
              <Label>Description</Label>
              <Input disabled value={initialData.description} className="opacity-60" />
            </div>
          )}

          {/* Active */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
            <div>
              <Label className="text-base">Active Status</Label>
              <p className="text-sm text-muted-foreground">Enable or disable this commission</p>
            </div>
            <Switch checked={isActive} onCheckedChange={v => setValue("isActive", v)} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); setOpen(false); }} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Commission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
