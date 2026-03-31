"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  Users,
  ChevronLeft,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useNavigate } from "react-router-dom";
import { useBookNowMutation } from "@/hooks/api/use-bookings";
import { Spinner } from "@/components/ui/spinner";
import DateRangePicker from "./date-picker";

interface Service {
  name: string;
  id: string;
  description: string;
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  isActive: boolean;
}

interface Room {
  id: string;
  name: string;
  price: number;
  availability: boolean;
  maxOccupancy: number;
}

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  handleOpenBookingModal: () => void;
  room: Room;
  services: Service[];
  bookedRanges?: { checkIn: string | Date; checkOut: string | Date }[];
}

export default function BookingDialog({
  isOpen,
  onClose,
  room,
  services,
  bookedRanges = [],
  handleOpenBookingModal,
}: BookingDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [step, setStep] = useState<"booking" | "receipt">("booking");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dateError, setDateError] = useState("");
  const bookNowMutation = useBookNowMutation();

  const handleCheckInChange = (e: string) => {
    setCheckIn(e);
    setDateError("");
    if (checkOut && new Date(e) >= new Date(checkOut)) {
      setDateError("Check-in must be before check-out");
    }
  };

  const handleCheckOutChange = (e: string) => {
    if (checkIn && new Date(checkIn) >= new Date(e)) {
      setDateError("Check-out must be after check-in");
      return;
    }
    setCheckOut(e);
    setDateError("");
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const roomSubtotal = nights * room.price;
  const servicesTotal = selectedServices.reduce((total, serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return total + (service?.price || 0) * nights;
  }, 0);
  const total = roomSubtotal + servicesTotal;
  const navigate = useNavigate();

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };
  const { user } = useClientAuth();
  const handleBookNow = async () => {
    const res = await bookNowMutation.mutateAsync({
      additionalServices: [],
      checkIn: checkIn,
      checkOut: checkOut,
      guests: Number(guests),
      userId: user?.id as any,
      roomId: room.id,
    });

    if (res.checkoutUrl) {
      location.replace(res.checkoutUrl);
    }
  };

  const handleNextStep = () => {
    if (step === "booking" && checkIn && checkOut && !dateError) {
      setStep("receipt");
    }
  };

  const handleBack = () => {
    setStep("booking");
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setStep("booking");
      setCheckIn("");
      setCheckOut("");
      setGuests("1");
      setSelectedServices([]);
      setDateError("");
      onClose();
    }
  };

  // Step 1: Booking Details with collapsible services
  const bookingContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          1
        </div>
        <span className="text-sm font-medium text-foreground">
          Booking Details
        </span>
      </div>

      <div className="space-y-4">
        {/* <div>
        Check-in Date
          <label className="mb-2 block text-sm font-medium text-foreground">
            Check-in
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Check-out
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground text-sm"
            />
          </div>
          {dateError && (
            <div className="mt-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3 w-3" />
              {dateError}
            </div>
          )}
        </div> */}

        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          setCheckIn={setCheckIn}
          setCheckOut={setCheckOut}
          bookedRanges={bookedRanges}
        />

        {/* Guests */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Guests
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground text-sm"
            >
              {Array.from({ length: room.maxOccupancy }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {services.length > 0 && (
        <Accordion
          type="single"
          collapsible
          className="border border-border rounded-lg"
        >
          <AccordionItem value="services" className="border-0">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">
                  Additional Services
                </span>
                {selectedServices.length > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {selectedServices.length}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-4 space-y-3 border-t border-border">
              {services.map((service) => (
                <div key={service.id} className="flex items-start gap-3">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={service.id}
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      {service.name}
                    </Label>
                    {service.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <FormatedAmount
                    amount={service.price}
                    suffix="/night"
                    className="text-sm font-semibold text-primary whitespace-nowrap"
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Next Step Button - always visible */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleNextStep}
        disabled={!room.availability || !checkIn || !checkOut || !!dateError}
      >
        Review Booking
      </Button>
    </div>
  );

  // Step 2: Receipt/Review
  const receiptContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          2
        </div>
        <span className="text-sm font-medium text-foreground">
          Review & Confirm
        </span>
      </div>

      <div className="space-y-4">
        {/* Booking Details Summary */}
        <div className="rounded-lg bg-muted p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Booking Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-in:</span>
              <span className="font-medium">
                {new Date(checkIn).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Check-out:</span>
              <span className="font-medium">
                {new Date(checkOut).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests:</span>
              <span className="font-medium">{guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nights:</span>
              <span className="font-medium">{nights}</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <h3 className="font-semibold text-foreground">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {room.name} × {nights} {nights === 1 ? "night" : "nights"}
              </span>
              <FormatedAmount
                amount={roomSubtotal}
                className="font-medium text-sm "
              />
            </div>

            {/* Selected Services with night multiplier */}
            {selectedServices.length > 0 && (
              <div className="border-t border-border pt-2 space-y-2">
                {selectedServices.map((serviceId) => {
                  const service = services.find((s) => s.id === serviceId);
                  if (!service) return null;
                  const serviceTotal = (service.price || 0) * nights;
                  return (
                    <div
                      key={serviceId}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        {service.name} × {nights}
                      </span>

                      <FormatedAmount
                        amount={serviceTotal}
                        className="font-medium text-lg "
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Subtotal and Total */}
            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>

                <FormatedAmount
                  amount={roomSubtotal + servicesTotal}
                  className="font-medium text-lg "
                />
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
                <span>Total</span>
                <FormatedAmount amount={total} className="font-bold text-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - always visible */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          size="lg"
          className="flex-1"
          onClick={handleBookNow}
          disabled={bookNowMutation.isPending}
        >
          {bookNowMutation.isPending ? <Spinner scale={1} /> : "Book Now"}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        You won't be charged yet
      </p>
    </div>
  );

  // Desktop: Dialog with onOpenChange preventing outside click
  if (!isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-md rounded-lg max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="sticky top-0 bg-background z-10 pb-4 border-b border-border pt-4 flex justify-between">
            <div className="flex items-center gap-2">
              {step === "receipt" && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Go back"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <h2 className="flex-1 font-semibold text-lg text-foreground">
                {step === "booking"
                  ? `Book ${room.name}`
                  : "Review Your Booking"}
              </h2>
            </div>

            <Button variant={"outline"} size={"icon"} onClick={() => onClose()}>
              <X />
            </Button>
          </div>

          <div className="px-1">
            {step === "booking" ? bookingContent : receiptContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: Drawer with scrollable content and sticky buttons
  return (
    <Drawer open={isOpen} onOpenChange={handleOnOpenChange}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <div className="sticky top-0 bg-background z-10 border-b border-border px-4 pt-4 pb-4">
          <div className="flex items-center gap-2">
            {step === "receipt" && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="flex-1 font-semibold text-lg text-foreground">
              {step === "booking" ? `Book ${room.name}` : "Review Your Booking"}
            </h2>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="pb-6">
            {step === "booking" ? bookingContent : receiptContent}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
