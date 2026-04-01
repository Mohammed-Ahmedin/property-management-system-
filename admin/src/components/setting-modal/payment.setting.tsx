"use client";

import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  CreditCard,
  Hash,
  User,
  AlertCircle,
  Info,
} from "lucide-react";
import { useCreateSubAccountMutation } from "@/hooks/api/use-payment";
import { useGetSubaccountDetail } from "@/hooks/api/use-payment";
import { BankSelector } from "./bank-selector";
import { Spinner } from "../ui/spinner";
import { useAuthSession } from "@/hooks/use-auth-session";

// Validation schema
const chapaSubAccountSchema = yup.object().shape({
  businessName: yup.string().optional(),
  accountName: yup
    .string()
    .min(2, "Account name must be at least 2 characters")
    .max(100)
    .required("Account name is required"),
  bankCode: yup.number().required("Bank code is required"),
  accountNumber: yup
    .string()
    .required("Account number is required")
    .matches(/^[0-9]+$/, "Account number must contain only numbers")
    .min(10, "Account number must be at least 10 digits")
    .max(20, "Account number must not exceed 20 digits"),
});

type ChapaSubAccountForm = yup.InferType<typeof chapaSubAccountSchema>;

const PaymentSetting = ({
  setIsSettingsModalOpen,
}: {
  setIsSettingsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<ChapaSubAccountForm | null>(
    null
  );

  const { role: userRole } = useAuthSession();
  const canAccessPayments = ["OWNER", "BROKER", "STAFF"].includes(userRole ?? "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
  } = useForm<ChapaSubAccountForm>({
    resolver: yupResolver(chapaSubAccountSchema as any),
  });

  const {
    data: subaccount,
    isLoading,
    isError,
    refetch,
  } = useGetSubaccountDetail(canAccessPayments);
  const createSubAccountMutation = useCreateSubAccountMutation();
  const bankCodeWatch = watch("bankCode");
  const onSubmitForm = async (data: ChapaSubAccountForm) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmAdd = async () => {
    const data = getValues();

    await createSubAccountMutation.mutateAsync({
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      bankCode: data.bankCode,
      businessName: data.businessName,
    });
    // setPendingData(null);
    // setShowConfirmDialog(false);
    refetch(); // refetch after adding
  };

  const handleCancelAdd = () => {
    setPendingData(null);
    setShowConfirmDialog(false);
  };

  const handleEditRequest = () => {
    // implement request edit logic here
  };

  if (!canAccessPayments)
    return (
      <Alert>
        <AlertDescription>
          Payment settings are only available for Owners, Brokers, and Admins.
        </AlertDescription>
      </Alert>
    );

  if (isLoading)
    return (
      <div className="py-40 flex justify-center items-center">
        <Spinner className="size-6" />
      </div>
    );

  if (isError)
    return (
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Once submitted, you won't be able to edit these details without
            admin approval.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="businessName" className="text-sm font-medium">
            Business Name{" "}
            <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="businessName"
              {...register("businessName")}
              placeholder="Enter your business name"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountName" className="text-sm font-medium">
            Account Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="accountName"
              {...register("accountName")}
              placeholder="Enter account holder name"
              className="pl-10"
            />
          </div>
          {errors.accountName && (
            <p className="text-sm text-destructive">{errors.accountName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankCode" className="text-sm font-medium">
            Bank Code <span className="text-destructive">*</span>
          </Label>
          <BankSelector code={bankCodeWatch} setValue={setValue} />
          {errors.bankCode && (
            <p className="text-sm text-destructive">{errors.bankCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber" className="text-sm font-medium">
            Account Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="accountNumber"
              {...register("accountNumber")}
              placeholder="Enter account number"
              className="pl-10 font-mono"
            />
          </div>
          {errors.accountNumber && (
            <p className="text-sm text-destructive">{errors.accountNumber.message}</p>
          )}
        </div>

        <div className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setIsSettingsModalOpen(false)}>Cancel</Button>
          <Button type="button" disabled={isSubmitting} onClick={() => setShowConfirmDialog(true)}>Add now</Button>
        </div>
      </form>
    );

  return (
    <div className="space-y-6 py-4">
      {subaccount ? (
        // Show saved subaccount
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="h-5 w-5" />
              {subaccount.type == "PLATFORM"
                ? "Registered Platform Subaccount"
                : "Registered Subaccount"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subaccount.businessName && (
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Business Name
                  </p>
                  <p className="text-base font-medium">
                    {subaccount.businessName}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Account Name
                </p>
                <p className="text-base font-medium">
                  {subaccount.accountName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Bank Code
                </p>
                <p className="text-base font-medium font-mono">
                  {subaccount.bankCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Account Number
                </p>
                <p className="text-base font-medium font-mono">
                  {subaccount.accountNumber}
                </p>
              </div>
            </div>
            {subaccount.type == "PLATFORM" ? (
              <>
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This platform subaccount can be edit
                  </AlertDescription>
                </Alert>

                <Button
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                >
                  Edit Now
                </Button>
              </>
            ) : (
              <>
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Your subaccount has been registered. To make changes, please
                    contact an administrator.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleEditRequest}
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                >
                  Request Edit Access
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        // Show form
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Once submitted, you won't be able to edit these details without
              admin approval.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-sm font-medium">
              Business Name{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="businessName"
                {...register("businessName")}
                placeholder="Enter your business name"
                className="pl-10"
              />
            </div>
            {errors.businessName && (
              <p className="text-sm text-destructive">
                {errors.businessName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName" className="text-sm font-medium">
              Account Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="accountName"
                {...register("accountName")}
                placeholder="Enter account holder name"
                className="pl-10"
              />
            </div>
            {errors.accountName && (
              <p className="text-sm text-destructive">
                {errors.accountName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankCode" className="text-sm font-medium">
              Bank Code <span className="text-destructive">*</span>
            </Label>
            <BankSelector code={bankCodeWatch} setValue={setValue} />
            {errors.bankCode && (
              <p className="text-sm text-destructive">
                {errors.bankCode.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="text-sm font-medium">
              Account Number <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="accountNumber"
                {...register("accountNumber")}
                placeholder="Enter account number"
                className="pl-10 font-mono"
              />
            </div>
            {errors.accountNumber && (
              <p className="text-sm text-destructive">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          <div className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSettingsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={() => setShowConfirmDialog(true)}
            >
              Add now
            </Button>
          </div>
        </form>
      )}

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                You are about to register the following subaccount details. Once
                confirmed, you won't be able to edit them without admin
                approval.
              </p>
              {pendingData && (
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  {pendingData.businessName && (
                    <p>
                      <span className="font-medium">Business Name:</span>{" "}
                      {pendingData.businessName}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Account Name:</span>{" "}
                    {pendingData.accountName}
                  </p>
                  <p>
                    <span className="font-medium">Bank Code:</span>{" "}
                    {pendingData.bankCode}
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span>{" "}
                    {pendingData.accountNumber}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAdd}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleConfirmAdd}
              disabled={createSubAccountMutation.isPending}
            >
              {createSubAccountMutation.isPending
                ? "Adding..."
                : "Yes, Add Subaccount"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PaymentSetting;
