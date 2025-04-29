// src/api/routes/store/designer/designs/[collection_id]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DESIGNER_MODULE } from "../../../../../modules/designer"
import { DesignerServiceType } from "../../../../../types/designer-service" // Importing the type

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    // Resolve the designer service and cast it to DesignerServiceType
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const designService: any = designerService.designService_
    const { product_id } = req.params

    try {
        if (!product_id) {
            res.status(400).json({
                message: "product_id is required"
            })
            return
        }

        const design = await designService.retrieveByProductId(product_id)

        // If design exists, return 200 with the design
        if (design) {
            res.status(200).json(design)
        } else {
            // If no design found, return 201 with null
            res.status(201).json(null)
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}
