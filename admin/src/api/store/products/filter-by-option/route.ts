// import {
//   MedusaRequest,
//   MedusaResponse,
// } from "@medusajs/framework/http"
// import {
//   ContainerRegistrationKeys,
// } from "@medusajs/framework/utils"

// export const GET = async (
//   req: MedusaRequest,
//   res: MedusaResponse
// ) => {
//   const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

//   // Get title and value from query parameters, with defaults
//   const title:any = req.query.title || "Color"
//   const value:any = req.query.value || "Black"

//   // First, get the product_option IDs where title matches
//   const { data: productOptions } = await query.graph({
//     entity: "product_option",
//     fields: ["id", "product_id"],
//     filters: {
//       title
//     }
//   })

//   if (!productOptions || productOptions.length === 0) {
//     return res.json({ my_customs: [] })
//   }

//   const productMap = new Map<any, any>(
//     productOptions
//       .filter(po => po.id && po.product_id)
//       .map(po => [po.id, po.product_id])
//   )

//   // Fetch all product_option_values and filter manually
//   const { data: productOptionValues } = await query.graph({
//     entity: "product_option_value",
//     fields: ["option_id", "value"]
//   })

//   const filteredProducts = productOptionValues
//     .filter(pov => 
//       pov.option_id && productMap.has(pov.option_id) && pov.value === value
//     )
//     .map(pov => productMap.get(pov.option_id)!)
//     .filter((pid): pid is string => pid !== undefined) // Ensure valid product IDs

//   res.json({ products: filteredProducts })
// }


import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import Medusa from "@medusajs/medusa-js";

const medusaClient = new Medusa({
  baseUrl: `${process.env.MEDUSA_BACKEND_URL}`,
  maxRetries: 3,
  publishableApiKey:`${process.env.MEDUSA_PK}`,
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const regionId = req.headers["x-region-id"];
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  // Extract and sanitize query parameters
  const titles = Array.isArray(req.query.title) ? req.query.title : [req.query.title];
  const values = Array.isArray(req.query.value) ? req.query.value : [req.query.value];

  const validTitles: any = titles.filter(Boolean);
  const validValues: any = values.filter(Boolean);

  if (validTitles.length === 0 || validValues.length === 0) {
    return res.json({ products: [] });
  }

  // Create a mapping of title → set of valid values (OR within same option)
  const titleValueMap = new Map<string, Set<string>>();
  for (let i = 0; i < validTitles.length; i++) {
    const title = validTitles[i];
    const value = validValues[i];

    if (!titleValueMap.has(title)) {
      titleValueMap.set(title, new Set());
    }
    titleValueMap.get(title)?.add(value);
  }

  // Fetch product options where title matches
  const { data: productOptions } = await query.graph({
    entity: "product_option",
    fields: ["id", "product_id", "title"],
    filters: {
      title: { $in: validTitles },
    },
  });

  if (!productOptions || productOptions.length === 0) {
    return res.json({ products: [] });
  }

  // Map option_id to product_id and title
  const optionToProductMap = new Map<string, { product_id: string, title: string }>();
  productOptions.forEach((po) => {
    if (po.id && po.product_id) {
      optionToProductMap.set(po.id, { product_id: po.product_id, title: po.title });
    }
  });

  // Fetch all product option values
  const { data: productOptionValues } = await query.graph({
    entity: "product_option_value",
    fields: ["option_id", "value"],
  });

  // Map to store matching product option counts
  const productMatchCount = new Map<string, Set<string>>();

  productOptionValues.forEach((pov: any) => {
    const productOption = optionToProductMap.get(pov.option_id);
    if (!productOption) return;

    const { product_id, title } = productOption;

    // Check if the value matches any of the allowed values for this option
    if (titleValueMap.has(title) && titleValueMap.get(title)?.has(pov.value)) {
      if (!productMatchCount.has(product_id)) {
        productMatchCount.set(product_id, new Set());
      }
      productMatchCount.get(product_id)?.add(title);
    }
  });

  // Filter products that match all required options (AND across options)
  const requiredOptionCount = titleValueMap.size;
  const filteredProductIds = Array.from(productMatchCount.entries())
    .filter(([_, matchedOptions]) => matchedOptions.size === requiredOptionCount) // Must match at least one value for each option
    .map(([productId]) => productId);

  if (filteredProductIds.length === 0) {
    return res.json({ products: [] });
  }

  try {
    const response = await medusaClient.products.list({
      id: filteredProductIds, // Pass only the products that match all conditions
      fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags",
      region_id: regionId,
    });

    res.json({ products: response.products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};




