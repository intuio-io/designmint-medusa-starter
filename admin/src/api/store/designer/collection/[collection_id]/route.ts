// src/api/routes/store/designer/designs/[collection_id]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DESIGNER_MODULE } from "../../../../../modules/designer"
import { DesignerServiceType } from "../../../../../types/designer-service"  // Import the type

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    // Resolve designerService and cast to DesignerServiceType
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const designService: any = designerService.designService_
    const { collection_id } = req.params

    try {
        // Check if collection_id is provided
        if (!collection_id) {
            res.status(400).json({
                message: "collection_id is required"
            })
            return
        }

        // Attempt to retrieve design by collection_id
        const design = await designService.retrieveByCollectionId(collection_id)

        // If design exists, return 200 with the design
        if (design) {
            res.status(200).json(design)
        } else {
            // If no design found, return 201 with null
            res.status(201).json(null)
        }
    } catch (error) {
        // Catch errors and return status 400 with error message
        res.status(400).json({
            message: error.message
        })
    }
}
