import fetchClient from "@lib/util/fetchClient"
import CategoriesClient from "./CategoriesClient"

async function getNavData() {
  const { data: categoryData } = await fetchClient(
    `/store/product-categories`,
    {
      method: "GET",
      next: { tags: ["home"] },
    }
  )

  const categories =
    categoryData?.product_categories?.filter(
      (x: any) => x?.parent_category == null
    ) || []

  return { categories }
}

const Categories = async () => {
  const { categories } = await getNavData()

  return <CategoriesClient categories={categories} />
}

export default Categories
