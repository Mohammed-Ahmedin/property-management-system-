"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export function useQueryParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueryParams = useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })

      const search = current.toString()
      const query = search ? `?${search}` : ""

      router.push(`${pathname}${query}`, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  const getQueryParam = useCallback(
    (key: string, defaultValue?: string) => {
      return searchParams.get(key) || defaultValue || ""
    },
    [searchParams],
  )

  const getAllParams = useCallback(() => {
    const params: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    return params
  }, [searchParams])

  return {
    setQueryParams,
    getQueryParam,
    getAllParams,
    searchParams,
  }
}
