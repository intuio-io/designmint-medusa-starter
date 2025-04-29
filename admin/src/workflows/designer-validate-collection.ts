// src/workflows/designer-validate-collection.ts
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { validateCollectionStep, ValidateCollectionInput } from "./steps/validate-collection"

export const validateCollectionWorkflow = createWorkflow(
    "designer-validate-collection",
    (input: ValidateCollectionInput) => {
        const validationResult = validateCollectionStep(input)
        return new WorkflowResponse(validationResult)
    }
)

export default validateCollectionWorkflow