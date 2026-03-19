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
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAutoFillLocation}
              disabled={loadingLocation}
            >
              {loadingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Auto-fill Current Location
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                step="any"
                placeholder="e.g., 9.0108"
                value={watch("latitude")}
                onChange={(e) => {
                  setValue("latitude", e.target.value);
                }}
                {...register("location.latitude")}
              />
              {errors.location?.latitude && (
                <p className="text-sm text-destructive">
                  {errors.location.latitude.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                step="any"
                placeholder="e.g., 38.7613"
                value={watch("longitude")}
                onChange={(e) => {
                  setValue("location.longitude", e.target.value);
                }}
                {...register("location.longitude")}
              />
              {errors.location?.longitude && (
                <p className="text-sm text-destructive">
                  {errors.location.longitude.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
