import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DESIGNER_MODULE } from "../../../../modules/designer"
import { Modules } from "@medusajs/framework/utils"
import { DesignerServiceType } from "../../../../types/designer-service"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const designService = designerService.designService_
    const { page, limit, q, collection_id, product_id } = req.query

    try {
        // First get the designs with pagination
        const { designs, count } = await designService.list({
            offset: page ? (parseInt(page as string) - 1) * (parseInt(limit as string) || 10) : 0,
            limit: parseInt(limit as string) || 10,
            q: q as string,
            collection_id: collection_id as string,
            product_id: product_id as string
        })

        // Access the product service for getting details
        const productService: any = req.scope.resolve(Modules.PRODUCT)

        // Enhanced designs array to be returned
        let enhancedDesigns = [...designs]

        // If we have designs with collection IDs, fetch the collection details
        const collectionIds = [...new Set(designs.map(d => d.collection_id))].filter(Boolean)
        if (collectionIds.length) {
            // Fetch all needed collections in one batch query
            const collections = await productService.listProductCollections({
                id: collectionIds,
            })

            // Create a map for faster lookups
            const collectionsMap = collections.reduce((acc, collection) => {
                acc[collection.id] = collection
                return acc
            }, {})

            // Enhance designs with collection details
            enhancedDesigns = enhancedDesigns.map(design => {
                if (design.collection_id) {
                    return {
                        ...design,
                        collection: collectionsMap[design.collection_id] || null
                    }
                }
                return design
            })
        }

        // If we have designs with product IDs, fetch the product details
        const productIds = [...new Set(designs.map(d => d.product_id))].filter(Boolean)
        if (productIds.length) {
            // Fetch all needed products in one batch query
            const products = await productService.listProducts({
                id: productIds,
            })

            // Create a map for faster lookups
            const productsMap = products.reduce((acc, product) => {
                acc[product.id] = product
                return acc
            }, {})

            // Enhance designs with product details
            enhancedDesigns = enhancedDesigns.map(design => {
                if (design.product_id) {
                    return {
                        ...design,
                        product: productsMap[design.product_id] || null
                    }
                }
                return design
            })
        }

        // Return enhanced designs
        return res.json({
            designs: enhancedDesigns,
            count,
            limit: parseInt(limit as string) || 10,
            offset: page ? (parseInt(page as string) - 1) * (parseInt(limit as string) || 10) : 0
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const designService = designerService.designService_
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
        // Validate required fields
        if (!name || !img_url || !design_type_id) {
            res.status(400).json({
                message: "name, img_url, and design_type_id are required"
            })
            return
        }

        // Validate that either collection_id or product_id is provided, but not both
        if ((!collection_id && !product_id) || (collection_id && product_id)) {
            res.status(400).json({
                message: "Either collection_id or product_id must be provided, but not both"
            })
            return
        }

        // Create the design with the appropriate target (collection or product)
        const design = await designService.create({
            name,
            img_url,
            guide_url: guide_url || "", // Provide default empty string if not provided
            meta_data,
            design_type_id,
            ...(collection_id ? { collection_id } : {}),
            ...(product_id ? { product_id } : {})
        })

        res.json(design)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
