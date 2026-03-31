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

