import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/utils"
import { DESIGNER_MODULE } from "../../../../../modules/designer"
import { DesignerServiceType } from "../../../../../types/designer-service"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const { id } = req.params

    try {
        const type = await designerService.designTypeService_?.retrieve(id)
        res.json(type)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export async function PUT(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const { id } = req.params
    const { name }: any = req.body

    try {
        const type = await designerService.designTypeService_?.update(id, { name })
        res.json(type)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const { id } = req.params

    try {
        await designerService.designTypeService_?.delete(id)
        res.json({
            id,
            object: "design_type",
            deleted: true,
        })
    } catch (error) {
        if (error.type === MedusaError.Types.NOT_ALLOWED) {
            res.status(403).json({ message: error.message })
        } else {
            res.status(400).json({ message: error.message })
        }
    }
}
