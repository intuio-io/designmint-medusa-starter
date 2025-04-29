// src/modules/designer/services/design-type.ts
import { MedusaService } from "@medusajs/framework/utils"
import { MedusaError } from "@medusajs/utils"
import { EntityManager } from "@mikro-orm/core"
import { DesignType } from "../models/design-type"
import { Design } from "../models/design"
import { Logger } from "@medusajs/types"

type DesignTypeData = {
    name: string
}

type InjectedDependencies = {
    manager: EntityManager
    logger: Logger
}

export class DesignTypeService extends MedusaService({
    designType: DesignType,
}) {
    protected readonly logger_: Logger
    protected manager: EntityManager

    constructor(container: InjectedDependencies) {
        super(container)
        this.logger_ = container.logger
        this.manager = container.manager
    }

    /**
     * Lists all design types
     * @returns Array of design types
     */
    async list(config: Record<string, any> = {}): Promise<any[]> {
        const designTypeRepo = this.manager.getRepository(DesignType)

        // Define the default ordering
        const order = { name: "DESC" };

        const findOptions = {
            ...config,
            orderBy: order
        }

        return await designTypeRepo.find({}, findOptions as any)
    }

    /**
     * Gets a design type by id
     * @param id - the id of the design type to get
     * @param config - configuration for query
     * @returns the design type
     */
    async retrieve(id: string, config: Record<string, any> = {}): Promise<any> {
        const designTypeRepo = this.manager.getRepository(DesignType)
        const designType = await designTypeRepo.findOne({ id }, config as any)

        if (!designType) {
            throw new MedusaError(
                MedusaError.Types.NOT_FOUND,
                `Design type with id: ${id} was not found`
            )
        }

        return designType
    }

    /**
     * Creates a design type
     * @param data - the design type to create
     * @returns created design type
     */
    async create(data: DesignTypeData): Promise<any> {
        try {
            const designTypeRepo = this.manager.getRepository(DesignType)
            const designType = designTypeRepo.create(data)

            this.manager.persist(designType)
            await this.manager.flush()

            return designType
        } catch (error) {
            this.logger_.error("Error creating design type:", error)
            throw error
        }
    }

    /**
     * Updates a design type
     * @param id - the id of the design type to update
     * @param data - the update object
     * @returns updated design type
     */
    async update(id: string, data: Partial<DesignTypeData>): Promise<any> {
        try {
            const designType = await this.retrieve(id)
            Object.assign(designType, data)

            this.manager.persist(designType)
            await this.manager.flush()

            return designType
        } catch (error) {
            this.logger_.error(`Error updating design type with id: ${id}`, error)
            throw error
        }
    }

    /**
     * Deletes a design type
     * @param id - the id of the design type to delete
     */
    async delete(id: string): Promise<void> {
        try {
            const designTypeRepo = this.manager.getRepository(DesignType)
            const designRepo = this.manager.getRepository(Design)

            // Check if exists
            await this.retrieve(id)

            // Check if there are any designs using this design type
            const associatedDesignsCount = await designRepo.count({
                design_type_id: id
            } as any)

            if (associatedDesignsCount > 0) {
                throw new MedusaError(
                    MedusaError.Types.NOT_ALLOWED,
                    `Cannot delete design type. It is being used by ${associatedDesignsCount} design${associatedDesignsCount > 1 ? 's' : ''}`
                )
            }

            await designTypeRepo.nativeDelete({ id })
            await this.manager.flush()
        } catch (error) {
            this.logger_.error(`Error deleting design type with id: ${id}`, error)
            throw error
        }
    }
}

export default DesignTypeService