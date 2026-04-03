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
      brokerPercent: null,
      type: "PLATFORM",
      propertyId: null,
      isActive: true,
    },
  });

  const commissionType = watch("type");
  const isActive = watch("isActive");
  const selectedPropertyId = watch("propertyId");

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Create Commission Setting
          </DialogTitle>
          <DialogDescription>
            Configure commission percentages and settings for the platform or a
            specific property.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit as any)}
          className="space-y-6"
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
              <Label htmlFor="propertyId">Property</Label>
              <Controller
                name="propertyId"
                control={control}
                render={({ field }) => (
                  <Popover
                    open={propertyOpen}
                    onOpenChange={setPropertyOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={propertyOpen}
                        className="w-full justify-between font-normal bg-transparent"
                      >
                        {selectedProperty
                          ? selectedProperty.name
                          : "Select a property..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search properties..." />
                        <CommandList>
                          <CommandEmpty>No property found.</CommandEmpty>
                          <CommandGroup>
                            {isPropertiesLoading
                              ? ""
                              : propertiesForList?.map((house) => (
                                  <CommandItem
                                    key={house.id}
                                    value={house.name}
                                    onSelect={() => {
                                      setValue("propertyId", house.id, {
                                        shouldValidate: true,
                                      });
                                      setPropertyOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedPropertyId === house.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
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
              {errors.propertyId && (
                <p className="text-sm text-destructive">
                  {errors.propertyId.message}
                </p>
              )}
            </div>
          )}

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
              Create Commission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
