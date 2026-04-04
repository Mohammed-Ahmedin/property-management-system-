"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAddPropertyCommision, useAddPlatformCommision } from "@/hooks/api/use-commision";
import {
  useAddPropertyMutation,
  useGetProtectedPropertyForListQuery,
} from "@/hooks/api/use-property";

const DUMMY_GUEST_HOUSES = [
  { id: "gh-001", name: "Sunset Villa Resort" },
  { id: "gh-002", name: "Mountain View Lodge" },
  { id: "gh-003", name: "Oceanfront Paradise" },
  { id: "gh-004", name: "Downtown Boutique Hotel" },
  { id: "gh-005", name: "Lakeside Retreat" },
  { id: "gh-006", name: "Garden Oasis Inn" },
  { id: "gh-007", name: "Riverside Manor" },
];

const commissionSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  role: yup.string().oneOf(["PLATFORM", "BROKER", "OWNER", "STAFF"], "Invalid role").required("Role is required"),
  calcType: yup.string().oneOf(["PERCENTAGE", "FLAT_AMOUNT"]).default("PERCENTAGE"),
  platformPercent: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0).max(100).typeError("Must be a valid number")
    .when(["role", "calcType"], {
      is: (role: string, calcType: string) => role !== "BROKER" && calcType !== "FLAT_AMOUNT",
      then: (s) => s.required("Percentage is required"),
      otherwise: (s) => s.nullable(),
    }),
  flatAmount: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0).typeError("Must be a valid number")
    .when("calcType", {
      is: "FLAT_AMOUNT",
      then: (s) => s.required("Amount is required"),
      otherwise: (s) => s.nullable(),
    }),
  brokerPercent: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .min(0).max(100).typeError("Must be a valid number")
    .when(["role", "calcType"], {
      is: (role: string, calcType: string) => role === "BROKER" && calcType !== "FLAT_AMOUNT",
      then: (s) => s.required("Broker percentage is required"),
      otherwise: (s) => s.nullable(),
    }),
  type: yup.string().oneOf(["PLATFORM", "GUESTHOUSE"]).required("Commission type is required"),
  propertyId: yup.string().nullable(),
  isActive: yup.boolean().required(),
});

type CommissionFormData = yup.InferType<typeof commissionSchema>;

interface CreateCommissionModalProps {
  onSubmit?: (data: CommissionFormData) => Promise<void> | void;
}

