import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import PreviewPrice from "./price"
import AddToCartButton from "./addToCart"

export default function ProductPreview({
  product,
  isFeatured,
  region,
  pricing,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  pricing?: any
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <div key={product.id} className="w-full max-w-sm mx-auto overflow-hidden">
      <a href={`products/${product.handle}`}>
        <div
          className="relative flex justify-end h-56 w-full bg-contain bg-gray-100 bg-no-repeat border rounded-3xl p-4"
          style={{
            backgroundImage: `url('${product.thumbnail}')`,
            backgroundPosition: "center",
          }}
        >
          <span className="absolute bottom-1 right-2 text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-0.5 rounded">
            Image by Freepik
          </span>
        </div>

        <div className="py-3 ">
          <h3
            className="text-gray-700 font-semibold truncate w-[150px] overflow-hidden whitespace-nowrap"
            title={product.title} // This shows the full title on hover
          >
            {product.title.length > 22
              ? product.title.substring(0, 19) + "..."
              : product.title}
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
}
