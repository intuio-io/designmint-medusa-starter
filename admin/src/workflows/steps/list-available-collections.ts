import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { DESIGNER_MODULE } from "../../modules/designer"
import { Modules } from "@medusajs/framework/utils"
import { DesignerServiceType } from "../../types/designer-service"

export const listAvailableCollectionsStep = createStep(
    "list-available-collections-step",
    async ({ }, { container }) => {
        try {
            // Resolve the product module service
            const productModuleService = container.resolve(Modules.PRODUCT)

            // Resolve the designer module service
            const designerService = container.resolve(DESIGNER_MODULE) as DesignerServiceType
            const designService: any = designerService.designService_

            // Get ONLY collection IDs that already have designs
            // Important: We need to use type assertion to work around TypeScript limitations
            const { designs } = await designService.list({
                // Type assertion to override TypeScript's type checking
                collection_id: { $ne: null } as any,
                limit: 1000
            })

            // Extract only collection IDs that are actually used
            const usedCollectionIds = designs
                .filter((d: any) => d.collection_id) // Additional safeguard
                .map((d: any) => d.collection_id)

            // Build the filter object correctly
            const filters: any = {}

            if (usedCollectionIds.length > 0) {
                filters.id = { $nin: usedCollectionIds }
            }

            // Use listAndCountProductCollections with the correct parameters
            const [collections, count] = await productModuleService.listAndCountProductCollections(
                filters,
                {
                    take: 100,
                }
            )

            // Filter out collections with handle starting with 'ads-' on the client side
            const filteredCollections = collections.filter(
                (collection: any) => !collection.handle?.startsWith('ads-')
            )

            return new StepResponse(
                { collections: filteredCollections, count: filteredCollections.length },
                null
            )
        } catch (error) {
            console.error("Error in listAvailableCollectionsStep:", error)
            return new StepResponse(
                { collections: [], count: 0 },
                null
            )
        }
    }
)
