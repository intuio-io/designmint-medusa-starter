import type { ExecArgs } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { DESIGNER_MODULE } from "../modules/designer"
import { Modules } from "@medusajs/framework/utils"
import { DesignerServiceType } from "../types/designer-service"

const DESIGN_TYPES = [
    {
        id: "01JSNM6GYECD1Y2E26SB40MQN9",
        name: "Hoodie",
        created_at: "2025-04-25 10:14:52.559+05:30",
        updated_at: "2025-04-25 10:14:52.559+05:30",
    },
    {
        id: "01JSNSVMXTZSQX8V0AA6FJS44C",
        name: "Letterheads",
        created_at: "2025-04-25 11:53:47.643+05:30",
        updated_at: "2025-04-25 11:53:47.643+05:30",
    },
    {
        id: "01JSNTHXEB0B8K2BK76FWMX519",
        name: "Notepads",
        created_at: "2025-04-25 12:05:57.26+05:30",
        updated_at: "2025-04-25 12:05:57.26+05:30",
    },
    {
        id: "01JSNV3NK7FBSBTSMDNCA7T0B5",
        name: "Envelope",
        created_at: "2025-04-25 12:15:39.047+05:30",
        updated_at: "2025-04-25 12:15:39.047+05:30",
    },
    {
        id: "01JSNVR1D0PE72D2W6G2XJVE5F",
        name: "Presentation Folder",
        created_at: "2025-04-25 12:26:46.497+05:30",
        updated_at: "2025-04-25 12:26:46.497+05:30",
    },
    {
        id: "01JSNWAYJSAXYPJPP6Q0217WBP",
        name: "Business Cards",
        created_at: "2025-04-25 12:37:06.202+05:30",
        updated_at: "2025-04-25 12:37:06.202+05:30",
    },
    {
        id: "01JSP54GSX0NW6RZR64WKEEDYS",
        name: "Catalog",
        created_at: "2025-04-25 15:10:52.669+05:30",
        updated_at: "2025-04-25 15:10:52.669+05:30",
    }
]

