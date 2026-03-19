import RoomGallery from "./room-gallery";
import RoomDetails from "./room-details";
import BookingCard from "./booking-card";
import type { RoomResponse } from "@/hooks/api/types/room.types";
import BookingDialog from "./booking-dialog";
import FormatedAmount from "@/components/shared/formatted-amount";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      navigate(`/auth/signin?callBackUrl=/rooms/${data.data.id}`, {
        state: "booking",
      });
    } else {
      setIsDialogOpen(true);
    }
  };
  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8 lg:px-6">
        <header className="py-4 ">
          <Button
            className=""
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft />
            Back
          </Button>
        </header>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left side - Room details (2 columns on lg) */}
          <div className="lg:col-span-2">
            <RoomGallery images={roomData?.images} roomName={roomData.name} />
            <RoomDetails room={roomData} />
          </div>

          {/* Right side - Booking card (sticky on lg) */}
          <div className="hidden lg:block">
            <BookingCard
              room={roomData}
              onBookingClick={() => setIsDialogOpen(true)}
              handleOpenBookingModal={handleOpenBookingModal}
            />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 lg:hidden">
        <button
          onClick={() => handleOpenBookingModal()}
          className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all flex justify-center items-center"
        >
          <p className="text-base font-bold">Book Now</p>
        </button>
      </div>

      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        room={roomData}
        services={roomData.services}
        handleOpenBookingModal={handleOpenBookingModal}
      />
    </>
  );
};

export default DataContainer;
