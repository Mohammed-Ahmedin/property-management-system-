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
  const [vatMode, setVatMode] = useState<"with" | "without">("with");
  const [discountMode, setDiscountMode] = useState<"amount" | "percentage">("percentage");

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

  // Auto-calculate total amount
  const calculateTotal = (overrides?: { base?: number; disc?: number; vatM?: "with" | "without"; discM?: "amount" | "percentage" }) => {
    const base = overrides?.base !== undefined ? overrides.base : (Number(basePrice) || 0);
    const currentVatMode = overrides?.vatM ?? vatMode;
    const currentDiscMode = overrides?.discM ?? discountMode;
    const rawDisc = overrides?.disc !== undefined ? overrides.disc : (Number(discount) || 0);
    const taxValue = currentVatMode === "with" ? base * 0.15 : 0;
    const discValue = currentDiscMode === "percentage" ? base * (rawDisc / 100) : rawDisc;
    const total = base + taxValue - discValue;
    setValue("taxAmount", currentVatMode === "with" ? 15 : 0);
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
                {/* Payment Details */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <CardTitle>Payment Details</CardTitle>
                    </div>
                    <CardDescription>Enter pricing and payment information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="basePrice">Base Price <span className="text-destructive">*</span></Label>
                      <Input id="basePrice" type="number" step="0.01" min="0" placeholder="100.00"
                        {...register("basePrice", { valueAsNumber: true, onChange: (e) => calculateTotal({ base: Number(e.target.value) }) })}
                        className={cn(errors.basePrice && "border-destructive")} />
                      {errors.basePrice && <p className="text-sm text-destructive">{errors.basePrice.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>VAT</Label>
                      <div className="flex gap-3">
                        {(["with", "without"] as const).map((v) => (
                          <label key={v} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${vatMode === v ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                            <input type="radio" name="vat" value={v} checked={vatMode === v}
                              onChange={() => { setVatMode(v); calculateTotal({ vatM: v }); }} className="accent-primary" />
                            <span className="text-sm font-medium">{v === "with" ? "With VAT (15%)" : "Without VAT"}</span>
                          </label>
                        ))}
                      </div>
                      {vatMode === "with" && <p className="text-xs text-muted-foreground">15% VAT will be automatically applied.</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Discount</Label>
                      <div className="flex gap-3 mb-2">
                        {(["percentage", "amount"] as const).map((d) => (
                          <label key={d} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${discountMode === d ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                            <input type="radio" name="discountMode" value={d} checked={discountMode === d}
                              onChange={() => { setDiscountMode(d); setValue("discount", 0); calculateTotal({ disc: 0, discM: d }); }} className="accent-primary" />
                            <span className="text-sm font-medium">{d === "percentage" ? "By Percentage (%)" : "By Amount (ETB)"}</span>
                          </label>
                        ))}
                      </div>
                      <Input type="number" step={discountMode === "percentage" ? "0.1" : "1"} min="0"
                        max={discountMode === "percentage" ? "100" : undefined}
                        placeholder={discountMode === "percentage" ? "e.g. 10 for 10%" : "e.g. 50 for ETB 50"}
                        {...register("discount", { valueAsNumber: true, onChange: (e) => calculateTotal({ disc: Number(e.target.value) }) })}
                        className={cn(errors.discount && "border-destructive")} />
                      {errors.discount && <p className="text-sm text-destructive">{errors.discount.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select onValueChange={(value) => setValue("currency", value)} defaultValue="ETB">
                          <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="ETB">ETB</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select onValueChange={(value) => setValue("paymentMethod", value as "CASH" | "ONLINE")} defaultValue="CASH">
                          <SelectTrigger id="paymentMethod"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CASH">Cash</SelectItem>
                            <SelectItem value="ONLINE">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
