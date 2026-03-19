import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ethiopianCities: any = {
  "Addis Ababa": [
    "Addis Ketema",
    "Akaky Kaliti",
    "Arada",
    "Bole",
    "Gullele",
    "Kirkos",
    "Kolfe Keranio",
    "Lideta",
    "Nifas Silk-Lafto",
    "Yeka",
    "Lemi Kura",
  ],
  "Bahir Dar": ["Belay Zeleke", "Fasil", "Zege", "Tana"],
  Mekelle: ["Hawelti", "Ayder", "Semien", "Addis Kidame"],
  Gondar: ["Azezo", "Lalibela", "Fasil", "Debre Berhan"],
  Hawassa: ["Tabor", "Haile Resort", "Menaheriya", "Adare"],
  // add more cities/sub-cities as needed
};

export default function CitySubcityFilter({
  filters,
  handleFilterChange,
}: {
  filters: any;
  handleFilterChange: any;
}) {
  const [subcities, setSubcities] = useState<string[]>([]);

  useEffect(() => {
    if (filters.city && ethiopianCities[filters.city]) {
      setSubcities(ethiopianCities[filters.city]);
      // reset subcity when city changes
      handleFilterChange("subcity", "");
    } else {
      setSubcities([]);
    }
  }, [filters.city]);

  return (
    <div className="space-y-4">
      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city" className="text-base font-medium">
          City
        </Label>
        <Select
          value={filters.city || ""}
          onValueChange={(value) => handleFilterChange("city", value)}
        >
          <SelectTrigger id="city" className="w-full py-5">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(ethiopianCities).map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subcity */}
      <div className="space-y-2">
        <Label htmlFor="subcity" className="text-base font-medium">
          Sub-city
        </Label>
        <Select
          value={filters.subcity || ""}
          onValueChange={(value) => handleFilterChange("subcity", value)}
          disabled={!subcities.length}
        >
          <SelectTrigger id="subcity" className="w-full py-5">
            <SelectValue
              placeholder={
                subcities.length ? "Select sub-city" : "Select city first"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {subcities.map((subcity) => (
              <SelectItem key={subcity} value={subcity}>
                {subcity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
