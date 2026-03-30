import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MapPin, Search, Building2, Home, Clock, Plane, PlaneTakeoff, ArrowLeftRight, CalendarDays, Clock3, Users, Filter } from "lucide-react";
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

// Shared styles
const BOX = "bg-white border-2 border-gray-300 rounded-lg hover:border-primary transition-colors duration-200";
const LABEL = "text-xs font-semibold text-gray-500 mb-1";
const VALUE = "text-sm font-semibold text-gray-900";
const PLACEHOLDER = "text-sm text-gray-400";

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
  const [pickupTime, setPickupTime] = useState("12:00");
  const [transferDirection, setTransferDirection] = useState<"from" | "to">("from");
  const [locDark, setLocDark] = useState(false);
  const navigate = useNavigate();

  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLocDark((d) => !d), 2000);
    return () => clearInterval(id);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) {
      if (location.includes(", ")) {
        const parts = location.split(", ");
        params.set("subcity", parts[0].trim());
        params.set("city", parts[1].trim());
        // Don't set location param — city+subcity are more precise
      } else {
        params.set("city", location.trim());
        // Also set location for display purposes only (not used as filter when city is set)
      }
    }
    if (checkIn) params.set("checkIn", checkIn.toISOString());
    if (checkOut) params.set("checkOut", checkOut.toISOString());
    if (guests) params.set("guests", String(guests));
    if (activeTab === "longstay") params.set("longstay", "true");
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">

        {/* Tab bar */}
        <div className="flex border-b-2 border-gray-200 overflow-x-auto bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors shrink-0",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary bg-primary/5"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div className="p-4 bg-white">
          {activeTab === "hotels" ? (
            <>
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {/* Destination — color-toggling animation */}
                <div
                  className={cn(
                    "border-2 rounded-lg px-4 py-3 relative cursor-pointer transition-colors duration-700",
                    locDark
                      ? "bg-gray-900 border-gray-900"
                      : "bg-white border-gray-300 hover:border-primary"
                  )}
                >
                  <p className={cn("text-xs font-semibold mb-1", locDark ? "text-gray-400" : "text-gray-500")}>
                    Destination
                  </p>
                  <LocationFilter location={location} setLocation={setLocation} dark={locDark} />
                </div>

                {/* Check-in */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(BOX, "px-4 py-3 text-left w-full")}>
                      <p className={LABEL}>Check in</p>
                      <p className={checkIn ? VALUE : PLACEHOLDER}>
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
                    <button className={cn(BOX, "px-4 py-3 text-left w-full")}>
                      <p className={LABEL}>Check out</p>
                      <p className={checkOut ? VALUE : PLACEHOLDER}>
                        {checkOut ? format(checkOut, "EEE, MMM d") : "Add date"}
                      </p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Row 2 */}
              <div className="flex gap-3 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(BOX, "px-4 py-3 text-left flex-1 md:flex-none md:w-48")}>
                      <p className={LABEL}>Guests</p>
                      <p className={VALUE}>{guests} Guest{guests > 1 ? "s" : ""}</p>
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
                  className={cn(BOX, "px-4 py-3 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900")}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden md:inline">More filters</span>
                </button>

                <button
                  onClick={handleSearch}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg py-3 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </>
          ) : activeTab === "homes" || activeTab === "longstay" ? (
            <>
              {/* Full-width destination — color toggling */}
              <div
                className={cn(
                  "border-2 rounded-lg px-4 py-3 flex items-center gap-3 mb-3 cursor-pointer transition-colors duration-700",
                  locDark
                    ? "bg-gray-900 border-gray-900"
                    : "bg-white border-gray-300 hover:border-primary"
                )}
              >
                <Search className={cn("w-4 h-4 shrink-0", locDark ? "text-gray-400" : "text-gray-400")} />
                <LocationFilter location={location} setLocation={setLocation} dark={locDark} />
              </div>

              {/* Inline row */}
              <div className="border-2 border-gray-300 rounded-lg flex divide-x-2 divide-gray-300 mb-4 overflow-hidden bg-white">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                      <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className={checkIn ? VALUE : PLACEHOLDER}>
                          {checkIn ? format(checkIn, "d MMM yyyy") : "Check-in date"}
                        </p>
                        {checkIn && <p className="text-xs text-gray-400">{format(checkIn, "EEEE")}</p>}
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                      <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className={checkOut ? VALUE : PLACEHOLDER}>
                          {checkOut ? format(checkOut, "d MMM yyyy") : "Check-out date"}
                        </p>
                        {checkOut && <p className="text-xs text-gray-400">{format(checkOut, "EEEE")}</p>}
                      </div>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                      <Users className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className={VALUE}>{guests} adult{guests > 1 ? "s" : ""}</p>
                        <p className="text-xs text-gray-400">1 room</p>
                      </div>
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
              <div className="flex justify-center">
                <button
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full py-3 px-16 text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-colors shadow-md"
                >
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </>
          ) : (
            <>
              {/* From / To toggle */}
              <div className="flex gap-2 mb-4">
                {["from", "to"].map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setTransferDirection(dir as "from" | "to")}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-colors",
                      transferDirection === dir
                        ? "bg-white border-primary text-primary shadow-sm"
                        : "border-gray-300 text-gray-500 hover:border-primary/50"
                    )}
                  >
                    {dir === "from" ? "From airport" : "To airport"}
                  </button>
                ))}
              </div>

              {/* Pick-up + swap + Destination */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn(BOX, "flex-1 px-4 py-3 flex items-center gap-3")}>
                  <PlaneTakeoff className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="Pick-up airport"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => { const tmp = pickupLocation; setPickupLocation(dropoffLocation); setDropoffLocation(tmp); }}
                  className="p-2 rounded-full border-2 border-gray-300 hover:border-primary hover:bg-gray-50 transition-colors shrink-0"
                >
                  <ArrowLeftRight className="w-4 h-4 text-gray-500" />
                </button>
                <div className={cn(BOX, "flex-1 px-4 py-3 flex items-center gap-3")}>
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-400 placeholder:font-normal"
                    placeholder="Destination location"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* Date + Time + Passengers */}
              <div className="border-2 border-gray-300 rounded-lg flex divide-x-2 divide-gray-300 mb-4 overflow-hidden bg-white">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                      <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className={pickupDate ? VALUE : PLACEHOLDER}>
                        {pickupDate ? format(pickupDate, "EEE, MMM d") : "Pick-up date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={pickupDate} onSelect={setPickupDate} initialFocus />
                  </PopoverContent>
                </Popover>
                <div className="flex-1 px-4 py-3 flex items-center gap-3">
                  <Clock3 className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="flex-1 text-sm font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
                      <Users className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className={VALUE}>{passengers} passenger{passengers > 1 ? "s" : ""}</span>
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

              <div className="flex justify-center">
                <button
                  onClick={() => navigate(`/properties?transport=true&direction=${transferDirection}&pickup=${pickupLocation}&dropoff=${dropoffLocation}&time=${pickupTime}`)}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full py-3 px-16 text-sm font-bold flex items-center gap-2 transition-colors shadow-md"
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
