import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MapPin, Search, Building2, Home, Clock, Plane, PlaneTakeoff, ArrowLeftRight, CalendarDays, Clock3, Users } from "lucide-react";
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
  const [transferDirection, setTransferDirection] = useState<"from" | "to">("from");
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
              {/* Row 1: Full-width destination */}
              <div className="border border-border rounded-lg px-4 py-3 flex items-center gap-3 mb-3 hover:border-primary/50 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <LocationFilter location={location} setLocation={setLocation} />
              </div>

              {/* Row 2: Check-in + Check-out + Guests in one bordered row */}
              <div className="border border-border rounded-lg flex divide-x divide-border mb-4 overflow-hidden">
                {/* Check-in */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/40 transition-colors">
                      <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className={cn("text-sm font-medium", !checkIn && "text-muted-foreground")}>
                          {checkIn ? format(checkIn, "d MMM yyyy") : "Check-in date"}
                        </p>
                        {checkIn && <p className="text-xs text-muted-foreground">{format(checkIn, "EEEE")}</p>}
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                  </PopoverContent>
                </Popover>

                {/* Check-out */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/40 transition-colors">
                      <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className={cn("text-sm font-medium", !checkOut && "text-muted-foreground")}>
                          {checkOut ? format(checkOut, "d MMM yyyy") : "Check-out date"}
                        </p>
                        {checkOut && <p className="text-xs text-muted-foreground">{format(checkOut, "EEEE")}</p>}
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                  </PopoverContent>
                </Popover>

                {/* Guests */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{guests} adult{guests > 1 ? "s" : ""}</p>
                          <p className="text-xs text-muted-foreground">1 room</p>
                        </div>
                      </div>
                      <Search className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-4" align="end">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Adults</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setGuests((p) => Math.max(1, p - 1))} disabled={guests <= 1}>-</Button>
                        <span className="w-5 text-center text-sm">{guests}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setGuests((p) => p + 1)}>+</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search button — centered, rounded-full */}
              <div className="flex justify-center">
                <button
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full py-3 px-16 text-sm font-semibold uppercase tracking-wide flex items-center gap-2 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </>
          ) : (
            <>
              {/* From / To airport toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setTransferDirection("from")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    transferDirection === "from"
                      ? "bg-white border-primary text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  From airport
                </button>
                <button
                  onClick={() => setTransferDirection("to")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    transferDirection === "to"
                      ? "bg-white border-primary text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  To airport
                </button>
              </div>

              {/* Row 1: Pick-up + swap icon + Destination */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 border border-border rounded-lg px-4 py-3 flex items-center gap-3 hover:border-primary/50 transition-colors">
                  <PlaneTakeoff className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    placeholder="Pick-up airport"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => { const tmp = pickupLocation; setPickupLocation(dropoffLocation); setDropoffLocation(tmp); }}
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors shrink-0"
                  aria-label="Swap locations"
                >
                  <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                </button>
                <div className="flex-1 border border-border rounded-lg px-4 py-3 flex items-center gap-3 hover:border-primary/50 transition-colors">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    placeholder="Destination location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: Date + Time + Passengers */}
              <div className="border border-border rounded-lg flex divide-x divide-border mb-4 overflow-hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/40 transition-colors">
                      <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className={cn("text-sm", !pickupDate && "text-muted-foreground")}>
                        {pickupDate ? format(pickupDate, "EEE, MMM d") : "Pick-up date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                  </PopoverContent>
                </Popover>

                <div className="flex-1 px-4 py-3 flex items-center gap-3">
                  <Clock3 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">12:00 PM</span>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/40 transition-colors">
                      <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{passengers} passenger{passengers > 1 ? "s" : ""}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-4" align="start">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Passengers</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPassengers((p) => Math.max(1, p - 1))} disabled={passengers <= 1}>-</Button>
                        <span className="w-5 text-center text-sm">{passengers}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setPassengers((p) => p + 1)}>+</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Search button — centered, rounded-full */}
              <div className="flex justify-center">
                <button
                  onClick={() => navigate(`/properties?transport=true&direction=${transferDirection}&pickup=${pickupLocation}&dropoff=${dropoffLocation}`)}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full py-3 px-16 text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <PropertyFilter isOpen={filterOpen} onOpenChange={setFilterOpen} />
    </>
  );
};

export default FilterTab;
