// src/modules/designer/models/design.ts
import { model } from "@medusajs/framework/utils"
import { DesignType } from "./design-type"

export const Design = model.define("design", {
    id: model.id().primaryKey(),
    name: model.text(),
    img_url: model.text(),
    guide_url: model.text(),
    meta_data: model.json().nullable(),
    design_type: model.belongsTo(() => DesignType),
    collection_id: model.text().nullable(),
    product_id: model.text().nullable(),
})