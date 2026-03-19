import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function TakenDatesList({ takenDates }: { takenDates: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [takenDates]);

  if (takenDates.length === 0) return null;

  return (
    <div className="mt-4 relative max-h-[500px] overscroll-y-auto">
      <Label className="text-lg font-semibold">Taken Dates</Label>

      <Card className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 p-4 rounded-md">
        <p className="mb-2 text-sm text-red-700 dark:text-red-300">
          The following dates are already booked. Please select other dates:
        </p>

        <div
          ref={containerRef}
          className={`flex flex-wrap gap-2 transition-all duration-300 ${
            expanded ? "max-h-[400px]" : "max-h-[120px]"
          } overflow-hidden relative`}
        >
          {takenDates.map((date) => (
            <span
              key={date}
              className="px-3 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full text-sm font-medium shadow-sm"
            >
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          ))}

          {/* Fade overlay if content overflows and not expanded */}
          {!expanded && isOverflowing && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-red-50 dark:from-red-900/40 to-transparent pointer-events-none rounded-b-md" />
          )}
        </div>

        {/* Show chevron if there’s overflow */}
        {isOverflowing && (
          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 dark:text-red-300 hover:bg-transparent"
              onClick={() => setExpanded(!expanded)}
              type="button"
            >
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
