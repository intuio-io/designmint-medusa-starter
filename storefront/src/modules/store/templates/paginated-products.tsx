import { sdk } from "@lib/config"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import fetchClient from "@lib/util/fetchClient"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  [key: string]: any // Allow for dynamic filter properties
}

// Function to convert object to query string
const createQueryString = (params: any) => {
  return Object.keys(params)
    .flatMap((key) => {
      const values = Array.isArray(params[key]) ? params[key] : [params[key]]
      return values.map(
        (value) =>
          `title=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`
      )
    })
    .join("&")
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  filterParams = {},
  searchParams,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  filterParams?: Record<string, string[]>
  searchParams?: any
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  // Add filter parameters
  Object.entries(filterParams).forEach(([key, values]) => {
    queryParams[key] = values
  })

  delete searchParams.sortBy
  delete searchParams.categoryId

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let products = []
  let count = 0
  if (searchParams && Object.keys(searchParams).length > 0) {
    const queryString = createQueryString(searchParams) // Create the query string

    console.log("queryString", queryString)

    const { data } = await fetchClient(
      `/store/products/filter-by-option?${queryString}`,
      {
        method: "GET",
        next: { tags: ["home"] },
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Region-Id": region?.id, // Pass regionId in the headers
        },
      }
    )

    products = data?.products

    console.log("producrs", products)

    count = (data?.products).length
  } else {
    const data = await listProductsWithSort({
      page,
      queryParams,
      sortBy,
      countryCode,
    })

    products = data?.response?.products
    count = data?.response?.count
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  function getProductPricing(product: any) {
    if (!product.variants?.[0]?.calculated_price?.calculated_amount) {
      return null
    }

    const defaultPrice = product.variants[0].calculated_price.original_amount
    const formattedPrice = defaultPrice.toFixed(2)

    return {
      amount: defaultPrice.amount,
      formattedAmount: `$${formattedPrice}`,
      currencyCode: defaultPrice.currency_code,
    }
  }

  return (
    <>
      <div className="mb-4">
        <p className="text-gray-700">
          {count} {count === 1 ? "product" : "products"} found
        </p>
      </div>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-xl text-gray-500">No products found</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <ul
            className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
            data-testid="products-list"
          >
            {products.map((p: any) => {
              const pricing = getProductPricing(p)

              return (
                <li key={p.id}>
                  <ProductPreview
                    product={p}
                    region={region}
                    pricing={pricing}
                  />
                </li>
              )
            })}
          </ul>
          {totalPages > 1 && (
            <Pagination
              data-testid="product-pagination"
              page={page}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </>
  )
}
