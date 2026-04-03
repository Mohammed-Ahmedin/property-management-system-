import RoomGallery from "./room-gallery";
import RoomDetails from "./room-details";
import BookingCard from "./booking-card";
import type { RoomResponse } from "@/hooks/api/types/room.types";
import BookingDialog from "./booking-dialog";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BedDouble, Users, Maximize2, CheckCircle2, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  data: RoomResponse;
  setIsDialogOpen: any;
  isDialogOpen: any;
}

const DataContainer = ({ data, isDialogOpen, setIsDialogOpen }: Props) => {
  const roomData = data.data;
  const { isAuthenticated } = useClientAuth();
  const navigate = useNavigate();

  const handleOpenBookingModal = () => {
    if (!isAuthenticated) {
      navigate(`/auth/signin?callBackUrl=/rooms/${data.data.id}`, { state: "booking" });
    } else {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8 lg:px-6">
        {/* Back */}
        <div className="mb-5">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Hero strip */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs uppercase">{roomData.type}</Badge>
              <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", roomData.availability ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400")}>
                {roomData.availability ? "Available" : "Unavailable"}
              </span>
              {(() => {
                const rd = (roomData as any).discountPercent ?? 0;
                const pd = (roomData as any).property?.discountPercent ?? 0;
                const total = rd + pd - (rd * pd / 100);
                return total > 0 ? (
                  <span className="text-xs font-bold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                    🏷️ {Math.round(total)}% OFF
                  </span>
                ) : null;
              })()}
            </div>
            <h1 className="text-xl md:text-2xl font-bold">{roomData.name}</h1>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">per night</p>
            {(() => {
              const rd = (roomData as any).discountPercent ?? 0;
              const pd = (roomData as any).property?.discountPercent ?? 0;
              const afterProp = pd > 0 ? roomData.price * (1 - pd / 100) : roomData.price;
              const effective = rd > 0 ? afterProp * (1 - rd / 100) : afterProp;
              const effectiveRounded = Math.round(effective * 100) / 100;
              const hasDiscount = effectiveRounded < roomData.price;
              return hasDiscount ? (
                <div>
                  <p className="text-sm line-through text-muted-foreground">ETB {roomData.price.toLocaleString()}</p>
                  <FormatedAmount amount={effectiveRounded} className="text-2xl font-bold text-red-500" />
                </div>
              ) : (
                <FormatedAmount amount={roomData.price} className="text-2xl font-bold text-primary" />
              );
            })()}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <RoomGallery images={roomData?.images} roomName={roomData.name} services={roomData.services} />

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <BedDouble className="w-4 h-4 text-primary" />, label: "Type", value: roomData.type },
                { icon: <Users className="w-4 h-4 text-primary" />, label: "Max guests", value: `${roomData.maxOccupancy} guests` },
                { icon: <Maximize2 className="w-4 h-4 text-primary" />, label: "Size", value: roomData.squareMeters ? `${roomData.squareMeters} sqm` : "—" },
                { icon: <Shield className="w-4 h-4 text-primary" />, label: "Cancellation", value: "Free" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="shrink-0">{icon}</div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xs font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <RoomDetails room={roomData} />
          </div>

          {/* Right sticky */}
          <div className="hidden lg:block">
            <BookingCard
              room={roomData}
              onBookingClick={() => setIsDialogOpen(true)}
              handleOpenBookingModal={handleOpenBookingModal}
            />
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm p-4 lg:hidden">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground">per night</p>
            <FormatedAmount amount={roomData.price} className="font-bold text-lg text-primary" />
          </div>
          <Button onClick={handleOpenBookingModal} className="rounded-full px-8 font-bold">
            Book Now
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground">You won't be charged yet</p>
      </div>

      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        room={roomData}
        services={roomData.services}
        bookedRanges={(roomData as any).bookings || []}
        handleOpenBookingModal={handleOpenBookingModal}
      />
    </>
  );
};

export default DataContainer;