const DESIGNS = [
    {
        id: "01JSNN35JV4SJJPM2VJT3WTK3E",
        name: "Custom Hoodie",
        img_url: "http://localhost:9000/static/1745556607513-Sweater-5b%20copy.png",
        guide_url: "http://localhost:9000/static/1745557086796-Design%20mint%20guides.png",
        meta_data: {
            image: {
                url: "http://localhost:9000/static/1745556607513-Sweater-5b%20copy.png",
                name: "Sweater-5b copy.png",
                size: 1209868,
                type: "image/png",
                uploadedAt: "2025-04-25T04:50:07.538Z",
                updatedSize: {
                    width: 572.9980145598942,
                    height: 600
                },
                originalSize: {
                    width: 1443,
                    height: 1511
                }
            },
            canvasSize: {
                width: 1100,
                height: 600
            },
            cutoffLines: [
                {
                    x: 26.617489264868784,
                    y: 26.918283928117848,
                    id: 1745557107686,
                    width: 44.74153609580585,
                    height: 30.70405379589357
                }
            ],
            designAreas: [
                {
                    x: 25.94299374583654,
                    y: 26.059429276484465,
                    id: 1745557095836,
                    width: 46.09052713387034,
                    height: 32.20704943625199
                }
            ],
            previewImage: "http://localhost:9000/static/1745557231116-design-preview-Sweater-5b%20copy.png"
        },
        design_type_id: "01JSNM6GYECD1Y2E26SB40MQN9",
        product_title: "Custom Hoodies",
        created_at: "2025-04-25 10:30:31.196+05:30",
        updated_at: "2025-04-25 10:30:31.196+05:30",
    },
    {
        id: "01JSNT9B30F1YM9Z1HBYBAXH0M",
        name: "Custom Letterheads",
        img_url: "http://localhost:9000/static/1745562394728-A4%20copy.png",
        guide_url: "http://localhost:9000/static/1745562554705-Design%20mint%20guides%20(1).png",
        meta_data: {
            image: {
                url: "http://localhost:9000/static/1745562394728-A4%20copy.png",
                name: "A4 copy.png",
                size: 16615,
                type: "image/png",
                uploadedAt: "2025-04-25T06:26:34.738Z",
                updatedSize: {
                    width: 421.94244604316543,
                    height: 600,
                    originalWidth: 391,
                    originalHeight: 556
                },
                originalSize: {
                    width: 391,
                    height: 556
                }
            },
            canvasSize: {
                width: 1100,
                height: 600
            },
            cutoffLines: [
                {
                    x: 2.868377555564563,
                    y: 2.4603209661287573,
                    id: 1745562614827,
                    width: 94.26322554186595,
                    height: 94.59549561561997
                }
            ],
            designAreas: [
                {
                    x: 1.0412184795051238,
                    y: 0.7667954691739244,
                    id: 1745562570737,
                    width: 98.15454284146992,
                    height: 98.46641103723103
                }
            ],
            previewImage: "http://localhost:9000/static/1745562676303-design-preview-A4%20copy.png"
        },
        design_type_id: "01JSNSVMXTZSQX8V0AA6FJS44C",
        product_title: "Letterheads",
        created_at: "2025-04-25 12:01:16.32+05:30",
        updated_at: "2025-04-25 12:01:16.32+05:30",
    },
    {
        id: "01JSNTXP4301V9SSEH7TK94405",
        name: "Custom Notepads",
        img_url: "http://localhost:9000/static/1745562982482-pngtree-recycled-paper-notebook-front-cover-page-png-image_10619241.png",
        guide_url: "http://localhost:9000/static/1745563314248-Design%20mint%20guides%20(2).png",
        meta_data: {
            image: {
                url: "http://localhost:9000/static/1745562982482-pngtree-recycled-paper-notebook-front-cover-page-png-image_10619241.png",
                name: "pngtree-recycled-paper-notebook-front-cover-page-png-image_10619241.png",
                size: 274412,
                type: "image/png",
                uploadedAt: "2025-04-25T06:36:22.487Z",
                updatedSize: {
                    width: 387.7917414721723,
                    height: 600,
                    originalWidth: 360,
                    originalHeight: 557
                },
                originalSize: {
                    width: 360,
                    height: 557
                }
            },
            canvasSize: {
                width: 1100,
                height: 600
            },
            cutoffLines: [
                {
                    x: 14.929629629629632,
                    y: 15.916666666666668,
                    id: 1745563319500,
                    width: 70.65648148148149,
                    height: 75
                }
            ],
            designAreas: [
                {
                    x: 13.89814814814815,
                    y: 15,
                    id: 1745563002857,
                    width: 72.71944444444446,
                    height: 76.5
                }
            ],
            previewImage: "http://localhost:9000/static/1745563342945-design-preview-pngtree-recycled-paper-notebook-front-cover-page-png-image_10619241.png"
        },
        design_type_id: "01JSNTHXEB0B8K2BK76FWMX519",
        product_title: "Notepads",
        created_at: "2025-04-25 12:12:22.98+05:30",
        updated_at: "2025-04-25 12:12:22.98+05:30",
    },
    {
        id: "01JSNVHDX7ZCE39YQ5AWEK4TRX",
        name: "Custom Envelopes",
        img_url: "http://localhost:9000/static/1745563609013-png-transparent-envelope-front-and-back-mockup-template-Photoroom.png",
        guide_url: "http://localhost:9000/static/1745563984472-Design%20mint%20guides%20(3).png",
        meta_data: {
            image: {
                url: "http://localhost:9000/static/1745563609013-png-transparent-envelope-front-and-back-mockup-template-Photoroom.png",
                name: "png-transparent-envelope-front-and-back-mockup-template-Photoroom.png",
                size: 124251,
                type: "image/png",
                uploadedAt: "2025-04-25T06:46:49.019Z",
                updatedSize: {
                    width: 600,
                    height: 600,
                    originalWidth: 900,
                    originalHeight: 900
                },
                originalSize: {
                    width: 900,
                    height: 900
                }
            },
            canvasSize: {
                width: 1100,
                height: 600
            },
            cutoffLines: [
                {
                    x: 18,
                    y: 33.416666666666664,
                    id: 1745563643108,
                    width: 62.83333333333333,
                    height: 13.5
                },
                {
                    x: 17.5,
                    y: 56.58333333333333,
                    id: 1745563679837,
                    width: 63,
                    height: 29.833333333333336
                },
                {
                    x: 38.166666666666664,
                    y: 19.083333333333332,
                    id: 1745563725691,
                    width: 23.833333333333336,
                    height: 6
                }
            ],
            designAreas: [
                {
                    x: 17.333333333333336,
                    y: 32.75,
                    id: 1745563625470,
                    width: 64.16666666666667,
                    height: 15.166666666666668
                },
                {
                    x: 16.666666666666664,
                    y: 55.41666666666667,
                    id: 1745563649196,
                    width: 65,
                    height: 32.5
                },
                {
                    x: 37.666666666666664,
                    y: 18.583333333333332,
                    id: 1745563702538,
                    width: 24.833333333333332,
                    height: 7.333333333333333
                }
            ],
            previewImage: "http://localhost:9000/static/1745563989861-design-preview-png-transparent-envelope-front-and-back-mockup-template-Photoroom.png"
        },
        design_type_id: "01JSNV3NK7FBSBTSMDNCA7T0B5",
        product_title: "Envelopes",
        created_at: "2025-04-25 12:23:09.927+05:30",
        updated_at: "2025-04-25 12:23:09.927+05:30",
    },
    {
        id: "01JSNW75RTASM9P6G2516E037N",
        name: "Custom Presentation Folder",
        img_url: "http://localhost:9000/static/1745564229231-360_F_541933604_DaRghc7fNFQJARM1lm6rcVxDjcv0IT1l-Photoroom.png",
        guide_url: "http://localhost:9000/static/1745564697387-Design%20mint%20guides%20(4).png",
        meta_data: {
            image: {
                url: "http://localhost:9000/static/1745564229231-360_F_541933604_DaRghc7fNFQJARM1lm6rcVxDjcv0IT1l-Photoroom.png",
                name: "360_F_541933604_DaRghc7fNFQJARM1lm6rcVxDjcv0IT1l-Photoroom.png",
                size: 45103,
                type: "image/png",
                uploadedAt: "2025-04-25T06:57:09.236Z",
                updatedSize: {
                    width: 900,
                    height: 600,
                    originalWidth: 540,
                    originalHeight: 360
                },
                originalSize: {
                    width: 540,
                    height: 360
                }
            },
            canvasSize: {
                width: 1100,
                height: 600
            },
            cutoffLines: [
                {
                    x: 7.888888888888888,
                    y: 23.25,
                    id: 1745564299878,
                    width: 26.111111111111114,
                    height: 53
                },
                {
                    x: 38.88888888888889,
                    y: 24.25,
                    id: 1745564308100,
                    width: 25.222222222222225,
                    height: 32.83333333333333
                },
                {
                    x: 38.88888888888889,
                    y: 60.916666666666664,
                    id: 1745564318629,
                    width: 22.88888888888889,
                    height: 16.166666666666664
                },
                {
                    x: 68.88888888888889,
                    y: 61.25000000000001,
                    id: 1745564326898,
                    width: 23.22222222222222,
                    height: 15.833333333333332
                }
            ],
            designAreas: [
                {
                    x: 7.555555555555555,
                    y: 22.75,
                    id: 1745564244548,
                    width: 26.88888888888889,
                    height: 54.333333333333336
                },
                {
                    x: 38.55555555555556,
                    y: 60.25,
                    id: 1745564256850,
                    width: 23.77777777777778,
                    height: 17.333333333333336
                },
                {
                    x: 68.55555555555556,
                    y: 60.583333333333336,
                    id: 1745564266198,
                    width: 23.88888888888889,
                    height: 17
                },
                {
                    x: 38.55555555555556,
                    y: 23.583333333333336,
                    id: 1745564277848,
                    width: 25.88888888888889,
                    height: 34
                }
            ],
            previewImage: "http://localhost:9000/static/1745564702428-design-preview-360_F_541933604_DaRghc7fNFQJARM1lm6rcVxDjcv0IT1l-Photoroom.png"
        },
        design_type_id: "01JSNVR1D0PE72D2W6G2XJVE5F",
        product_title: "Presentation Folders",
        created_at: "2025-04-25 12:35:02.492+05:30",
        updated_at: "2025-04-25 12:35:02.492+05:30",
    },
    {
        id: "01JSNWPT452KA7NZ9BA1RXM78S",
        name: "Custom Business Cards",
        img_url: "http://localhost:9000/static/1745564868663-istockphoto-1200749821-612x612-Photoroom.png",
        guide_url: "http://localhost:9000/static/1745565203907-Design%20mint%20guides%20(5).png",
        meta_data: {
            image: {
                url: "http://localhost:9000/static/1745564868663-istockphoto-1200749821-612x612-Photoroom.png",
                name: "istockphoto-1200749821-612x612-Photoroom.png",
                size: 18394,
                type: "image/png",
                uploadedAt: "2025-04-25T07:07:48.683Z",
                updatedSize: {
                    width: 600,
                    height: 600,
                    originalWidth: 612,
                    originalHeight: 612
                },
                originalSize: {
                    width: 612,
                    height: 612
                }
            },
            canvasSize: {
                width: 1100,
                height: 600
            },
            cutoffLines: [
                {
                    x: 22.5,
                    y: 15.25,
                    id: 1745564899706,
                    width: 54.833333333333336,
                    height: 30
                },
                {
                    x: 22.5,
                    y: 53.25,
                    id: 1745564909973,
                    width: 55.166666666666664,
                    height: 30
                }
            ],
            designAreas: [
                {
                    x: 21.833333333333332,
                    y: 14.583333333333334,
                    id: 1745564877494,
                    width: 56.333333333333336,
                    height: 31.666666666666664
                },
                {
                    x: 22,
                    y: 52.583333333333336,
                    id: 1745564888495,
                    width: 56.166666666666664,
                    height: 31.5
                }
            ],
            previewImage: "http://localhost:9000/static/1745565214741-design-preview-istockphoto-1200749821-612x612-Photoroom.png"
        },
        design_type_id: "01JSNWAYJSAXYPJPP6Q0217WBP",
        product_title: "Premium Business Cards",
        created_at: "2025-04-25 12:43:34.854+05:30",
        updated_at: "2025-04-25 12:43:34.855+05:30",
    }
]

