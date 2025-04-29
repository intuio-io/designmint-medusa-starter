"use client"
import { useEffect, useState } from "react"
import { getRecentlyViewed } from "@lib/util/recentlyViewed"
import { sdk } from "@lib/config"

export default function RecentlyViewed() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const ids = getRecentlyViewed()

    if (ids.length > 0) {
      sdk.store.product
        .list({
          id: ids,
        })
        .then(({ products }) => {
          const ordered: any = ids
            .map((id) => products.find((p) => p.id === id))
            .filter(Boolean)
          setProducts(ordered)
        })
    }
  }, [])

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
    <section aria-labelledby="favorites-heading">
      <div className="mx-auto px-8 py-2 sm:px-6 sm:py-2 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2
            id="favorites-heading"
            className="text-3xl tracking-tight text-gray-900"
          >
            Your recently viewed items
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-6 sm:gap-x-6 sm:gap-y-0 lg:gap-x-8">
          {products.map((product: any) => {
            const pricing = getProductPricing(product)

            return (
              <div
                key={product.id}
                className="w-full rounded-md  overflow-hidden"
              >
                <a href={`/products/${product.handle}`}>
                  <div className="relative flex  h-48 w-full overflow-hidden bg-gray-100">
                    <img
                      src={product.thumbnail}
                      alt="Product"
                      className="w-full h-full rounded-2xl border"
                    />

                    {/* Uncomment this while implementing Add to Cart */}
                    {/* <button className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </button> */}
                    <span className="absolute bottom-1 right-2 text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-0.5 rounded">
                      Image by Freepik
                    </span>
                  </div>

                  <div className=" py-3">
                    <h3 className="text-gray-700 font-semibold">
                      {product.title}
                    </h3>
                    <span className="text-gray-500 mt-2">
                      {pricing?.formattedAmount
                        ? `Starting from ` + pricing?.formattedAmount
                        : ""}
                    </span>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