export function CreateCommissionModal({
  onSubmit,
}: CreateCommissionModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [propertyOpen, setPropertyOpen] = useState(false);
  const addPlatformCommision = useAddPlatformCommision();
  const addPropertyCommision = useAddPropertyCommision();

  const { data: propertiesForList, isLoading: isPropertiesLoading } =
    useGetProtectedPropertyForListQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<CommissionFormData>({
    resolver: yupResolver(commissionSchema as any),
    defaultValues: {
      name: "",
      role: "PLATFORM",
      calcType: "PERCENTAGE",
      brokerPercent: null,
      flatAmount: null,
      type: "PLATFORM",
      propertyId: null,
      isActive: true,
    },
  });

  const commissionType = watch("type");
  const isActive = watch("isActive");
  const selectedPropertyId = watch("propertyId");
  const selectedRole = watch("role");
  const calcType = watch("calcType" as any) || "PERCENTAGE";

  // Find selected property name from REAL data
  const selectedPropertyName = propertiesForList?.find(
    (h) => h.id === selectedPropertyId
  )?.name || null;

  const handleFormSubmit = async (data: CommissionFormData) => {
    try {
      setIsSubmitting(true);

      console.log({ data });

      if (data.type === "PLATFORM") {
        await addPlatformCommision.mutateAsync({ data });
      } else {
        await addPropertyCommision.mutateAsync({ data });
      }
      reset();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create commission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProperty = DUMMY_GUEST_HOUSES.find(
    (gh) => gh.id === selectedPropertyId
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Commission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl">
            Create Commission Setting
          </DialogTitle>
          <DialogDescription>
            Configure commission percentages and settings for the platform or specific properties.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit as any)}
          className="flex-1 overflow-y-auto space-y-5 pr-1"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Commission Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Platform Standard Commission"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Applies to Role <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("role")}
              onValueChange={(value) => setValue("role", value as any, { shouldValidate: true })}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLATFORM">Platform</SelectItem>
                <SelectItem value="BROKER">Broker</SelectItem>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {/* Commission Type */}
          <div className="space-y-2">
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
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {commissionType === "GUESTHOUSE" && (
            <div className="space-y-2">
              <Label htmlFor="propertyId">Property <span className="text-muted-foreground text-xs">(optional — leave blank to apply to all)</span></Label>
              <Controller
                name="propertyId"
                control={control}
                render={({ field }) => (
                  <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={propertyOpen}
                        className="w-full justify-between font-normal bg-transparent"
                      >
                        {selectedPropertyName || "Select a property (optional)..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search properties..." />
                        <CommandList>
                          <CommandEmpty>No property found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="__none__"
                              onSelect={() => {
                                setValue("propertyId", null, { shouldValidate: true });
                                setPropertyOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", !selectedPropertyId ? "opacity-100" : "opacity-0")} />
                              All properties (no specific property)
                            </CommandItem>
                            {isPropertiesLoading ? null : propertiesForList?.map((house) => (
                              <CommandItem
                                key={house.id}
                                value={house.name}
                                onSelect={() => {
                                  setValue("propertyId", house.id, { shouldValidate: true });
                                  setPropertyOpen(false);
                                }}
                              >
                                <Check className={cn("mr-2 h-4 w-4", selectedPropertyId === house.id ? "opacity-100" : "opacity-0")} />
                                {house.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          )}

          {/* Calculation Type Toggle */}
          <div className="space-y-2">
            <Label>Commission Calculation Type <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              {[
                { value: "PERCENTAGE", label: "By Percentage (%)" },
                { value: "FLAT_AMOUNT", label: "Flat Amount (ETB)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("calcType" as any, opt.value, { shouldValidate: true })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    calcType === opt.value
                      ? "bg-primary/90 text-primary-foreground border-primary shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flat Amount — shown when calcType = FLAT_AMOUNT */}
          {calcType === "FLAT_AMOUNT" && (
            <div className="space-y-2">
              <Label htmlFor="flatAmount">
                Flat Amount (ETB) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="flatAmount"
                type="number"
                step="0.01"
                placeholder="e.g., 500"
                {...register("flatAmount" as any)}
              />
              {(errors as any).flatAmount && (
                <p className="text-sm text-destructive">{(errors as any).flatAmount.message}</p>
              )}
            </div>
          )}

          {/* Owner/Platform Percent — shown for OWNER and PLATFORM roles */}
          {calcType !== "FLAT_AMOUNT" && (watch("role") === "OWNER" || watch("role") === "PLATFORM" || watch("role") === "STAFF") && (
            <div className="space-y-2">
              <Label htmlFor="platformPercent">
                {watch("role") === "OWNER" ? "Owner Percentage (%)" : "Platform Percentage (%)"}{" "}
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
                <p className="text-sm text-destructive">{errors.platformPercent.message}</p>
              )}
            </div>
          )}

          {/* Broker Percent — shown for BROKER and PLATFORM roles */}
          {calcType !== "FLAT_AMOUNT" && (watch("role") === "BROKER" || watch("role") === "PLATFORM") && (
            <div className="space-y-2">
              <Label htmlFor="brokerPercent">
                Broker Percentage (%)
                {watch("role") === "BROKER" && <span className="text-destructive"> *</span>}
              </Label>
              <Input
                id="brokerPercent"
                type="number"
                step="0.01"
                placeholder="e.g., 5.0"
                {...register("brokerPercent")}
              />
              {errors.brokerPercent && (
                <p className="text-sm text-destructive">{errors.brokerPercent.message}</p>
              )}
              {watch("role") === "PLATFORM" && (
                <p className="text-xs text-muted-foreground">Optional broker commission for platform-level setting</p>
              )}
            </div>
          )}

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
          <div className="flex justify-end gap-3 pt-2 pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { reset(); setOpen(false); }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Commission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
