import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { LocationFilter } from "./location-filter";
import { useNavigate } from "react-router-dom";
import { PropertyFilter } from "@/components/shared/filter";

const FilterTab = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    if (guests) params.set("guests", String(guests));

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <>
      <div className="z-10 w-[90%] md:w-[70%] rounded-xl md:rounded-full mt-6 absolute bottom-[-50px] md:bottom-[-50px] shadow-xl border bg-white/80 dark:bg-black/80 dark:border-white/40 backdrop-blur-sm transition-all">
        <div className="flex flex-col md:flex-row justify-between items-center w-full h-auto md:h-[100px] gap-2 p-3 md:p-4">
          {/* Location */}

          <LocationFilter location={location} setLocation={setLocation} />

          <Separator orientation={isMobile ? "horizontal" : "vertical"} />
          {/* Check-in */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className=" w-full flex-1 h-full flex justify-start"
              >
                <div className="flex flex-col items-start">
                  <h2 className="text-base md:text-lg font-semibold">
                    Check in
                  </h2>
                  <span className={cn(`text-muted-foreground text-sm md:text`)}>
                    {checkIn ? format(checkIn, "PPP") : "Add date"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Separator orientation={isMobile ? "horizontal" : "vertical"} />
          {/* Check-out */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className=" w-full flex-1 h-full flex justify-start"
              >
                <div className="flex flex-col items-start">
                  <h2 className="text-base md:text-lg font-semibold">
                    Check out
                  </h2>
                  <span className={cn(` text-muted-foreground text-sm `)}>
                    {checkOut ? format(checkOut, "PPP") : "Add date"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Separator orientation={isMobile ? "horizontal" : "vertical"} />
          {/* Guests */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex-1 h-full flex justify-start rounded-md px-4 py-2"
              >
                <div className="flex flex-col items-start">
                  <h2 className="text-base md:text-lg font-semibold">Guests</h2>
                  <span className="text-muted-foreground text-sm">
                    {guests === null
                      ? "Select guests"
                      : `${guests} Guest${guests > 1 ? "s" : ""}`}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-56 flex flex-col items-center gap-3">
              <div className="flex justify-between items-center w-full">
                <span className="font-medium">Guests</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setGuests((prev) => (prev ? Math.max(1, prev - 1) : 1))
                    }
                    disabled={guests === null || guests <= 1}
                  >
                    -
                  </Button>
                  <span>{guests ?? 0}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setGuests((prev) => (prev ? prev + 1 : 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              {guests !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive/90"
                  onClick={() => setGuests(null)}
                >
                  Clear selection
                </Button>
              )}
            </PopoverContent>
          </Popover>
          {/* Search Button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="rounded-full bg-accent  flex gap-2 justify-center items-center h-full max-md:w-full max-md:py-3 md:aspect-square md:w-auto border border-border hover:opacity-90"
          >
            <Filter className="w-5 md:w-8 mr-2 text-[black] dark:text-[white]" />
            <h2 className="text-base md:hidden text-[black] dark:text-[white]">
              More Filter
            </h2>
          </button>

          <button
            onClick={handleSearch}
            className="rounded-full flex gap-2 justify-center items-center h-full max-md:w-full max-md:py-3 md:aspect-square md:w-auto bg-primary text-white hover:bg-primary/90"
          >
            <Search className="w-5 md:w-8 mr-2" />
            <h2 className="text-base md:hidden">Search</h2>
          </button>
        </div>
      </div>

      <PropertyFilter isOpen={filterOpen} onOpenChange={setFilterOpen} />
    </>
  );
};

export default FilterTab;
