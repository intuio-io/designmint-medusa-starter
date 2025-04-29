import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DESIGNER_MODULE } from "../../../../../modules/designer"
import { Modules } from "@medusajs/framework/utils"
import { DesignerServiceType } from "../../../../../types/designer-service"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType // ✅ Type cast
    const designService = designerService.designService_
    const { id } = req.params

    try {
        const design = await designService.retrieve(id)

        // If the design has a collection_id or product_id, fetch additional details
        if (design.collection_id || design.product_id) {
            const productService = req.scope.resolve(Modules.PRODUCT)

            // If design has a collection_id, fetch collection details
            if (design.collection_id) {
                try {
                    const collection = await productService.retrieveProductCollection(design.collection_id)
                    design.collection = collection
                } catch (error) {
                    // If collection not found, just continue
                    console.error(`Collection with id ${design.collection_id} not found:`, error)
                }
            }

            // If design has a product_id, fetch product details
            if (design.product_id) {
                try {
                    const product = await productService.retrieveProduct(design.product_id)
                    design.product = product
                } catch (error) {
                    // If product not found, just continue
                    console.error(`Product with id ${design.product_id} not found:`, error)
                }
            }
        }

        res.json(design)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export async function PUT(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType // ✅ Type cast
    const designService = designerService.designService_
    const { id } = req.params
    const {
        name,
        img_url,
        guide_url,
        meta_data,
        design_type_id,
        collection_id,
        product_id
    }: any = req.body

    try {
        // Validate that we're not trying to set both collection_id and product_id
        if (collection_id && product_id) {
            res.status(400).json({
                message: "Cannot set both collection_id and product_id"
            })
            return
        }

        const design = await designService.update(id, {
            name,
            img_url,
            guide_url,
            meta_data,
            design_type_id,
            collection_id,
            product_id
        })

        res.json(design)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType // ✅ Type cast
    const designService = designerService.designService_
    const { id } = req.params

    try {
        await designService.delete(id)
        res.json({
            id,
            object: "design",
            deleted: true
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
