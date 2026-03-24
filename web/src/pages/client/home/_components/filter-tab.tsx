import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, Search, Filter, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { LocationFilter } from "./location-filter";
import { useNavigate } from "react-router-dom";
import { PropertyFilter } from "@/components/shared/filter";

type TabType = "stays" | "transport";

const FilterTab = () => {
  const [activeTab, setActiveTab] = useState<TabType>("stays");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
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
      <div className="z-10 w-[95%] md:w-[80%] lg:w-[70%] rounded-2xl mt-6 absolute bottom-[-70px] md:bottom-[-60px] shadow-2xl border bg-white dark:bg-zinc-900 dark:border-white/10 transition-all overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("stays")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
              activeTab === "stays"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapPin className="w-4 h-4" />
            Stays
          </button>
          <button
            onClick={() => setActiveTab("transport")}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
              activeTab === "transport"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Car className="w-4 h-4" />
            Transport
          </button>
        </div>

        {activeTab === "stays" ? (
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-0 p-2">
            {/* Location */}
            <div className="w-full flex-1 px-3 py-2">
              <p className="text-xs font-semibold text-foreground mb-1">Destination</p>
              <LocationFilter location={location} setLocation={setLocation} />
            </div>

            <Separator orientation={isMobile ? "horizontal" : "vertical"} className="h-10 max-md:hidden" />

            {/* Check-in */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex-1 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors">
                  <p className="text-xs font-semibold text-foreground">Check in</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {checkIn ? format(checkIn, "MMM d, yyyy") : "Add date"}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
              </PopoverContent>
            </Popover>

            <Separator orientation={isMobile ? "horizontal" : "vertical"} className="h-10 max-md:hidden" />

            {/* Check-out */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex-1 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors">
                  <p className="text-xs font-semibold text-foreground">Check out</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {checkOut ? format(checkOut, "MMM d, yyyy") : "Add date"}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
              </PopoverContent>
            </Popover>

            <Separator orientation={isMobile ? "horizontal" : "vertical"} className="h-10 max-md:hidden" />

            {/* Guests */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex-1 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors">
                  <p className="text-xs font-semibold text-foreground">Guests</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {guests === null ? "Add guests" : `${guests} Guest${guests > 1 ? "s" : ""}`}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 flex flex-col items-center gap-3 p-4">
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium">Guests</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setGuests((p) => (p ? Math.max(1, p - 1) : 1))} disabled={!guests || guests <= 1}>-</Button>
                    <span className="w-6 text-center">{guests ?? 0}</span>
                    <Button variant="outline" size="icon" onClick={() => setGuests((p) => (p ? p + 1 : 1))}>+</Button>
                  </div>
                </div>
                {guests !== null && (
                  <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => setGuests(null)}>Clear</Button>
                )}
              </PopoverContent>
            </Popover>

            {/* Actions */}
            <div className="flex gap-2 p-2 max-md:w-full">
              <button
                onClick={() => setFilterOpen(true)}
                className="rounded-xl border border-border bg-muted/50 hover:bg-muted flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors max-md:flex-1 justify-center"
              >
                <Filter className="w-4 h-4" />
                <span className="md:hidden">Filters</span>
              </button>
              <button
                onClick={handleSearch}
                className="rounded-xl bg-primary text-white flex items-center gap-2 px-5 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors max-md:flex-1 justify-center"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center w-full gap-0 p-2">
            <div className="w-full flex-1 px-3 py-2">
              <p className="text-xs font-semibold text-foreground mb-1">Pick-up location</p>
              <input
                className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="City, airport, hotel..."
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

            <Separator orientation={isMobile ? "horizontal" : "vertical"} className="h-10 max-md:hidden" />

            <div className="w-full flex-1 px-3 py-2">
              <p className="text-xs font-semibold text-foreground mb-1">Drop-off location</p>
              <input
                className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="City, airport, hotel..."
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>

            <Separator orientation={isMobile ? "horizontal" : "vertical"} className="h-10 max-md:hidden" />

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex-1 px-3 py-2 text-left hover:bg-muted/50 rounded-lg transition-colors">
                  <p className="text-xs font-semibold text-foreground">Pick-up date</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {pickupDate ? format(pickupDate, "MMM d, yyyy") : "Select date"}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2 p-2 max-md:w-full">
              <button
                onClick={() => navigate(`/properties?transport=true&pickup=${pickupLocation}&dropoff=${dropoffLocation}`)}
                className="rounded-xl bg-primary text-white flex items-center gap-2 px-5 py-3 text-sm font-semibold hover:bg-primary/90 transition-colors max-md:flex-1 justify-center"
              >
                <Search className="w-4 h-4" />
                Search Transport
              </button>
            </div>
          </div>
        )}
      </div>

      <PropertyFilter isOpen={filterOpen} onOpenChange={setFilterOpen} />
    </>
  );
};

export default FilterTab;
