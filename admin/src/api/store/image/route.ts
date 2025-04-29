import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs";
import path from "path";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    try {
        const fileName = req.query.fileName as string;
        if (!fileName) {
            return res.status(400).json({ message: "File name is required" });
        }

        // Get the uploads directory path (adjust according to your Medusa configuration)
        const uploadsDir = path.join(process.cwd(), "static");
        const filePath = path.join(uploadsDir, fileName);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        // Set proper headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'image/png');

        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        return fileStream.pipe(res);
    } catch (error) {
        console.error("Error serving image:", error);
        return res.status(500).json({ message: "Error serving image" });
    }
}