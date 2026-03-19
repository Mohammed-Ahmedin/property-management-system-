"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ManualBookingFormData, manualBookingSchema } from "@/schemas";

interface ManualBookingModalProps {
  trigger?: React.ReactNode;
  onSubmit: (data: ManualBookingFormData) => Promise<void>;
  rooms?: Array<{ id: string; name: string }>;
  properties?: Array<{ id: string; name: string }>;
}

export function ManualBookingModal({
  trigger,
  onSubmit,
  properties = [],
}: ManualBookingModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ManualBookingFormData>({
    resolver: zodResolver(manualBookingSchema as any),
    defaultValues: {
      currency: "ETB",
      paymentMethod: "CASH",
      guests: 1,
      discount: 0,
      taxAmount: 0,
    },
  });

  const basePrice = watch("basePrice");
  const taxAmount = watch("taxAmount");
  const discount = watch("discount");

  // Auto-calculate total amount
  const calculateTotal = () => {
    const base = Number(basePrice) || 0;
    const tax = Number(taxAmount) || 0;
    const disc = Number(discount) || 0;
    const total = base + tax - disc;
    setValue("totalAmount", Math.max(0, total));
  };

  const handleFormSubmit = async (data: ManualBookingFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setOpen(false);
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Create Manual Booking</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Manual Booking
          </DialogTitle>
          <DialogDescription>
            Create a new booking manually by filling in the guest and booking
            details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Room and Property Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-sm font-medium">
                  Room Id <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="roomId"
                  placeholder="John Doe"
                  {...register("guestName")}
                  className={cn(errors.roomId && "border-destructive")}
                />

                {errors.roomId && (
                  <p className="text-sm text-destructive">
                    {errors.roomId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyId" className="text-sm font-medium">
                Property
              </Label>
              <Select
                onValueChange={(value) => setValue("propertyId", value)}
                defaultValue=""
              >
                <SelectTrigger id="propertyId">
                  <SelectValue placeholder="Select property (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {properties.length > 0 ? (
                    properties.map((house) => (
                      <SelectItem key={house.id} value={house.id}>
                        {house.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="demo-house-id">
                      Demo Property
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="text-sm font-medium">
                  Guest Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guestName"
                  placeholder="John Doe"
                  {...register("guestName")}
                  className={cn(errors.guestName && "border-destructive")}
                />
                {errors.guestName && (
                  <p className="text-sm text-destructive">
                    {errors.guestName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestPhone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guestPhone"
                  placeholder="+1 234 567 8900"
                  {...register("guestPhone")}
                  className={cn(errors.guestPhone && "border-destructive")}
                />
                {errors.guestPhone && (
                  <p className="text-sm text-destructive">
                    {errors.guestPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="guestEmail" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register("guestEmail")}
                  className={cn(errors.guestEmail && "border-destructive")}
                />
                {errors.guestEmail && (
                  <p className="text-sm text-destructive">
                    {errors.guestEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="text-sm font-medium">
                  Check-in Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkInDate && "text-muted-foreground",
                        errors.checkIn && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? (
                        format(checkInDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={(date) => {
                        setCheckInDate(date);
                        if (date) {
                          setValue("checkIn", date.toISOString());
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkIn && (
                  <p className="text-sm text-destructive">
                    {errors.checkIn.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOut" className="text-sm font-medium">
                  Check-out Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !checkOutDate && "text-muted-foreground",
                        errors.checkOut && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? (
                        format(checkOutDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={(date) => {
                        setCheckOutDate(date);
                        if (date) {
                          setValue("checkOut", date.toISOString());
                        }
                      }}
                      disabled={(date) =>
                        checkInDate ? date <= checkInDate : false
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkOut && (
                  <p className="text-sm text-destructive">
                    {errors.checkOut.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests" className="text-sm font-medium">
                  Number of Guests <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  placeholder="1"
                  {...register("guests", { valueAsNumber: true })}
                  className={cn(errors.guests && "border-destructive")}
                />
                {errors.guests && (
                  <p className="text-sm text-destructive">
                    {errors.guests.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Payment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice" className="text-sm font-medium">
                  Base Price <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.00"
                  {...register("basePrice", {
                    valueAsNumber: true,
                    onChange: calculateTotal,
                  })}
                  className={cn(errors.basePrice && "border-destructive")}
                />
                {errors.basePrice && (
                  <p className="text-sm text-destructive">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAmount" className="text-sm font-medium">
                  Tax Amount
                </Label>
                <Input
                  id="taxAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("taxAmount", {
                    valueAsNumber: true,
                    onChange: calculateTotal,
                  })}
                  className={cn(errors.taxAmount && "border-destructive")}
                />
                {errors.taxAmount && (
                  <p className="text-sm text-destructive">
                    {errors.taxAmount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount" className="text-sm font-medium">
                  Discount
                </Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("discount", {
                    valueAsNumber: true,
                    onChange: calculateTotal,
                  })}
                  className={cn(errors.discount && "border-destructive")}
                />
                {errors.discount && (
                  <p className="text-sm text-destructive">
                    {errors.discount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalAmount" className="text-sm font-medium">
                  Total Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.00"
                  {...register("totalAmount", { valueAsNumber: true })}
                  className={cn(
                    "font-semibold",
                    errors.totalAmount && "border-destructive"
                  )}
                  readOnly
                />
                {errors.totalAmount && (
                  <p className="text-sm text-destructive">
                    {errors.totalAmount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Currency
                </Label>
                <Select
                  onValueChange={(value) => setValue("currency", value)}
                  defaultValue="ETB"
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">ETB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod" className="text-sm font-medium">
                  Payment Method
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("paymentMethod", value as "CASH" | "ONLINE")
                  }
                  defaultValue="CASH"
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="ONLINE">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