export default async function seedDesignData({
    container
}: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const designerService = container.resolve(DESIGNER_MODULE) as DesignerServiceType
    const designService = designerService.designService_
    const designTypeService = designerService.designTypeService_
    const productService = container.resolve(Modules.PRODUCT)

    logger.info("Starting design data seeding process...")

    try {
        // 1. Insert design types
        logger.info("Seeding design types...")
        const existingDesignTypes = await designTypeService.list()
        const existingTypeIds = existingDesignTypes.map(type => type.id)

        for (const designType of DESIGN_TYPES) {
            try {
                // Check if design type already exists
                if (existingTypeIds.includes(designType.id)) {
                    logger.info(`Design type ${designType.id} already exists. Skipping.`)
                    continue
                }

                // Create the design type
                await designTypeService.create({
                    id: designType.id,
                    name: designType.name
                })

                logger.info(`Created design type: ${designType.name}`)
            } catch (error) {
                logger.error(`Error creating design type ${designType.id}:`, error)
            }
        }

        // 2. Find product IDs by titles and create designs
        logger.info("Looking up product IDs by titles...")

        for (const design of DESIGNS) {
            try {
                if (!design.product_title) {
                    logger.warn(`Design ${design.id} has no product title. Skipping.`)
                    continue
                }

                // Look up product by title
                const products = await productService.listProducts({
                    title: design.product_title
                })

                if (!products || products.length === 0) {
                    logger.warn(`Product with title "${design.product_title}" not found. Skipping design ${design.id}.`)
                    continue
                }

                const productId = products[0].id
                logger.info(`Found product ID ${productId} for product "${design.product_title}".`)

                // We need to check if design already exists to avoid duplicates
                // But we can't use the retrieve method as it throws an error if not found
                let existingDesign = null
                try {
                    existingDesign = await designService.retrieve(design.id)
                } catch (error) {
                    // Design doesn't exist, continue with creation
                }

                if (existingDesign) {
                    logger.info(`Design ${design.id} already exists. Skipping.`)
                    continue
                }

                // Create the design with the product ID (not the title)
                const designData = {
                    id: design.id,
                    name: design.name,
                    img_url: design.img_url,
                    guide_url: design.guide_url,
                    meta_data: design.meta_data,
                    design_type_id: design.design_type_id,
                    product_id: productId // Use the looked-up product ID, not the title
                }

                await designService.create(designData)
                logger.info(`Created design: ${design.name} linked to product ID: ${productId}`)
            } catch (error) {
                logger.error(`Error creating design ${design.id}:`, error)
            }
        }

        logger.info("Finished seeding design data!")
    } catch (error) {
        logger.error("Error running design data seeder:", error)
        throw error
    }
}