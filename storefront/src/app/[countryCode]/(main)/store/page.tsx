import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import fetchClient from "@lib/util/fetchClient"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    categoryId?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, categoryId } = searchParams

  const { data } = await fetchClient(`/store/unique-product-options`, {
    method: "GET",
    next: { tags: ["home"] },
    credentials: "include",
  })

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      categoryId={categoryId}
      countryCode={params.countryCode}
      filters={data.product_options}
      searchParams={searchParams}
    />
  )
}
