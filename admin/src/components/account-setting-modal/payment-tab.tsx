"use client";

import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { useCreateSubAccountMutation } from "@/hooks/api/use-payment";
import { useAuthSession } from "@/hooks/use-auth-session";

export function PaymentTab() {
  const { role } = useAuthSession();
  const createSubAccount = useCreateSubAccountMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    accountName: string;
    accountNumber: string;
    bankCode: string;
    businessName: string;
  }>();

  const onSubmit = async (data: any) => {
    createSubAccount.mutate({
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      bankCode: Number(data.bankCode),
      businessName: data.businessName || data.accountName,
    }, { onSuccess: () => reset() });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Payment Settings</h3>
        <p className="text-sm text-muted-foreground">
          Register your bank account to receive payments
        </p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Add your bank account details to receive your share of payments. Fields marked * are required.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="accountName">Account Holder Name <span className="text-destructive">*</span></Label>
          <Input id="accountName" placeholder="Full name on bank account" {...register("accountName", { required: true })} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="accountNumber">Account Number <span className="text-destructive">*</span></Label>
          <Input id="accountNumber" placeholder="Your bank account number" {...register("accountNumber", { required: true })} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bankCode">Bank Code <span className="text-destructive">*</span></Label>
          <Input id="bankCode" placeholder="e.g. 001 for CBE" {...register("bankCode", { required: true })} />
          <p className="text-xs text-muted-foreground">Enter the numeric code for your bank (e.g. 001 for CBE, 014 for Awash)</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="businessName">Business Name <span className="text-muted-foreground text-xs">(Optional)</span></Label>
          <Input id="businessName" placeholder="Your business or trading name" {...register("businessName")} />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" disabled={createSubAccount.isPending}>
            {createSubAccount.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Payment Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}

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
