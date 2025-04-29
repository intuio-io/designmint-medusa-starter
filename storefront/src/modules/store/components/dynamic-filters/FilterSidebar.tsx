"use client"

import { useState } from "react"
import Filters from "."
import { Filter } from "lucide-react"

const FilterSidebar = ({ filters }: { filters: any }) => {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border text-gray-900 rounded-2xl"
        >
          <Filter /> <span>Filters</span>
        </button>
      </div>

      {/* Slide-in Filters (Mobile) */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-40"
            onClick={() => setShowFilters(false)}
          />
          <div className="fixed top-0 left-0 z-40 w-4/5 max-w-sm h-full bg-white p-4 overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-gray-500 hover:text-black"
              >
                Close
              </button>
            </div>
            <Filters filters={filters} />
          </div>
        </>
      )}

      {/* Desktop Static Filters */}
      <div className="hidden sm:block w-full max-w-xs px-6">
        <Filters filters={filters} />
      </div>
    </>
  )
}

export default FilterSidebar
