// lib/stores/useZStore.ts
import { create } from 'zustand'

interface FilterOption {
  option_id: string
  value: string
}

interface FilterState {
  options: FilterOption[]
}

interface ZStore {
  filters: FilterState
  setOptions: (options: FilterState) => void
  clearFilters: () => void
}

const useZStore = create<ZStore>((set) => ({
  filters: {
    options: [],
  },
  setOptions: (selectedFilters) => set({ filters: selectedFilters }),
  clearFilters: () => set({ filters: { options: [] } }),
}))

export default useZStore

// Helper function to transform filters into query parameters
export const transformFiltersToQuery = (filters: FilterState) => {
  // Group by option_id
  const groupedFilters: Record<string, string[]> = {}
  
  if (!filters || !filters.options || filters.options.length === 0) {
    return {}
  }
  
  filters.options.forEach(filter => {
    if (!groupedFilters[filter.option_id]) {
      groupedFilters[filter.option_id] = []
    }
    groupedFilters[filter.option_id].push(filter.value)
  })
  
  // Transform to query format for MedusaJS
  const query: Record<string, string[]> = {}
  
  Object.entries(groupedFilters).forEach(([key, values]) => {
    // For MedusaJS v2, this is how we structure filter queries
    query[`variant_options.${key}`] = values
  })
  
  return query
}