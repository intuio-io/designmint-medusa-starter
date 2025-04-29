// src/api/store/upload/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
) {

    const file = req.file as Express.Multer.File

    if (!file) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "No file was uploaded"
        )
    }

    const { result } = await uploadFilesWorkflow(req.scope).run({
        input: {
            files: [{
                filename: file.originalname,
                mimeType: file.mimetype,
                content: file.buffer.toString("binary"),
                access: "public",
            }],
        },
    })

    res.status(200).json({ files: result })
}