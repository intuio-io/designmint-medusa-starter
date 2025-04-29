import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DESIGNER_MODULE } from "../../../../modules/designer"
import { DesignerServiceType } from "../../../../types/designer-service"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType

    try {
        const types = await designerService.designTypeService_?.list()
        res.json({ types })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const designerService = req.scope.resolve(DESIGNER_MODULE) as DesignerServiceType
    const { name }: any = req.body

    try {
        if (!name) {
            res.status(400).json({ message: "name is required" })
            return
        }

        const type = await designerService.designTypeService_?.create({ name })
        res.json({ type })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
