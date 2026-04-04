"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoordinateInputProps {
  type: "latitude" | "longitude";
  value: string; // decimal string e.g. "9.0054" or "-9.0054"
  onChange: (decimal: string) => void;
  label?: string;
}

/**
 * Converts decimal degrees to degrees + direction
 * Latitude: positive = N, negative = S
 * Longitude: positive = E, negative = W
 */
function decimalToComponents(decimal: string, type: "latitude" | "longitude") {
  const num = parseFloat(decimal);
  if (isNaN(num) || decimal === "") return { degrees: "", direction: type === "latitude" ? "N" : "E" };
  const abs = Math.abs(num);
  // Don't reformat — just strip the sign, keep the raw string as-is
  const degrees = String(abs);
  let direction: string;
  if (type === "latitude") {
    direction = num >= 0 ? "N" : "S";
  } else {
    direction = num >= 0 ? "E" : "W";
  }
  return { degrees, direction };
}

/**
 * Converts degrees + direction back to decimal string
 */
function componentToDecimal(degrees: string, direction: string): string {
  const num = parseFloat(degrees);
  if (isNaN(num) || degrees === "") return "";
  const isNegative = direction === "S" || direction === "W";
  return isNegative ? (-Math.abs(num)).toString() : Math.abs(num).toString();
}

export function CoordinateInput({ type, value, onChange, label }: CoordinateInputProps) {
  const { degrees: initDeg, direction: initDir } = decimalToComponents(value, type);
  const [degrees, setDegrees] = useState(initDeg);
  const [direction, setDirection] = useState(initDir);

  // Only sync from external value on initial mount or when value changes from outside (auto-fill)
  useEffect(() => {
    if (value && value !== componentToDecimal(degrees, direction)) {
      const { degrees: d, direction: dir } = decimalToComponents(value, type);
      setDegrees(d);
      setDirection(dir);
    }
  }, [value]);

  const handleDegreesChange = (val: string) => {
    // Only allow numbers and decimal point
    const cleaned = val.replace(/[^0-9.]/g, "");
    setDegrees(cleaned);
    onChange(componentToDecimal(cleaned, direction));
  };

  const handleDirectionChange = (dir: string) => {
    setDirection(dir);
    onChange(componentToDecimal(degrees, dir));
  };

  const directions = type === "latitude" ? ["N", "S"] : ["E", "W"];
  const maxDeg = type === "latitude" ? 90 : 180;
  const placeholder = type === "latitude" ? "e.g. 9.0054" : "e.g. 38.7636";

  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2 items-center">
        <div className="flex-1 relative">
          <Input
            type="text"
            inputMode="decimal"
            placeholder={placeholder}
            value={degrees}
            onChange={(e) => handleDegreesChange(e.target.value)}
            className="pr-6"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">°</span>
        </div>
        <Select value={direction} onValueChange={handleDirectionChange}>
          <SelectTrigger className="w-20 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {directions.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {degrees && (
        <p className="text-xs text-muted-foreground">
          Decimal: {componentToDecimal(degrees, direction) || "—"}
          {" "}(max {maxDeg}°)
        </p>
      )}
    </div>
  );
}
