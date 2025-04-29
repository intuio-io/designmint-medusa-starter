import { defineMiddlewares, validateAndTransformBody } from "@medusajs/framework/http"
import multer from "multer"

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
})

export default defineMiddlewares({
    routes: [
        {
            method: ["POST"],
            matcher: "/store/upload",
            bodyParser: false,
            middlewares: [
                // @ts-ignore
                upload.single("file"),
            ],
        },
    ],
})
