"use client"

import type React from "react"

import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useQueryParams } from "@/hooks/use-query-params"
import { useEffect, useState } from "react"

interface FilterOption {
  label: string
  value: string
}

interface DataFiltersProps {
  typeOptions?: FilterOption[]
  sortOptions?: FilterOption[]
  additionalFilters?: React.ReactNode
  onFilterChange?: (filters: Record<string, string>) => void
}

export function DataFilters({
  typeOptions = [],
  sortOptions = [
    { label: "Newest First", value: "createdAt:desc" },
    { label: "Oldest First", value: "createdAt:asc" },
    { label: "Name (A-Z)", value: "name:asc" },
    { label: "Name (Z-A)", value: "name:desc" },
  ],
  additionalFilters,
  onFilterChange,
}: DataFiltersProps) {
  const { setQueryParams, getQueryParam, getAllParams } = useQueryParams()
  const [searchInput, setSearchInput] = useState(getQueryParam("search"))
  const [isOpen, setIsOpen] = useState(false)

  const currentType = getQueryParam("type")
  const currentSort =
    getQueryParam("sortField") && getQueryParam("sortDirection")
      ? `${getQueryParam("sortField")}:${getQueryParam("sortDirection")}`
      : "createdAt:desc"

  useEffect(() => {
    setSearchInput(getQueryParam("search"))
  }, [getQueryParam])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setQueryParams({ search: searchInput, page: 1 })
    onFilterChange?.(getAllParams())
  }

  const handleTypeChange = (value: string) => {
    setQueryParams({ type: value === "all" ? null : value, page: 1 })
    onFilterChange?.(getAllParams())
  }

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split(":")
    setQueryParams({ sortField: field, sortDirection: direction, page: 1 })
    onFilterChange?.(getAllParams())
  }

  const clearFilters = () => {
    setSearchInput("")
    setQueryParams({
      search: null,
      type: null,
      sortField: null,
      sortDirection: null,
      page: 1,
    })
    onFilterChange?.({})
  }

  const activeFilterCount = [getQueryParam("search"), currentType].filter(Boolean).length

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchInput && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={() => {
              setSearchInput("")
              setQueryParams({ search: null, page: 1 })
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {/* Desktop Filters */}
      <div className="hidden sm:flex items-center gap-2">
        {typeOptions.length > 0 && (
          <Select value={currentType || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>

      {/* Mobile Filters */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="sm:hidden relative bg-transparent">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine your search with filters and sorting</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {typeOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={currentType || "all"} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={currentSort} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {additionalFilters}

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  clearFilters()
                  setIsOpen(false)
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
