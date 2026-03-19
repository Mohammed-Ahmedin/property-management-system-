"use client";

import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

export default function SortPopover() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current sort from URL
  const currentSort = searchParams.get("sort") || "";

  const handleSortChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort"); // clear sort
    }
    navigate(`?${params.toString()}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 max-sm:flex-1 py-6"
        >
          Sort
          <ChevronDown className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2">
        <div className="flex flex-col gap-2">
          {/* Latest */}
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={() => handleSortChange("latest")}
          >
            {currentSort === "latest" && <Check className="w-4 h-4" />}
            Latest
          </Button>

          {/* Oldest */}
          <Button
            variant="ghost"
            className="justify-start gap-2"
            onClick={() => handleSortChange("oldest")}
          >
            {currentSort === "oldest" && <Check className="w-4 h-4" />}
            Oldest
          </Button>

          {/* Clear */}
          {currentSort && (
            <>
              <Button
                variant="destructive"
                className="justify-start gap-2 mt-2"
                onClick={() => handleSortChange(null)}
              >
                Clear
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
