// src/api/routes/admin/designer/available-collections/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listAvailableCollectionsWorkflow } from "../../../../workflows/designer-available-collections"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    try {
        // Use the workflow to get available collections
        const { result } = await listAvailableCollectionsWorkflow(req.scope).run()

        res.json({
            collections: result.collections,
            count: result.count
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}