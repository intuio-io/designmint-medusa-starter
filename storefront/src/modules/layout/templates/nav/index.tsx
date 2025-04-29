// NavServer.tsx
import fetchClient from "@lib/util/fetchClient"
import NavClient from "./NavClient"
import { retrieveCustomer } from "@lib/data/customer"

async function getNavData() {
  // Your existing data fetching code...
  const { data: categoryData } = await fetchClient(
    `/store/product-categories`,
    {
      method: "GET",
      next: { tags: ["home"] },
    }
  )

  const categories = categoryData?.product_categories?.filter(
    (x: any) => x?.parent_category == null
  )

  const { data: collectionData } = await fetchClient(
    `/store/collections?offset=0&limit=0`,
    {
      method: "GET",
      next: { tags: ["home"] },
    }
  )

  const collections = collectionData?.collections?.filter(
    (x: any) => x?.metadata
  )

  const banner = collectionData?.collections?.filter(
    (x: any) => x?.metadata?.title == "topbanner"
  )[0]?.metadata?.value

  return {
    categories: categories || [],
    collections: collections || [],
    banner: banner || "",
  }
}

const Nav = async () => {
  const { categories, collections, banner } = await getNavData()
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <>
      <NavClient
        initialCategories={categories}
        initialCollections={collections}
        initialBanner={banner}
        customer={customer}
      />
    </>
  )
}

export default Nav
