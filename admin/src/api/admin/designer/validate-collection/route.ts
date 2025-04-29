// src/api/routes/admin/designer/validate-collection/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { validateCollectionWorkflow } from "../../../../workflows/designer-validate-collection"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const collectionId = req.query.id as string

    if (!collectionId) {
        return res.status(400).json({
            message: "Collection ID is required"
        })
    }

    try {
        // Use the workflow to validate the collection
        const { result }: any = await validateCollectionWorkflow(req.scope).run({
            input: { collectionId }
        })

        if (result.exists) {
            res.json({
                exists: true,
                collection: result.collection
            })
        } else {
            res.status(404).json({
                exists: false,
                message: "Collection not found"
            })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}