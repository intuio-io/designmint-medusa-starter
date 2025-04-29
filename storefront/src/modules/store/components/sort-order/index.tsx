"use client"

import React, { useEffect, useState } from "react"
import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

const SortOrder = ({ sortOrder }: any) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState("created_at")

  useEffect(() => {
    setSortBy(sortOrder)
  }, [sortOrder])

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value)
    setQueryParams("sortBy", event.target.value)
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex justify-between items-center p-4 -mt-5">
      <div>
        <p className="text-lg font-semibold"></p>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Sort by:</label>
        <select
          id="sort"
          className="border border-gray-300 rounded px-3 py-1 text-sm cursor-pointer"
          onChange={handleSortChange}
          value={sortBy}
        >
          <option value="created_at">Latest Arrival</option>
          <option value="price_asc">Low to High</option>
          <option value="price_desc">High to Low</option>
        </select>
      </div>
    </div>
  )
}

export default SortOrder
