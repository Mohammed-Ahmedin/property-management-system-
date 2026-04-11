import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
  showLimitSelector?: boolean;
  dataLength?: number;
  className?: string;
  summaryText?: string;
}

export function PaginationControls({
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [3, 5, 10, 20, 50, 75, 100],
  showLimitSelector = true,
  className = "",
  dataLength,
  summaryText,
}: PaginationControlsProps) {
  const { currentPage, totalPages, totalItems, limit, nextPage, previousPage } =
    pagination;
  if (!summaryText)
    summaryText = `Showing ${dataLength} of ${pagination.totalItems}`;

  const handleLimitChange = useCallback(
    (value: string) => {
      onLimitChange(Number(value));
      // When changing limit, we typically want to reset to page 1
      onPageChange(1);
    },
    [onLimitChange, onPageChange]
  );

  return (
    <div
      className={`flex items-center justify-between border-t pt-4 ${className}`}
    >
      {/* <div className="text-sm text-muted-foreground">
        {summaryText || `Showing ${limit} of ${totalItems} items`}
      </div> */}
      <div />

      <div className="flex items-center gap-6">
        {showLimitSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Properties per page</span>
            <Select value={limit.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={limit.toString()} />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(previousPage || 1)}
              disabled={!previousPage}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(nextPage || totalPages)}
              disabled={!nextPage}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
