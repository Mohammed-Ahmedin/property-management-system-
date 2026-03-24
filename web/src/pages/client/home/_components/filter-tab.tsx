import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MapPin, Search, Filter, Car } from "lucide-react";
import { cn } from "@/lib/utils";
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
      <div className="z-10 w-[95%] md:w-[85%] lg:w-[75%] rounded-2xl absolute bottom-[-90px] md:bottom-[-80px] shadow-2xl border bg-white dark:bg-zinc-900 dark:border-white/10 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border px-2 pt-1">
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
          /* On mobile: vertical stack. On desktop: single row */
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr_1px_1fr_auto] items-stretch p-3 gap-0">

            {/* Destination */}
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Destination</p>
              <LocationFilter location={location} setLocation={setLocation} />
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px bg-border self-stretch my-2" />

            {/* Check-in */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="px-3 py-2 text-left hover:bg-muted/40 rounded-lg transition-colors w-full">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Check in</p>
                  <p className="text-sm text-muted-foreground">
                    {checkIn ? format(checkIn, "MMM d, yyyy") : "Add date"}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="hidden md:block w-px bg-border self-stretch my-2" />

            {/* Check-out */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="px-3 py-2 text-left hover:bg-muted/40 rounded-lg transition-colors w-full">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Check out</p>
                  <p className="text-sm text-muted-foreground">
                    {checkOut ? format(checkOut, "MMM d, yyyy") : "Add date"}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
              </PopoverContent>
            </Popover>

            {/* Divider */}
            <div className="hidden md:block w-px bg-border self-stretch my-2" />

            {/* Guests */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="px-3 py-2 text-left hover:bg-muted/40 rounded-lg transition-colors w-full">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Guests</p>
                  <p className="text-sm text-muted-foreground">
                    {guests === null ? "Add guests" : `${guests} Guest${guests > 1 ? "s" : ""}`}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4" align="start">
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium text-sm">Guests</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setGuests((p) => (p ? Math.max(1, p - 1) : 1))} disabled={!guests || guests <= 1}>-</Button>
                    <span className="w-5 text-center text-sm">{guests ?? 0}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setGuests((p) => (p ? p + 1 : 1))}>+</Button>
                  </div>
                </div>
                {guests !== null && (
                  <Button variant="ghost" size="sm" className="text-xs text-destructive mt-2 w-full" onClick={() => setGuests(null)}>Clear</Button>
                )}
              </PopoverContent>
            </Popover>

            {/* Action buttons */}
            <div className="flex gap-2 p-2 items-center justify-end md:justify-center">
              <button
                onClick={() => setFilterOpen(true)}
                className="rounded-xl border border-border bg-muted/50 hover:bg-muted flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors"
                title="More filters"
              >
                <Filter className="w-4 h-4" />
                <span className="md:hidden">Filters</span>
              </button>
              <button
                onClick={handleSearch}
                className="rounded-xl bg-primary text-white flex items-center gap-2 px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors flex-1 md:flex-none justify-center"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1px_1fr_auto] items-stretch p-3 gap-0">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Pick-up location</p>
              <input
                className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="City, airport, hotel..."
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>

            <div className="hidden md:block w-px bg-border self-stretch my-2" />

            <div className="px-3 py-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Drop-off location</p>
              <input
                className="w-full text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="City, airport, hotel..."
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>

            <div className="hidden md:block w-px bg-border self-stretch my-2" />

            <Popover>
              <PopoverTrigger asChild>
                <button className="px-3 py-2 text-left hover:bg-muted/40 rounded-lg transition-colors w-full">
                  <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Pick-up date</p>
                  <p className="text-sm text-muted-foreground">
                    {pickupDate ? format(pickupDate, "MMM d, yyyy") : "Select date"}
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
              </PopoverContent>
            </Popover>

            <div className="flex gap-2 p-2 items-center">
              <button
                onClick={() => navigate(`/properties?transport=true&pickup=${pickupLocation}&dropoff=${dropoffLocation}`)}
                className="rounded-xl bg-primary text-white flex items-center gap-2 px-5 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors w-full md:w-auto justify-center"
              >
                <Search className="w-4 h-4" />
                Search
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
