// src/modules/designer/models/design-type.ts
import { model } from "@medusajs/framework/utils"

export const DesignType = model.define("design_type", {
    id: model.id().primaryKey(),
    name: model.text(),
})