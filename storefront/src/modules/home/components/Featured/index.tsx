import React from "react"
import fetchClient from "@lib/util/fetchClient"
import Featured from "./Featured"

async function getLatestProducts(region_id: any) {
  const searchParams = new URLSearchParams({
    region_id,
  })

  const { data } = await fetchClient(
    `/store/products?${searchParams.toString()}`,
    {
      method: "GET",
      next: { tags: ["home"] },
    }
  )

  const products = data?.products

  if (!products) {
    return []
  }
  const publishedProducts = products.filter(
    (product: any) => product.handle != ""
  )

  return publishedProducts.slice(0, 6)
}

const FeaturedPro = async ({ region }: any) => {
  const products = await getLatestProducts(region.id)

  return <Featured products={products} />
}

export default FeaturedPro
