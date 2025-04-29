// src/modules/designer/index.ts
import { Module } from "@medusajs/framework/utils"
import DesignerService from "./service"

export const DESIGNER_MODULE = "designer"

export default Module(DESIGNER_MODULE, {
    service: DesignerService,
})

export * from "./models"
export * from "./services"