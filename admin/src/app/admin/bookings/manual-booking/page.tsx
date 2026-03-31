"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Loader2,
  ArrowLeft,
  Users,
  CreditCard,
  Home,
  User,
} from "lucide-react";
import { format, eachDayOfInterval } from "date-fns";
import Link from "next/link";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ManualBookingFormData, manualBookingSchema } from "@/schemas";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useRouter } from "next/navigation";
import { useManualBookMutation } from "@/hooks/api/use-bookings";
import PropertyRoomSelect from "./property-room-selector";
import { TakenDatesList } from "./taken-date-list";

export default function ManualBookingPage() {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [takenDates, setTakenDates] = useState<string[]>([]);
  const [bookedRanges, setBookedRanges] = useState<{ checkIn: Date; checkOut: Date }[]>([]);

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

  const router = useRouter();
  const manualBookMutation = useManualBookMutation();

  // Build set of booked dates for disabling in calendar
  const bookedDateSet = new Set<string>();
  bookedRanges.forEach(({ checkIn, checkOut }) => {
    try {
      eachDayOfInterval({ start: checkIn, end: checkOut }).forEach((d) =>
        bookedDateSet.add(d.toISOString().split("T")[0])
      );
    } catch {}
  });
  const isBookedDate = (date: Date) => bookedDateSet.has(date.toISOString().split("T")[0]);
  const isPastDate = (date: Date) => { const t = new Date(); t.setHours(0,0,0,0); return date < t; };

  const basePrice = watch("basePrice");
  const taxAmount = watch("taxAmount");
  const discount = watch("discount");
  const totalAmount = watch("totalAmount");

  // Auto-calculate total amount (tax and discount are percentages)
  const calculateTotal = () => {
    const base = Number(basePrice) || 0;
    const taxPct = Number(taxAmount) || 0;
    const discPct = Number(discount) || 0;
    const taxValue = base * (taxPct / 100);
    const discValue = base * (discPct / 100);
    const total = base + taxValue - discValue;
    setValue("totalAmount", Math.max(0, Math.round(total * 100) / 100));
  };

  const handleFormSubmit = async (data: ManualBookingFormData) => {
    // Simulate API call - replace with actual API call
    setTakenDates([]);
    manualBookMutation.mutateAsync(
      { bookData: data },
      {
        onSuccess: () => {
          router.back();
          reset();
        },
        onError: (err: any) => {
          if (err.response && err.response.status === 400) {
            // Backend returned overlapping dates
            const data = err.response.data;
            console.log("Taken Dates:", data.takenDates);
            setTakenDates(data.takenDates || []);
          } else {
            console.error(err);
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      {/* Header */}
      <div className="mb-6 px-4">
        <Link href={"/admin/bookings"}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className=" px-4">
        <div className="">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Room Selection */}
                <Card>
                  <PropertyRoomSelect
                    errors={errors}
                    setValue={setValue}
                    onBookedRangesChange={setBookedRanges}
                  />
                </Card>

                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <CardTitle>Guest Information</CardTitle>
                    </div>
                    <CardDescription>
                      Enter the guest's contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="guestName">
                        Full Name <span className="text-destructive">*</span>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestPhone">
                          Phone Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="guestPhone"
                          placeholder="+1 234 567 8900"
                          {...register("guestPhone")}
                          className={cn(
                            errors.guestPhone && "border-destructive"
                          )}
                        />
                        {errors.guestPhone && (
                          <p className="text-sm text-destructive">
                            {errors.guestPhone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestEmail">Email Address</Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          placeholder="john.doe@example.com"
                          {...register("guestEmail")}
                          className={cn(
                            errors.guestEmail && "border-destructive"
                          )}
                        />
                        {errors.guestEmail && (
                          <p className="text-sm text-destructive">
                            {errors.guestEmail.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle>Booking Details</CardTitle>
                    </div>
                    <CardDescription>
                      Set the check-in, check-out dates and number of guests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">
                          Check-in Date{" "}
                          <span className="text-destructive">*</span>
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
                              disabled={(date) => isPastDate(date) || isBookedDate(date)}
                              modifiers={{ booked: isBookedDate }}
                              modifiersClassNames={{ booked: "line-through text-red-400 opacity-60" }}
                              onSelect={(date) => {
                                setCheckInDate(date);
                                if (date) setValue("checkIn", date.toISOString());
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
                        <Label htmlFor="checkOut">
                          Check-out Date{" "}
                          <span className="text-destructive">*</span>
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
                              disabled={(date) =>
                                isPastDate(date) || isBookedDate(date) || (checkInDate ? date <= checkInDate : false)
                              }
                              modifiers={{ booked: isBookedDate }}
                              modifiersClassNames={{ booked: "line-through text-red-400 opacity-60" }}
                              onSelect={(date) => {
                                setCheckOutDate(date);
                                if (date) setValue("checkOut", date.toISOString());
                              }}
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
                        <Label htmlFor="guests">
                          Guests <span className="text-destructive">*</span>
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
                  </CardContent>
                </Card>

                {/* Payment Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <CardTitle>Payment Details</CardTitle>
                    </div>
                    <CardDescription>
                      Enter pricing and payment information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="basePrice">
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
                          className={cn(
                            errors.basePrice && "border-destructive"
                          )}
                        />
                        {errors.basePrice && (
                          <p className="text-sm text-destructive">
                            {errors.basePrice.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxAmount">Tax (%)</Label>
                        <Input
                          id="taxAmount"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...register("taxAmount", {
                            valueAsNumber: true,
                            onChange: calculateTotal,
                          })}
                          className={cn(errors.taxAmount && "border-destructive")}
                        />
                        {errors.taxAmount && (
                          <p className="text-sm text-destructive">{errors.taxAmount.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount (%)</Label>
                        <Input
                          id="discount"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          placeholder="0"
                          {...register("discount", {
                            valueAsNumber: true,
                            onChange: calculateTotal,
                          })}
                          className={cn(errors.discount && "border-destructive")}
                        />
                        {errors.discount && (
                          <p className="text-sm text-destructive">{errors.discount.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
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

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                          onValueChange={(value) =>
                            setValue(
                              "paymentMethod",
                              value as "CASH" | "ONLINE"
                            )
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
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-16">
                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                      <CardDescription>Review the total amount</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Base Price
                          </span>
                          <span className="font-medium">
                            {basePrice ? (
                              <FormatedAmount amount={basePrice} />
                            ) : (
                              <FormatedAmount amount={0} />
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax ({taxAmount || 0}%)</span>
                          <span className="font-medium">
                            <FormatedAmount amount={(Number(basePrice) || 0) * ((Number(taxAmount) || 0) / 100)} />
                          </span>
                        </div>
                        {discount && Number(discount) > 0 ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Discount ({discount}%)</span>
                            <span className="font-medium text-green-600">
                              -<FormatedAmount amount={(Number(basePrice) || 0) * ((Number(discount) || 0) / 100)} />
                            </span>
                          </div>
                        ) : null}
                        <Separator />
                        <div className="flex justify-between">
                          <span className="font-semibold text-lg">
                            Total Amount
                          </span>
                          <span className="font-bold text-2xl text-primary">
                            {totalAmount ? (
                              <FormatedAmount amount={totalAmount} />
                            ) : (
                              <FormatedAmount amount={0} />
                            )}
                          </span>
                        </div>
                      </div>

                      <TakenDatesList takenDates={takenDates} />

                      <Separator />

                      <div className="space-y-3 pt-2">
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={manualBookMutation.isPending}
                        >
                          {manualBookMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Booking...
                            </>
                          ) : (
                            "Create Booking"
                          )}
                        </Button>
                        <Link href="/" className="block">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-transparent"
                            disabled={manualBookMutation.isPending}
                          >
                            Cancel
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
