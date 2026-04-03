"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CoordinateInput } from "@/components/shared/coordinate-input";

interface LocationSelectorProps {
  register: any;
  errors: any;
  setValue?: any;
  watch: any;
}

const ethiopianLocations = {
  "Addis Ababa": {
    subcities: {
      Bole: ["Airport", "Atlas", "Megenagna", "Gerji", "Wello Sefer"],
      Yeka: ["Megenagna", "Lamberet", "Kotebe", "Ayat", "Summit"],
      Kirkos: ["Kazanchis", "Meskel Flower", "Olympia", "Gotera"],
      Lideta: ["Mexico", "Teklehaimanot", "Senga Tera"],
      Gulele: ["Shiro Meda", "Addisu Gebeya", "Piasa"],
      NifasSilkLafto: ["Sarbet", "Lafto", "Jemo", "Mebrathail"],
      KolfeKeranio: ["Gofa", "Ayer Tena", "Mekonnenoch Sefer"],
      AkakiKaliti: ["Kality", "Akaki", "Tulu Dimtu"],
      Arada: ["Piasa", "Etege Taitu", "Menelik Square"],
    },
  },
  "Bahir Dar": {
    subcities: {
      "Belay Zeleke": ["Zenzelma", "Abezat", "Kebele 14"],
      Fasil: ["Fasil Gibi", "St. George", "Kebele 03"],
      Zege: ["Zege Peninsula", "Tana North"],
    },
  },
  Mekelle: {
    subcities: {
      Hawelti: ["Adi Haki", "Desta Sefer"],
      Ayder: ["Ayder Hospital Area", "Mekelle University Zone"],
    },
  },
  Gondar: {
    subcities: {
      Maraki: ["Maraki Sefer", "Chechela"],
      Arada: ["Fasil Gibi", "Posta Bet"],
    },
  },
  Hawassa: {
    subcities: {
      Tabor: ["Tabor Hill", "Kebele 01", "Kebele 02"],
      "Mehal Ketema": ["Piazza", "Kebele 03", "Kebele 04"],
      "Hayek Dare": ["Hayek Dare Sefer", "Kebele 05"],
      Misrak: ["Misrak Sefer", "Kebele 06"],
      "Addis Ketema": ["Addis Ketema Sefer", "Kebele 07"],
    },
  },
  Adama: {
    subcities: {
      Geda: ["Geda Sefer", "Kebele 01"],
      Denkaka: ["Denkaka Sefer", "Kebele 02"],
      Boku: ["Boku Sefer", "Kebele 03"],
    },
  },
  "Dire Dawa": {
    subcities: {
      Sabian: ["Sabian Sefer", "Kebele 01"],
      Legehare: ["Legehare Sefer", "Kebele 02"],
      Dechatu: ["Dechatu Sefer", "Kebele 03"],
    },
  },
};

// Reusable searchable select (Command-based)
function SearchableSelect({
  label,
  value,
  onChange,
  placeholder,
  items,
}: {
  label: string;
  value?: string;
  onChange: (val: string) => void;
  placeholder: string;
  items: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? value : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item}
                    onSelect={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        item === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function LocationSelector({
  register,
  errors,
  setValue,
  watch,
}: LocationSelectorProps) {
  const city = watch("location.city");
  const subcity = watch("location.subcity");
  const neighborhood = watch("location.neighborhood");
  const subcities = Object.keys(
    (ethiopianLocations as any)[city]?.subcities || {}
  );
  const [loadingLocation, setLoadingLocation] = useState(false);

  const neighborhoods =
    (ethiopianLocations as any)[city]?.subcities?.[subcity] || [];

  const handleAutoFillLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue("location.latitude", latitude.toString());
        setValue("location.longitude", latitude.toString());
        // setLongitude(longitude.toFixed(6));
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to fetch current location. Please allow permission.");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Continent & Country */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Continent</Label>
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled
            >
              Africa
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled
            >
              Ethiopia
            </Button>
          </div>
        </div>

        {/* City & Subcity */}
        <div className="grid gap-4 md:grid-cols-2">
          <SearchableSelect
            label="City"
            value={city}
            onChange={(val) => {
              if (setValue) {
                setValue("location.subcity", "");
                setValue("location.city", val);
              }
            }}
            placeholder="Select City"
            items={Object.keys(ethiopianLocations)}
          />

          <SearchableSelect
            label="Subcity"
            value={subcity}
            onChange={(val) => {
              //   setSubcity(val);
              if (setValue) {
                setValue("location.subcity", val);
              }
            }}
            placeholder="Select Subcity"
            items={subcities}
          />
        </div>

        {/* Neighborhood */}
        <SearchableSelect
          label="Neighborhood"
          value={neighborhood}
          onChange={(val) => {
            // setNeighborhood(val);
            setValue && setValue("location.neighborhood", val);
          }}
          placeholder="Select Neighborhood"
          items={neighborhoods}
        />

        {/* Coordinates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="longitude">Nearby</Label>
            <Input
              id="nearby"
              type="string"
              step="any"
              placeholder="Famous nearby places"
              {...register("location.nearby")}
            />
            {errors.location?.nearby && (
              <p className="text-sm text-destructive">
                {errors.location.nearby.message}
              </p>
            )}
          </div>
        </div>

        {/* Coordinates */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Coordinates</Label>
            <Button variant="secondary" size="sm" onClick={handleAutoFillLocation} disabled={loadingLocation}>
              {loadingLocation ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Detecting...</> : <><MapPin className="w-4 h-4 mr-2" />Auto-fill Current Location</>}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Enter degrees and select direction (N/S for latitude, E/W for longitude)</p>
          <div className="grid gap-4 md:grid-cols-2 mt-2">
            <CoordinateInput
              type="latitude"
              label="Latitude"
              value={watch("location.latitude") || ""}
              onChange={(val) => setValue("location.latitude", val)}
            />
            <CoordinateInput
              type="longitude"
              label="Longitude"
              value={watch("location.longitude") || ""}
              onChange={(val) => setValue("location.longitude", val)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
