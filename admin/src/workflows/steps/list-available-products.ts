// src/workflows/steps/list-available-products.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { DESIGNER_MODULE } from "../../modules/designer"
import { Modules } from "@medusajs/framework/utils"
import { DesignerServiceType } from "../../types/designer-service" // ✅ Import type

export const listAvailableProductsStep = createStep(
    "list-available-products-step",
    async ({ }, { container }) => {
        try {
            // Resolve the product module service
            const productService = container.resolve(Modules.PRODUCT)

            // Resolve the designer module service
            const designerService = container.resolve(DESIGNER_MODULE) as DesignerServiceType
            const designService = designerService.designService_

            // Get ONLY product IDs that already have designs
            // Important: We need to use type assertion to work around TypeScript limitations
            const { designs } = await designService.list({
                // Type assertion to override TypeScript's type checking
                product_id: { $ne: null } as any,
                limit: 1000
            })

            // Extract only product IDs that are actually used
            const usedProductIds = designs
                .filter((d: any) => d.product_id) // Additional safeguard
                .map((d: any) => d.product_id)

            // Build the filter object correctly
            const filters: any = {}

            if (usedProductIds.length > 0) {
                filters.id = { $nin: usedProductIds }
            }

            // Use the product service to get products that don't have designs
            const [products, count] = await productService.listAndCountProducts(
                filters,
                {
                    take: 100
                }
            )

            return new StepResponse({ products, count }, null)
        } catch (error) {
            console.error("Error in listAvailableProductsStep:", error)
            return new StepResponse({ products: [], count: 0 }, null)
        }
    }
)
