import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

interface ProductOptionValue {
  value: string
}

interface ProductOption {
  id: string
  title: string
  values: ProductOptionValue[]
}

interface UniqueOption {
  id: string
  title: string
  values: Set<string> | string[] // Set initially, converted to string[]
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productModuleService = req.scope.resolve(Modules.PRODUCT)

  const options = await productModuleService.listProductOptions(
    {},
    {
      select: ['id', 'title'],
      relations: ['values'],
      take: 1000,
    }
  ) as ProductOption[]

  const uniqueOptionsWithValues: Record<string, UniqueOption> = options.reduce(
    (acc, option) => {
      if (!acc[option.title]) {
        acc[option.title] = {
          id: option.id,
          title: option.title,
          values: new Set(),
        }
      }

      option.values.forEach((value) => {
        (acc[option.title].values as Set<string>).add(value.value)
      })

      return acc
    },
    {} as Record<string, UniqueOption>
  )

  // Convert Sets to Arrays for JSON serialization
  Object.values(uniqueOptionsWithValues).forEach((option) => {
    option.values = Array.from(option.values as Set<string>)
  })

  res.json({
    product_options: Object.values(uniqueOptionsWithValues),
  })
}
