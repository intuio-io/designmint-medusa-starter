import { Suspense } from "react"
import { Metadata } from "next"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import SortOrder from "../components/sort-order"
import Filters from "../components/dynamic-filters"
import { transformFiltersToQuery } from "zustand/useZStore"
import FilterSidebar from "../components/dynamic-filters/FilterSidebar"

export const dynamic = "force-dynamic"

type Props = {
  params: { slug?: string }
  searchParams: {
    sortBy?: SortOptions
    page?: string
    filter_?: Record<string, string>
    [key: string]: any
  }
}

const StoreTemplate = async ({
  sortBy,
  page,
  categoryId,
  countryCode,
  filters,
  searchParams,
}: {
  sortBy?: SortOptions
  page?: string
  categoryId?: string
  countryCode: string
  filters: any
  searchParams: Record<string, string | string[]>
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const filterParams: Record<string, string[]> = {}
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key.startsWith("filter_")) {
      const optionId = key.replace("filter_", "")
      const values = Array.isArray(value) ? value : [value]
      filterParams[`variant_options.${optionId}`] = values
    }
  })

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container relative max-w-7xl mx-auto my-12 px-4 sm:px-6"
      data-testid="category-container"
    >
      <FilterSidebar filters={filters} />
      <div className="w-full px-4">
        <div className="mb-8 text-2xl font-semibold">
          <h1 data-testid="store-page-title">All products</h1>
        </div>

        <SortOrder sortOrder={sort} />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={categoryId}
            countryCode={countryCode}
            filterParams={filterParams}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
