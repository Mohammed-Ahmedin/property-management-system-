"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { subAccountSchema } from "./subaccount-schema";
import { ChapaSubAccount, SubAccountType } from "@/types/subaccount";

export function PaymentTab() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChapaSubAccount>({
    resolver: yupResolver(subAccountSchema as any),
    defaultValues: {
      subAccountType: SubAccountType.OWNER,
    },
  });

  const subAccountType = watch("subAccountType");

  const onSubmit = async (data: ChapaSubAccount) => {
    console.log("[v0] Subaccount form data:", data);
    // Handle form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Subaccount registered successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Payment Settings
        </h3>
        <p className="text-sm text-muted-foreground">
          Register your subaccount for payment processing
        </p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Complete your subaccount registration to start receiving payments. All
          fields marked with * are required.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="businessName">
            Business Name{" "}
            <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="businessName"
            {...register("businessName")}
            placeholder="Enter your business name"
            className={errors.businessName ? "border-destructive" : ""}
          />
          {errors.businessName && (
            <p className="text-sm text-destructive">
              {errors.businessName.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="accountName">
            Account Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="accountName"
            {...register("accountName")}
            placeholder="Enter account holder name"
            className={errors.accountName ? "border-destructive" : ""}
          />
          {errors.accountName && (
            <p className="text-sm text-destructive">
              {errors.accountName.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bankCode">
            Bank Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="bankCode"
            {...register("bankCode")}
            placeholder="Enter bank code (e.g., 001)"
            className={errors.bankCode ? "border-destructive" : ""}
          />
          {errors.bankCode && (
            <p className="text-sm text-destructive">
              {errors.bankCode.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter the numeric code for your bank
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="accountNumber">
            Account Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="accountNumber"
            {...register("accountNumber")}
            placeholder="Enter your account number"
            className={errors.accountNumber ? "border-destructive" : ""}
          />
          {errors.accountNumber && (
            <p className="text-sm text-destructive">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="subAccountType">
            Subaccount Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={subAccountType}
            onValueChange={(value) =>
              setValue("subAccountType", value as SubAccountType, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger
              id="subAccountType"
              className={errors.subAccountType ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select subaccount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SubAccountType.BROKER}>Broker</SelectItem>
              <SelectItem value={SubAccountType.OWNER}>Owner</SelectItem>
              <SelectItem value={SubAccountType.PLATFORM}>Platform</SelectItem>
            </SelectContent>
          </Select>
          {errors.subAccountType && (
            <p className="text-sm text-destructive">
              {errors.subAccountType.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Choose the type that best describes your account
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Subaccount"}
          </Button>
        </div>
      </form>
    </div>
  );
}
