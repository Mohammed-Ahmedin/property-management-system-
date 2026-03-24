import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MapPin, Search, Filter, Car, Building2, Home, Clock, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocationFilter } from "./location-filter";
import { useNavigate } from "react-router-dom";
import { PropertyFilter } from "@/components/shared/filter";

type TabType = "hotels" | "homes" | "longstay" | "transport";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "hotels", label: "Hotels", icon: <Building2 className="w-4 h-4" /> },
  { id: "homes", label: "Homes & Apts", icon: <Home className="w-4 h-4" /> },
  { id: "longstay", label: "Long stays", icon: <Clock className="w-4 h-4" /> },
  { id: "transport", label: "Airport transfer", icon: <Plane className="w-4 h-4" /> },
];

const FilterTab = () => {
  const [activeTab, setActiveTab] = useState<TabType>("hotels");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState<number>(1);
  const [location, setLocation] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [passengers, setPassengers] = useState<number>(1);
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    if (guests) params.set("guests", String(guests));
    if (activeTab === "longstay") params.set("longstay", "true");
    navigate(`/properties?${params.toString()}`);
  };

  const isStay = activeTab !== "transport";

  return (
    <>
      {/* White card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-border">

        {/* Tab bar */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="p-4">
          {isStay ? (
            <>
              {/* Row 1: Destination + Check-in + Check-out */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {/* Destination */}
                <div className="border border-border rounded-lg px-4 py-3 hover:border-primary/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Destination</p>
                  <LocationFilter location={location} setLocation={setLocation} />
                </div>

                {/* Check-in */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="border border-border rounded-lg px-4 py-3 text-left hover:border-primary/50 transition-colors w-full">
                      <p className="text-xs text-muted-foreground mb-1">Check in</p>
                      <p className={cn("text-sm font-medium", !checkIn && "text-muted-foreground")}>
                        {checkIn ? format(checkIn, "EEE, MMM d") : "Add date"}
                      </p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                  </PopoverContent>
                </Popover>

                {/* Check-out */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="border border-border rounded-lg px-4 py-3 text-left hover:border-primary/50 transition-colors w-full">
                      <p className="text-xs text-muted-foreground mb-1">Check out</p>
                      <p className={cn("text-sm font-medium", !checkOut && "text-muted-foreground")}>
                        {checkOut ? format(checkOut, "EEE, MMM d") : "Add date"}
                      </p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Row 2: Guests + Filters + Search */}
              <div className="flex gap-3 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="border border-border rounded-lg px-4 py-3 text-left hover:border-primary/50 transition-colors flex-1 md:flex-none md:w-48">
                      <p className="text-xs text-muted-foreground mb-1">Guests</p>
                      <p className="text-sm font-medium">{guests} Guest{guests > 1 ? "s" : ""}</p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-4" align="start">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Guests</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setGuests((p) => Math.max(1, p - 1))} disabled={guests <= 1}>-</Button>
                        <span className="w-5 text-center text-sm">{guests}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setGuests((p) => p + 1)}>+</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <button
                  onClick={() => setFilterOpen(true)}
                  className="border border-border rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden md:inline">More filters</span>
                </button>

                <button
                  onClick={handleSearch}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg py-3 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Transport: Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="border border-border rounded-lg px-4 py-3 hover:border-primary/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Pick-up airport</p>
                  <input
                    className="w-full text-sm font-medium bg-transparent outline-none placeholder:text-muted-foreground placeholder:font-normal"
                    placeholder="Airport name or code"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
                <div className="border border-border rounded-lg px-4 py-3 hover:border-primary/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Destination location</p>
                  <input
                    className="w-full text-sm font-medium bg-transparent outline-none placeholder:text-muted-foreground placeholder:font-normal"
                    placeholder="Hotel, address or area"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Transport: Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="border border-border rounded-lg px-4 py-3 text-left hover:border-primary/50 transition-colors w-full">
                      <p className="text-xs text-muted-foreground mb-1">Pick-up date</p>
                      <p className={cn("text-sm font-medium", !pickupDate && "text-muted-foreground")}>
                        {pickupDate ? format(pickupDate, "EEE, MMM d") : "Select date"}
                      </p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <div className="border border-border rounded-lg px-4 py-3 hover:border-primary/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Pick-up time</p>
                  <p className="text-sm font-medium text-muted-foreground">12:00 PM</p>
                </div>

                <div className="border border-border rounded-lg px-4 py-3 hover:border-primary/50 transition-colors">
                  <p className="text-xs text-muted-foreground mb-1">Passengers</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{passengers} passenger{passengers > 1 ? "s" : ""}</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setPassengers((p) => Math.max(1, p - 1))} className="w-5 h-5 rounded-full border flex items-center justify-center text-xs hover:bg-muted">-</button>
                      <button onClick={() => setPassengers((p) => p + 1)} className="w-5 h-5 rounded-full border flex items-center justify-center text-xs hover:bg-muted">+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search button */}
              <button
                onClick={() => navigate(`/properties?transport=true&pickup=${pickupLocation}&dropoff=${dropoffLocation}`)}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </>
          )}
        </div>
      </div>

      <PropertyFilter isOpen={filterOpen} onOpenChange={setFilterOpen} />
    </>
  );
};

export default FilterTab;
