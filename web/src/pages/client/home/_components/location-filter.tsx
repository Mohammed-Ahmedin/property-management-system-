import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MapPin } from "lucide-react";

const ethiopianLocations = [
  {
    city: "Addis Ababa",
    subcities: [
      "Bole",
      "Yeka",
      "Nifas Silk-Lafto",
      "Lideta",
      "Kirkos",
      "Arada",
      "Gullele",
      "Kolfe Keranio",
      "Akaki Kaliti",
    ],
  },
  {
    city: "Bahir Dar",
    subcities: ["Belay Zeleke", "Gish Abay", "Tana Subcity"],
  },
  {
    city: "Hawassa",
    subcities: ["Tabor", "Mehale Ketema", "Hayek Dare"],
  },
  {
    city: "Adama",
    subcities: ["Geda", "Denkaka", "Boku"],
  },
  {
    city: "Mekelle",
    subcities: ["Ayder", "Kedamay Weyane", "Quiha"],
  },
  {
    city: "Gondar",
    subcities: ["Maraki", "Azezo", "Fasil"],
  },
  {
    city: "Dire Dawa",
    subcities: ["Sabian", "Legehare", "Dechatu"],
  },
];

export function LocationFilter({
  location,
  setLocation,
}: {
  location: string;
  setLocation: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex-1 h-full flex justify-start px-0 hover:bg-transparent"
        >
          <div className="flex items-center gap-2 text-left">
            <div className="flex flex-col items-start">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Location</h2>
              <p className="text-sm text-gray-400 truncate max-w-[140px]">
                {location || "Where are you going?"}
              </p>
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search city, subcity..." />
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>

            {ethiopianLocations.map((loc) => (
              <CommandGroup key={loc.city} heading={loc.city}>
                {/* City itself */}
                <CommandItem
                  onSelect={() => {
                    setLocation(loc.city);
                    setOpen(false);
                  }}
                >
                  <span className="font-medium">{loc.city}</span>
                </CommandItem>

                {/* Subcities */}
                {loc.subcities.map((sub) => (
                  <CommandItem
                    key={sub}
                    onSelect={() => {
                      setLocation(`${sub}, ${loc.city}`);
                      setOpen(false);
                    }}
                  >
                    {sub}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
