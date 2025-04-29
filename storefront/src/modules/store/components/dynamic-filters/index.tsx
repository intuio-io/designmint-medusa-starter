"use client"
import { sdk } from "@lib/config"
import React, { useEffect, useState, useRef } from "react"
import useZStore from "zustand/useZStore"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const Filters = ({ filters }: any) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedFilters, setSelectedFilters] = useState<{ options: any[] }>(
    () => {
      const params = new URLSearchParams(searchParams)
      const initialFilters: any[] = []

      filters.forEach((option: any) => {
        const values = params.getAll(option.title)
        values.forEach((value) => {
          initialFilters.push({ option_title: option.title, value })
        })
      })

      return { options: initialFilters }
    }
  )

  // Keep all filters expanded
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>(
    () => {
      const initialOpenFilters: Record<string, boolean> = {}
      filters.forEach((option: any) => {
        initialOpenFilters[option.title] = true
      })
      return initialOpenFilters
    }
  )

  const { setOptions } = useZStore()

  const handleCheckboxChange = (title: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      let updatedOptions = [...prevFilters.options]
      const existingIndex = updatedOptions.findIndex(
        (item) => item.option_title === title && item.value === value
      )

      if (existingIndex === -1) {
        updatedOptions.push({ value, option_title: title })
      } else {
        updatedOptions.splice(existingIndex, 1)
      }

      return { options: updatedOptions }
    })
  }

  const removeFilter = (title: string, value: string) => {
    setSelectedFilters((prevFilters) => {
      return {
        options: prevFilters.options.filter(
          (item) => !(item.option_title === title && item.value === value)
        ),
      }
    })
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    filters.forEach((option: any) => {
      params.delete(option.title)
    })

    selectedFilters.options.forEach(({ option_title, value }) => {
      params.append(option_title, value)
    })

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [selectedFilters])

  return (
    <div className=" mx-auto p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filter Options
      </h3>

      {/* Selected Filters Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedFilters.options.map(({ option_title, value }) => (
          <div
            key={`${option_title}-${value}`}
            className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
          >
            {value}
            <button
              onClick={() => removeFilter(option_title, value)}
              className="ml-2 text-gray-600 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {filters.map((option: any) => (
        <div key={option.title} className="mb-4">
          <button className="w-full text-left text-md font-medium text-gray-700 flex justify-between items-center py-2 border-b">
            {option.title}
            <span>-</span>
          </button>

          <div className="mt-2">
            <div className="flex flex-col gap-2">
              {option.values.map((value: string) => {
                const isChecked = selectedFilters.options.some(
                  (item) =>
                    item.option_title === option.title && item.value === value
                )

                return (
                  <label
                    key={value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox text-indigo-600"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(option.title, value)}
                    />
                    <span className="text-gray-700">{value}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Filters
