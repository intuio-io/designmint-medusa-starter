"use client"

import { useSearchParams } from "next/navigation"
import StoreTemplate from "."

const StoreWrapper = ({
  categoryId,
  countryCode,
  filters,
}: {
  categoryId?: string
  countryCode: string
  filters: any
}) => {
  const searchParams = useSearchParams()
  const sortBy = searchParams.get("sortBy") || "created_at"
  const page = searchParams.get("page") || "1"

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      categoryId={categoryId}
      countryCode={countryCode}
      filters={filters}
    />
  )
}

export default StoreWrapper
