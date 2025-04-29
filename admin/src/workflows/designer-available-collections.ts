// src/workflows/designer-available-collections.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { listAvailableCollectionsStep } from "./steps/list-available-collections"

export const listAvailableCollectionsWorkflow = createWorkflow(
    "designer-available-collections",
    () => {
        const { collections, count } = listAvailableCollectionsStep()
        return new WorkflowResponse({
            collections,
            count
        })
    }
)

export default listAvailableCollectionsWorkflow