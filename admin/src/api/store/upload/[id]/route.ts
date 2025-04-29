// src/api/store/upload/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { deleteFilesWorkflow } from "@medusajs/medusa/core-flows"

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const { id } = req.params

    if (!id) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "File ID is required"
        )
    }

    const { result } = await deleteFilesWorkflow(req.scope).run({
        input: {
            ids: [id]
        },
    })

    res.status(200).json({ success: true })
}