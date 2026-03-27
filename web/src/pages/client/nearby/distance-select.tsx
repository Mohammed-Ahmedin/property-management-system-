"use client";

import * as React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const distances = [1, 3, 5, 10, 20, 50, 100]; // kms

export function DistanceSelect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // get current value from search params, default to 10 km
  const currentDistance = searchParams.get("distance") || "10";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("distance", value);
    } else {
      params.delete("distance");
    }

    navigate(`?${params.toString()}`);
  };

  return (
    <Select value={currentDistance} onValueChange={handleChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Distance (km)" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {distances.map((km) => (
            <SelectItem key={km} value={km.toString()}>
              {km >= 100 ? "100+ km" : km >= 20 ? `${km}+ km` : `${km} km`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
