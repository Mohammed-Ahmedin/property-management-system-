import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, X as XIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

type Props = {
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
  onChange?: (checkIn: Date | null, checkOut: Date | null) => void;
  checkIn: any;
  setCheckIn: any;
  checkOut: any;
  setCheckOut: any;
};

export default function DateRangePicker({
  initialCheckIn = null,
  initialCheckOut = null,
  onChange,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}: Props) {
//   const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
//   const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // validate whenever dates change
    if (checkIn && checkOut && checkOut < checkIn) {
      setError("Check-out must be the same or after check-in");
    } else {
      setError(null);
    }

    onChange?.(checkIn, checkOut);
  }, [checkIn, checkOut, onChange]);

  function clearDates() {
    setCheckIn(null);
    setCheckOut(null);
  }

  const displayLabel = () => {
    if (checkIn && checkOut) {
      return `${format(checkIn, "MMM d, yyyy")} — ${format(
        checkOut,
        "MMM d, yyyy"
      )}`;
    }
    if (checkIn) return format(checkIn, "MMM d, yyyy");
    if (checkOut) return format(checkOut, "MMM d, yyyy");
    return "Add dates";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Check-in
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 justify-start px-0 py-0 text-sm text-foreground"
              >
                <span className="truncate">
                  {checkIn ? format(checkIn, "MMM d, yyyy") : "Select"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <Calendar
                mode="single"
                onSelect={(date) => {
                  // set check-in and if check-out exists and is before new check-in, clear check-out
                  setCheckIn(date as Date);
                  if (checkOut && date && checkOut < (date as Date))
                    setCheckOut(null);
                }}
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={clearDates}
                    title="Clear dates"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Check-out
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 justify-start px-0 py-0 text-sm text-foreground"
              >
                <span className="truncate">
                  {checkOut ? format(checkOut, "MMM d, yyyy") : "Select"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <Calendar
                mode="single"
                disabled={(date) => (checkIn ? date < checkIn : false)}
                onSelect={(date) => setCheckOut(date as Date)}
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => {}}>
                    Done
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={clearDates}
                    title="Clear dates"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <XIcon className="h-3 w-3" />
            {error}
          </div>
        )}
      </div>

      {/* Compact combined selector with clear action
      <div className="col-span-full">
        <label className="mb-2 block text-sm font-medium text-foreground">Dates</label>
        <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 py-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex-1 justify-start px-0 py-0 text-sm text-foreground">
                <span className="truncate">{displayLabel()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[min(520px,90vw)] p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-xs font-medium">Check-in</p>
                  <Calendar
                    mode="single"
                    onSelect={(date) => {
                      setCheckIn(date as Date);
                      if (checkOut && date && checkOut < (date as Date)) setCheckOut(null);
                    }}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium">Check-out</p>
                  <Calendar
                    mode="single"
                    disabled={(date) => (checkIn ? date < checkIn : false)}
                    onSelect={(date) => setCheckOut(date as Date)}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{checkIn ? format(checkIn, "PPP") : "—"}</span>
                  <span>→</span>
                  <span>{checkOut ? format(checkOut, "PPP") : "—"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={clearDates} title="Clear">
                    <XIcon className="h-4 w-4" />
                    <span className="sr-only">Clear dates</span>
                  </Button>
                  <Button size="sm" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>

              {error && (
                <div className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</div>
              )}
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="sm" onClick={clearDates} title="Clear all">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div> */}
    </div>
  );
}
