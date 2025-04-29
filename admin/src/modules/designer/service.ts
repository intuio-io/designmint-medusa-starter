// src/modules/designer/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import { EntityManager } from "@mikro-orm/core"
import { Logger } from "@medusajs/types"
import { DesignService, DesignTypeService } from "./services"

type InjectedDependencies = {
    manager: EntityManager
    logger: Logger
    designService: DesignService
    designTypeService: DesignTypeService
}

class DesignerService extends MedusaService({}) {
    protected readonly logger_: Logger
    protected manager: EntityManager
    // Make these public for external access
    public designService_: DesignService
    public designTypeService_: DesignTypeService

    constructor(container: InjectedDependencies) {
        super(container)
        this.logger_ = container.logger
        this.manager = container.manager

        // Inject services
        this.designService_ = container.designService
        this.designTypeService_ = container.designTypeService
    }

    // Public getters for backward compatibility if needed
    get design(): DesignService {
        return this.designService_
    }

    get designType(): DesignTypeService {
        return this.designTypeService_
    }
}

export default DesignerService