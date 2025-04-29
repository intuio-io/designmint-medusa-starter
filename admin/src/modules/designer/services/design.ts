// src/modules/designer/services/design.ts
import { MedusaService } from "@medusajs/framework/utils"
import { MedusaError } from "@medusajs/utils"
import { EntityManager, FilterQuery } from "@mikro-orm/core"
import { Design } from "../models/design"
import { DesignType } from "../models/design-type"
import { Logger } from "@medusajs/types"

type CreateDesignInput = {
    name: string
    img_url: string
    guide_url: string
    meta_data?: Record<string, unknown>
    design_type_id: string
    collection_id?: string
    product_id?: string
}

type UpdateDesignInput = Partial<CreateDesignInput>

type ListOptions = {
    q?: string
    limit?: number
    offset?: number
    collection_id?: string
    product_id?: string
    order?: Record<string, "ASC" | "DESC">
}

type InjectedDependencies = {
    manager: EntityManager
    logger: Logger
}

export class DesignService extends MedusaService({
    design: Design,
}) {
    protected readonly logger_: Logger
    protected manager: EntityManager

    constructor(container: InjectedDependencies) {
        super(container)
        this.logger_ = container.logger
        this.manager = container.manager
    }

    /**
     * Lists designs with filtering, pagination, and search
     * @param options - query options for limiting and filtering results
     * @returns Object containing designs and count
     */
    async list(options: ListOptions = {}): Promise<{ designs: any[], count: number }> {
        const designRepo = this.manager.getRepository(Design)

        const {
            q,
            limit = 10,
            offset = 0,
            collection_id,
            product_id,
            order = { name: "DESC" },
        } = options

        // Build filter for search
        const whereConditions: Record<string, any> = {}

        if (q) {
            whereConditions.name = { $ilike: `%${q}%` }
        }

        if (collection_id) {
            whereConditions.collection_id = collection_id
        }

        if (product_id) {
            whereConditions.product_id = product_id
        }

        // Get count
        const count = await designRepo.count(whereConditions)

        // Get paginated results with relations
        const designs = await designRepo.find(whereConditions, {
            limit,
            offset,
            orderBy: order,
            populate: ["design_type"]
        } as any) // Using type assertion to avoid TypeScript errors

        return { designs, count }
    }

    /**
     * Gets a design by id
     * @param id - the id of the design to get
     * @param config - configuration for query
     * @returns the design
     */
    async retrieve(id: string, config: Record<string, any> = {}): Promise<any> {
        const designRepo = this.manager.getRepository(Design)

        // Create configuration for populate
        const findOptions: Record<string, any> = {
            ...config,
            populate: ["design_type"]
        }

        // If custom populate is provided in config, merge it
        if (config.populate) {
            findOptions.populate = Array.isArray(config.populate)
                ? [...findOptions.populate, ...config.populate]
                : findOptions.populate
        }

        const design = await designRepo.findOne({ id }, findOptions as any)

        if (!design) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Design with id: ${id} was not found`
            )
        }

        return design
    }

    /**
     * Creates a design
     * @param data - the design to create
     * @returns created design
     */
    async create(data: CreateDesignInput): Promise<any> {
        try {
            const designRepo = this.manager.getRepository(Design)

            // Validate that either collection_id or product_id is provided, but not both
            if ((!data.collection_id && !data.product_id) || (data.collection_id && data.product_id)) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `Either collection_id or product_id must be provided, but not both`
                )
            }

            // Check if collection already has a design
            if (data.collection_id) {
                const existingDesign = await designRepo.findOne({
                    collection_id: data.collection_id
                } as any)

                if (existingDesign) {
                    throw new MedusaError(
                        MedusaError.Types.DUPLICATE_ERROR,
                        `Collection with id ${data.collection_id} already has a design`
                    )
                }
            }

            // Check if product already has a design
            if (data.product_id) {
                const existingDesign = await designRepo.findOne({
                    product_id: data.product_id
                } as any)

                if (existingDesign) {
                    throw new MedusaError(
                        MedusaError.Types.DUPLICATE_ERROR,
                        `Product with id ${data.product_id} already has a design`
                    )
                }
            }

            const design = designRepo.create(data)

            this.manager.persist(design)
            await this.manager.flush()

            return design
        } catch (error) {
            this.logger_.error("Error creating design:", error)
            throw error
        }
    }

    /**
     * Updates a design
     * @param id - the id of the design to update
     * @param data - the update object
     * @returns updated design
     */
    async update(id: string, data: UpdateDesignInput): Promise<any> {
        try {
            // First retrieve the existing design
            const design = await this.retrieve(id)

            const designTypeRepo = this.manager.getRepository(DesignType)

            // Validate that we're not trying to set both collection_id and product_id
            if (data.collection_id && data.product_id) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `Cannot set both collection_id and product_id`
                )
            }

            // Check collection_id update
            if (data.collection_id && data.collection_id !== design.collection_id) {
                // If switching from product to collection, ensure product_id is cleared
                if (design.product_id) {
                    design.product_id = null
                }

                // Check if new collection already has a design
                const existingDesign = await this.manager.getRepository(Design).findOne({
                    collection_id: data.collection_id,
                    id: { $ne: id }
                } as any)

                if (existingDesign) {
                    throw new MedusaError(
                        MedusaError.Types.DUPLICATE_ERROR,
                        `Collection with id ${data.collection_id} already has a design`
                    )
                }
            }

            // Check product_id update
            if (data.product_id && data.product_id !== design.product_id) {
                // If switching from collection to product, ensure collection_id is cleared
                if (design.collection_id) {
                    design.collection_id = null
                }

                // Check if new product already has a design
                const existingDesign = await this.manager.getRepository(Design).findOne({
                    product_id: data.product_id,
                    id: { $ne: id }
                } as any)

                if (existingDesign) {
                    throw new MedusaError(
                        MedusaError.Types.DUPLICATE_ERROR,
                        `Product with id ${data.product_id} already has a design`
                    )
                }
            }

            if (data.design_type_id) {
                // Validate design type exists
                const designType = await designTypeRepo.findOne({ id: data.design_type_id })
                if (!designType) {
                    throw new MedusaError(
                        MedusaError.Types.NOT_FOUND,
                        `Design type with id ${data.design_type_id} not found`
                    )
                }
            }

            // Update the design with the data
            Object.assign(design, data)

            // Persist and flush
            this.manager.persist(design)
            await this.manager.flush()

            // Return the updated design
            return await this.retrieve(id)
        } catch (error) {
            this.logger_.error(`Error updating design with id: ${id}`, error)
            throw error
        }
    }

    /**
     * Deletes a design
     * @param id - the id of the design to delete
     */
    async delete(id: string): Promise<void> {
        try {
            const designRepo = this.manager.getRepository(Design)
            const design = await this.retrieve(id)

            await designRepo.nativeDelete({ id })
            await this.manager.flush()
        } catch (error) {
            this.logger_.error(`Error deleting design with id: ${id}`, error)
            throw error
        }
    }

    /**
     * Retrieves a design by collection ID
     * @param collectionId - the collection ID to find a design for
     * @returns the design or null if not found
     */
    async retrieveByCollectionId(collectionId: string): Promise<any | null> {
        const designRepo = this.manager.getRepository(Design)

        // Using type assertion to avoid TypeScript errors
        const design = await designRepo.findOne(
            { collection_id: collectionId } as any,
            { populate: ["design_type"] } as any
        )

        return design || null
    }

    /**
      * Retrieves a design by product ID
      * @param productId - the product ID to find a design for
      * @returns the design or null if not found
      */
    async retrieveByProductId(productId: string): Promise<any | null> {
        const designRepo = this.manager.getRepository(Design)

        // Using type assertion to avoid TypeScript errors
        const design = await designRepo.findOne(
            { product_id: productId } as any,
            { populate: ["design_type"] } as any
        )

        return design || null
    }
}

export default DesignService