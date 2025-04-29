// src/workflows/designer-available-products.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { listAvailableProductsStep } from "./steps/list-available-products"

export const listAvailableProductsWorkflow = createWorkflow(
    "designer-available-products",
    () => {
        const { products, count } = listAvailableProductsStep()
        return new WorkflowResponse({
            products,
            count
        })
    }
)

export default listAvailableProductsWorkflow