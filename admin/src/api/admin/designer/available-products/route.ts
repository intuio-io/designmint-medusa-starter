// src/api/admin/designer/available-products/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import listAvailableProductsWorkflow from "../../../../workflows/designer-available-products"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    try {
        // Run the workflow with the scope
        const { result } = await listAvailableProductsWorkflow(req.scope).run()

        res.json({
            products: result.products,
            count: result.count
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}