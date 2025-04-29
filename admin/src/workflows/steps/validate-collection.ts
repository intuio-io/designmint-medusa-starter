// src/workflows/steps/validate-collection.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

// Define the return types for better type safety
type ValidateCollectionResult = {
    exists: boolean;
    collection?: any;
    error?: string;
}

// Input type for the step
export type ValidateCollectionInput = {
    collectionId: string
}

export const validateCollectionStep = createStep(
    "validate-collection-step",
    async ({ collectionId }: ValidateCollectionInput, { container }) => {
        try {
            // Resolve the product module service using the Modules utility
            const productModuleService = container.resolve(Modules.PRODUCT)

            // Use the product service to check if the collection exists
            const collection = await productModuleService.retrieveProductCollection(collectionId)

            // Return a successful result
            return new StepResponse<undefined, ValidateCollectionResult>(
                undefined,
                { exists: true, collection }
            )
        } catch (error) {
            console.error("Error in validateCollectionStep:", error)

            // Return a failure result
            return new StepResponse<undefined, ValidateCollectionResult>(
                undefined,
                { exists: false, error: error.message }
            )
        }
    }
)