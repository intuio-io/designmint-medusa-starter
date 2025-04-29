import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it","us"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
          },
          {
            currency_code: "usd",
            is_default: true,
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default"
  })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Business Stationery",
          is_active: true,
          metadata:{"banner": "https://res.cloudinary.com/dqhzef5yz/image/upload/v1743682831/Redpixel-Regular-Business-Card_900x600-01_xhsvli.jpg"}
        },
        {
          name: "Marketing Materials",
          is_active: true,
          metadata:{"banner": "https://res.cloudinary.com/dqhzef5yz/image/upload/v1743768817/Bulk-Flyers-1-430x430_hwoicw.webp"}
        },
        {
          name: "Packaging & Labels",
          is_active: true,
          metadata:{"banner": "https://res.cloudinary.com/dqhzef5yz/image/upload/v1743683018/Logo-stickers-in-sheet-India_thch9q.jpg"}
        },
        {
          name: "Apparel",
          is_active: true,
          metadata:{"banner": "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406441/design-your-shirt-min_oxdrqd.jpg"}
        },
        {
          name: "Home & Personal",
          is_active: true,
          metadata:{"banner": "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745386038/generated-illustration-stack-photos_1088754-16442_f0jykf.jpg"}
        }
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Premium Business Cards",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Business Stationery")!.id,
          ],
          description: "Elegant business cards on premium stock with matte, gloss, or soft-touch finishes.",
          handle: "premium-business-cards",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745400816/decorative-premium-black-gold-business-card_1017-30078_jpcxum.jpg" },
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745400815/creative-premium-double-side-vector-flat-business-card-template-design_718848-803_esubci.avif" }
          ],
          options: [
            {
              title: "Finish",
              values: ["Matte", "Gloss", "Soft Touch"]
            },
            {
              title: "Corners",
              values: ["Square", "Rounded"]
            }
          ],
          variants: [
            {
              title: "Matte / Square",
              sku: "BUSCARD-MATTE-SQ",
              options: { Finish: "Matte", Corners: "Square" },
              prices: [{ amount: 18, currency_code: "usd" }]
            },
            {
              title: "Matte / Rounded",
              sku: "BUSCARD-MATTE-RND",
              options: { Finish: "Matte", Corners: "Rounded" },
              prices: [{ amount: 18, currency_code: "usd" }]
            },
            {
              title: "Gloss / Square",
              sku: "BUSCARD-GLOSS-SQ",
              options: { Finish: "Gloss", Corners: "Square" },
              prices: [{ amount: 19, currency_code: "usd" }]
            },
            {
              title: "Gloss / Rounded",
              sku: "BUSCARD-GLOSS-RND",
              options: { Finish: "Gloss", Corners: "Rounded" },
              prices: [{ amount: 19, currency_code: "usd" }]
            },
            {
              title: "Soft Touch / Square",
              sku: "BUSCARD-SOFT-SQ",
              options: { Finish: "Soft Touch", Corners: "Square" },
              prices: [{ amount: 20, currency_code: "usd" }]
            },
            {
              title: "Soft Touch / Rounded",
              sku: "BUSCARD-SOFT-RND",
              options: { Finish: "Soft Touch", Corners: "Rounded" },
              prices: [{ amount: 20, currency_code: "usd" }]
            }
          ],
          sales_channels: [
            { id: defaultSalesChannel[0].id }
          ]
        },
        {
          title: "Letterheads",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Business Stationery")!.id,
          ],
          description: "Customized letterheads with your branding, printed on premium paper.",
          handle: "letterheads",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745401162/business-letterhead-design_920873-600_ruuiv5.avif" },
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745401162/white-sheet-paper-flat-style-empty-paper-note-vector-illustration-isolated-background-blank-document-sign-business-concept_157943-45505_gfsvcl.avif" }
          ],
          options: [
            {
              title: "Paper Type",
              values: ["Standard", "Premium"]
            },
            {
              title: "Color",
              values: ["White", "Ivory"]
            }
          ],
          variants: [
            {
              title: "Standard / White",
              sku: "LTRHD-ST-WHT",
              options: { "Paper Type": "Standard", Color: "White" },
              prices: [{ amount: 25, currency_code: "usd" }]
            },
            {
              title: "Standard / Ivory",
              sku: "LTRHD-ST-IVR",
              options: { "Paper Type": "Standard", Color: "Ivory" },
              prices: [{ amount: 25, currency_code: "usd" }]
            },
            {
              title: "Premium / White",
              sku: "LTRHD-PR-WHT",
              options: { "Paper Type": "Premium", Color: "White" },
              prices: [{ amount: 28, currency_code: "usd" }]
            },
            {
              title: "Premium / Ivory",
              sku: "LTRHD-PR-IVR",
              options: { "Paper Type": "Premium", Color: "Ivory" },
              prices: [{ amount: 28, currency_code: "usd" }]
            }
          ],
          sales_channels: [
            { id: defaultSalesChannel[0].id }
          ]
        },
        {
          title: "Envelopes",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Business Stationery")!.id,
          ],
          description: "Branded envelopes in multiple sizes and finishes.",
          handle: "envelopes",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745402930/wedding-rsvp-card_23-2147980282_wohgab.jpg" },
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745402930/paper-envelope-design-mockup-vector_53876-61568_wn7qu4.jpg" },
          ],
          options: [
            {
              title: "Size",
              values: ["A4", "A5", "DL"]
            },
            {
              title: "Window",
              values: ["With Window", "Without Window"]
            }
          ],
          variants: [
            {
              title: "A4 / With Window",
              sku: "ENV-A4-WW",
              options: { Size: "A4", Window: "With Window" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "A4 / Without Window",
              sku: "ENV-A4-WOW",
              options: { Size: "A4", Window: "Without Window" },
              prices: [{ amount: 14, currency_code: "usd" }]
            },
            {
              title: "A5 / With Window",
              sku: "ENV-A5-WW",
              options: { Size: "A5", Window: "With Window" },
              prices: [{ amount: 13, currency_code: "usd" }]
            },
            {
              title: "A5 / Without Window",
              sku: "ENV-A5-WOW",
              options: { Size: "A5", Window: "Without Window" },
              prices: [{ amount: 12, currency_code: "usd" }]
            },
            {
              title: "DL / With Window",
              sku: "ENV-DL-WW",
              options: { Size: "DL", Window: "With Window" },
              prices: [{ amount: 11, currency_code: "usd" }]
            },
            {
              title: "DL / Without Window",
              sku: "ENV-DL-WOW",
              options: { Size: "DL", Window: "Without Window" },
              prices: [{ amount: 10, currency_code: "usd" }]
            }
          ],
          sales_channels: [
            { id: defaultSalesChannel[0].id }
          ]
        },
        {
          title: "Notepads",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Business Stationery")!.id,
          ],
          description: "Branded notepads for internal or client-facing use, with multiple page count options.",
          handle: "notepads",
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745403959/logo-mock-up_587129-20_jgigw5.avif" },
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745403959/rose-flowers-with-leaves-arrangement-notepads_23-2148408282_rgnaw6.jpg" }
          ],
          options: [
            {
              title: "Pages",
              values: ["50", "100"]
            },
            {
              title: "Binding",
              values: ["Glued", "Spiral"]
            }
          ],
          variants: [
            {
              title: "50 / Glued",
              sku: "NTPD-50-GL",
              options: { Pages: "50", Binding: "Glued" },
              prices: [{ amount: 30, currency_code: "usd" }]
            },
            {
              title: "50 / Spiral",
              sku: "NTPD-50-SP",
              options: { Pages: "50", Binding: "Spiral" },
              prices: [{ amount: 32, currency_code: "usd" }]
            },
            {
              title: "100 / Glued",
              sku: "NTPD-100-GL",
              options: { Pages: "100", Binding: "Glued" },
              prices: [{ amount: 35, currency_code: "usd" }]
            },
            {
              title: "100 / Spiral",
              sku: "NTPD-100-SP",
              options: { Pages: "100", Binding: "Spiral" },
              prices: [{ amount: 37, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Presentation Folders",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Business Stationery")!.id,
          ],
          description: "Custom presentation folders with or without business card slits.",
          handle: "presentation-folders",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404070/MintPrinting-PresentationFoldersTopBanner_pttzw0.jpg" },
            { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404059/presentation-folders-pdp-1_gj73c3.png" }
          ],
          options: [
            {
              title: "Pockets",
              values: ["Single", "Double"]
            },
            {
              title: "Business Card Slot",
              values: ["Yes", "No"]
            }
          ],
          variants: [
            {
              title: "Single / Yes",
              sku: "FOLDER-SG-BCS",
              options: { Pockets: "Single", "Business Card Slot": "Yes" },
              prices: [{ amount: 40, currency_code: "usd" }]
            },
            {
              title: "Single / No",
              sku: "FOLDER-SG-NO",
              options: { Pockets: "Single", "Business Card Slot": "No" },
              prices: [{ amount: 39, currency_code: "usd" }]
            },
            {
              title: "Double / Yes",
              sku: "FOLDER-DB-BCS",
              options: { Pockets: "Double", "Business Card Slot": "Yes" },
              prices: [{ amount: 42, currency_code: "usd" }]
            },
            {
              title: "Double / No",
              sku: "FOLDER-DB-NO",
              options: { Pockets: "Double", "Business Card Slot": "No" },
              prices: [{ amount: 41, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Flyers",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Marketing Materials")!.id,
          ],
          description: "High-impact promotional flyers available in multiple sizes and finishes.",
          handle: "flyers",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404221/restaurant_flyers_sqcqyj.webp" },{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404258/sp_slide_h_1_eubwxe.jpg" }],
          options: [
            { title: "Size", values: ["A5", "A4"] },
            { title: "Finish", values: ["Matte", "Glossy"] }
          ],
          variants: [
            {
              title: "A5 / Matte",
              sku: "FLY-A5-MT",
              options: { Size: "A5", Finish: "Matte" },
              prices: [{ amount: 12, currency_code: "usd" }]
            },
            {
              title: "A5 / Glossy",
              sku: "FLY-A5-GL",
              options: { Size: "A5", Finish: "Glossy" },
              prices: [{ amount: 13, currency_code: "usd" }]
            },
            {
              title: "A4 / Matte",
              sku: "FLY-A4-MT",
              options: { Size: "A4", Finish: "Matte" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "A4 / Glossy",
              sku: "FLY-A4-GL",
              options: { Size: "A4", Finish: "Glossy" },
              prices: [{ amount: 16, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Brochures",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Marketing Materials")!.id,
          ],
          description: "Folded brochures perfect for service lists, company overviews, and events.",
          handle: "brochures",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404367/brochure-1-500x500_hnwcvt.jpg" },{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404398/size_L_s6bmbo.jpg" }],
          options: [
            { title: "Fold Type", values: ["Tri-fold", "Z-fold"] },
            { title: "Paper Weight", values: ["120gsm", "150gsm"] }
          ],
          variants: [
            {
              title: "Tri-fold / 120gsm",
              sku: "BRO-TF-120",
              options: { "Fold Type": "Tri-fold", "Paper Weight": "120gsm" },
              prices: [{ amount: 20, currency_code: "usd" }]
            },
            {
              title: "Tri-fold / 150gsm",
              sku: "BRO-TF-150",
              options: { "Fold Type": "Tri-fold", "Paper Weight": "150gsm" },
              prices: [{ amount: 22, currency_code: "usd" }]
            },
            {
              title: "Z-fold / 120gsm",
              sku: "BRO-ZF-120",
              options: { "Fold Type": "Z-fold", "Paper Weight": "120gsm" },
              prices: [{ amount: 21, currency_code: "usd" }]
            },
            {
              title: "Z-fold / 150gsm",
              sku: "BRO-ZF-150",
              options: { "Fold Type": "Z-fold", "Paper Weight": "150gsm" },
              prices: [{ amount: 23, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Posters",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Marketing Materials")!.id,
          ],
          description: "Full-color posters printed on durable stock to grab attention anywhere.",
          handle: "posters",
          weight: 200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404500/a4-print-shop-poster-templates_lfqcrq.jpg" },{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404539/Standard-Posters_20copy_700_oiqdm0.png"}],
          options: [
            { title: "Size", values: ["A3", "A2"] },
            { title: "Paper Type", values: ["Gloss", "Matte"] }
          ],
          variants: [
            {
              title: "A3 / Gloss",
              sku: "PST-A3-GL",
              options: { Size: "A3", "Paper Type": "Gloss" },
              prices: [{ amount: 25, currency_code: "usd" }]
            },
            {
              title: "A3 / Matte",
              sku: "PST-A3-MT",
              options: { Size: "A3", "Paper Type": "Matte" },
              prices: [{ amount: 24, currency_code: "usd" }]
            },
            {
              title: "A2 / Gloss",
              sku: "PST-A2-GL",
              options: { Size: "A2", "Paper Type": "Gloss" },
              prices: [{ amount: 28, currency_code: "usd" }]
            },
            {
              title: "A2 / Matte",
              sku: "PST-A2-MT",
              options: { Size: "A2", "Paper Type": "Matte" },
              prices: [{ amount: 27, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Postcards",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Marketing Materials")!.id,
          ],
          description: "Perfect for direct mail or event handouts. Print your custom design on premium cardstock.",
          handle: "postcards",
          weight: 120,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404815/postcard_main1_oqxxve.jpg" },{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745404686/postcard-Your-Design-Here_vybk7b.jpg" }],
          options: [
            { title: "Size", values: ["4x6", "5x7"] },
            { title: "Sides", values: ["Single", "Double"] }
          ],
          variants: [
            {
              title: "4x6 / Single",
              sku: "PC-46-SG",
              options: { Size: "4x6", Sides: "Single" },
              prices: [{ amount: 10, currency_code: "usd" }]
            },
            {
              title: "4x6 / Double",
              sku: "PC-46-DB",
              options: { Size: "4x6", Sides: "Double" },
              prices: [{ amount: 12, currency_code: "usd" }]
            },
            {
              title: "5x7 / Single",
              sku: "PC-57-SG",
              options: { Size: "5x7", Sides: "Single" },
              prices: [{ amount: 11, currency_code: "usd" }]
            },
            {
              title: "5x7 / Double",
              sku: "PC-57-DB",
              options: { Size: "5x7", Sides: "Double" },
              prices: [{ amount: 13, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Catalogs",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Marketing Materials")!.id,
          ],
          description: "Showcase your full product lineup in a professional, saddle-stitched catalog.",
          handle: "catalogs",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745411687/Custom-Flyers-Leaflet-Catalogue-Brochure-Magazine-Printing-Flyer_qcuper.webp" }],
          options: [
            { title: "Page Count", values: ["24", "48"] },
            { title: "Cover Type", values: ["Soft", "Hard"] }
          ],
          variants: [
            {
              title: "24 / Soft",
              sku: "CAT-24-SF",
              options: { "Page Count": "24", "Cover Type": "Soft" },
              prices: [{ amount: 40, currency_code: "usd" }]
            },
            {
              title: "24 / Hard",
              sku: "CAT-24-HD",
              options: { "Page Count": "24", "Cover Type": "Hard" },
              prices: [{ amount: 45, currency_code: "usd" }]
            },
            {
              title: "48 / Soft",
              sku: "CAT-48-SF",
              options: { "Page Count": "48", "Cover Type": "Soft" },
              prices: [{ amount: 50, currency_code: "usd" }]
            },
            {
              title: "48 / Hard",
              sku: "CAT-48-HD",
              options: { "Page Count": "48", "Cover Type": "Hard" },
              prices: [{ amount: 55, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Custom Boxes",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Packaging & Labels")!.id,
          ],
          description: "Durable custom-printed boxes for shipping and retail packaging.",
          handle: "custom-boxes",
          weight: 300,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405295/white-cardboard-software-box_3446-344_gjrgpx.jpg" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405282/flat-design-box-die-cut-template_23-2149724330_ixk3sb.jpg"}],
          options: [
            { title: "Size", values: ["Small", "Medium", "Large"] },
            { title: "Material", values: ["Cardboard", "Corrugated"] }
          ],
          variants: [
            {
              title: "Small / Cardboard",
              sku: "BOX-SM-CB",
              options: { Size: "Small", Material: "Cardboard" },
              prices: [{ amount: 5, currency_code: "usd" }]
            },
            {
              title: "Small / Corrugated",
              sku: "BOX-SM-CR",
              options: { Size: "Small", Material: "Corrugated" },
              prices: [{ amount: 6, currency_code: "usd" }]
            },
            {
              title: "Medium / Cardboard",
              sku: "BOX-MD-CB",
              options: { Size: "Medium", Material: "Cardboard" },
              prices: [{ amount: 7, currency_code: "usd" }]
            },
            {
              title: "Medium / Corrugated",
              sku: "BOX-MD-CR",
              options: { Size: "Medium", Material: "Corrugated" },
              prices: [{ amount: 8, currency_code: "usd" }]
            },
            {
              title: "Large / Cardboard",
              sku: "BOX-LG-CB",
              options: { Size: "Large", Material: "Cardboard" },
              prices: [{ amount: 9, currency_code: "usd" }]
            },
            {
              title: "Large / Corrugated",
              sku: "BOX-LG-CR",
              options: { Size: "Large", Material: "Corrugated" },
              prices: [{ amount: 10, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Product Labels",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Packaging & Labels")!.id,
          ],
          description: "Custom adhesive labels for product packaging and branding.",
          handle: "product-labels",
          weight: 50,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405731/20220302_230426624859_e60852_Rounded-Corner-Labels_mx3gq7.jpg" },{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405698/product-labels-1_x82g1g.webp" }],
          options: [
            { title: "Shape", values: ["Round", "Square"] },
            { title: "Finish", values: ["Glossy", "Matte"] }
          ],
          variants: [
            {
              title: "Round / Glossy",
              sku: "LBL-RD-GL",
              options: { Shape: "Round", Finish: "Glossy" },
              prices: [{ amount: 3, currency_code: "usd" }]
            },
            {
              title: "Round / Matte",
              sku: "LBL-RD-MT",
              options: { Shape: "Round", Finish: "Matte" },
              prices: [{ amount: 2, currency_code: "usd" }]
            },
            {
              title: "Square / Glossy",
              sku: "LBL-SQ-GL",
              options: { Shape: "Square", Finish: "Glossy" },
              prices: [{ amount: 3, currency_code: "usd" }]
            },
            {
              title: "Square / Matte",
              sku: "LBL-SQ-MT",
              options: { Shape: "Square", Finish: "Matte" },
              prices: [{ amount: 3, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Hang Tags",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Packaging & Labels")!.id,
          ],
          description: "Custom hang tags for apparel and gift packaging.",
          handle: "hang-tags",
          weight: 70,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405807/custom-hang-tag-500x500_d2q150.png" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405829/Rectangle_20-_20Standard_20Hang_20Tags_1720075810_bw1b9i.webp"}],
          options: [
            { title: "Shape", values: ["Rectangle", "Die-Cut"] },
            { title: "Hole Position", values: ["Top", "Corner"] }
          ],
          variants: [
            {
              title: "Rectangle / Top",
              sku: "HTAG-RC-TP",
              options: { Shape: "Rectangle", "Hole Position": "Top" },
              prices: [{ amount: 4, currency_code: "usd" }]
            },
            {
              title: "Rectangle / Corner",
              sku: "HTAG-RC-CR",
              options: { Shape: "Rectangle", "Hole Position": "Corner" },
              prices: [{ amount: 4, currency_code: "usd" }]
            },
            {
              title: "Die-Cut / Top",
              sku: "HTAG-DC-TP",
              options: { Shape: "Die-Cut", "Hole Position": "Top" },
              prices: [{ amount: 4, currency_code: "usd" }]
            },
            {
              title: "Die-Cut / Corner",
              sku: "HTAG-DC-CR",
              options: { Shape: "Die-Cut", "Hole Position": "Corner" },
              prices: [{ amount: 5, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Bottle Labels",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Packaging & Labels")!.id,
          ],
          description: "Waterproof labels designed to fit a variety of bottle shapes and sizes.",
          handle: "bottle-labels",
          weight: 60,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405958/71BDoaD5lXL_r1daaa.jpg" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745405958/71BDoaD5lXL_r1daaa.jpg"}],
          options: [
            { title: "Size", values: ["2x4", "3x5"] },
            { title: "Finish", values: ["Gloss", "Matte"] }
          ],
          variants: [
            {
              title: "2x4 / Gloss",
              sku: "BTLBL-24-GL",
              options: { Size: "2x4", Finish: "Gloss" },
              prices: [{ amount: 3, currency_code: "usd" }]
            },
            {
              title: "2x4 / Matte",
              sku: "BTLBL-24-MT",
              options: { Size: "2x4", Finish: "Matte" },
              prices: [{ amount: 3, currency_code: "usd" }]
            },
            {
              title: "3x5 / Gloss",
              sku: "BTLBL-35-GL",
              options: { Size: "3x5", Finish: "Gloss" },
              prices: [{ amount: 4, currency_code: "usd" }]
            },
            {
              title: "3x5 / Matte",
              sku: "BTLBL-35-MT",
              options: { Size: "3x5", Finish: "Matte" },
              prices: [{ amount: 3, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Packaging Sleeves",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Packaging & Labels")!.id,
          ],
          description: "Custom-printed sleeves to wrap around boxes or containers for added branding.",
          handle: "packaging-sleeves",
          weight: 90,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406087/0528_350g_artboard_mattlami_ys_web-2_bh7wws.jpg" },{url : "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406153/cardboard-sleeve-packaging_wjzr8k.png"}],
          options: [
            { title: "Length", values: ["8in", "10in"] },
            { title: "Finish", values: ["Matte", "Glossy"] }
          ],
          variants: [
            {
              title: "8in / Matte",
              sku: "PKSL-8-MT",
              options: { Length: "8in", Finish: "Matte" },
              prices: [{ amount: 6, currency_code: "usd" }]
            },
            {
              title: "8in / Glossy",
              sku: "PKSL-8-GL",
              options: { Length: "8in", Finish: "Glossy" },
              prices: [{ amount: 6, currency_code: "usd" }]
            },
            {
              title: "10in / Matte",
              sku: "PKSL-10-MT",
              options: { Length: "10in", Finish: "Matte" },
              prices: [{ amount: 7, currency_code: "usd" }]
            },
            {
              title: "10in / Glossy",
              sku: "PKSL-10-GL",
              options: { Length: "10in", Finish: "Glossy" },
              prices: [{ amount: 7, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Custom T-Shirts",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Apparel")!.id,
          ],
          description: "Comfortable, custom-printed cotton t-shirts available in multiple colors and sizes.",
          handle: "custom-t-shirts",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406551/tshirt-printing-services-500x500_vgwuik.jpg" } , { url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406546/front_medium_extended.png_bqbypq.jpg" }],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "White", "Navy"] }
          ],
          variants: [
            {
              title: "S / Black",
              sku: "TS-S-BLK",
              options: { Size: "S", Color: "Black" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "S / White",
              sku: "TS-S-WHT",
              options: { Size: "S", Color: "White" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "S / Navy",
              sku: "TS-S-NVY",
              options: { Size: "S", Color: "Navy" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "M / Black",
              sku: "TS-M-BLK",
              options: { Size: "M", Color: "Black" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "M / White",
              sku: "TS-M-WHT",
              options: { Size: "M", Color: "White" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "M / Navy",
              sku: "TS-M-NVY",
              options: { Size: "M", Color: "Navy" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "L / Black",
              sku: "TS-L-BLK",
              options: { Size: "L", Color: "Black" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "L / White",
              sku: "TS-L-WHT",
              options: { Size: "L", Color: "White" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "L / Navy",
              sku: "TS-L-NVY",
              options: { Size: "L", Color: "Navy" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "XL / Black",
              sku: "TS-XL-BLK",
              options: { Size: "XL", Color: "Black" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "XL / White",
              sku: "TS-XL-WHT",
              options: { Size: "XL", Color: "White" },
              prices: [{ amount: 15, currency_code: "usd" }]
            },
            {
              title: "XL / Navy",
              sku: "TS-XL-NVY",
              options: { Size: "XL", Color: "Navy" },
              prices: [{ amount: 15, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Custom Hoodies",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Apparel")!.id,
          ],
          description: "Warm fleece-lined hoodies customized with your brand.",
          handle: "custom-hoodies",
          weight: 450,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406679/Mens-Hoodies-1_gq4b0x.png" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406673/61Y0VY9LP3L._AC_SL1500__do04rb.jpg"}],
          options: [
            { title: "Size", values: ["M", "L", "XL"] },
            { title: "Color", values: ["Black", "Gray"] }
          ],
          variants: [
            {
              title: "M / Black",
              sku: "HD-M-BLK",
              options: { Size: "M", Color: "Black" },
              prices: [{ amount: 35, currency_code: "usd" }]
            },
            {
              title: "M / Gray",
              sku: "HD-M-GRY",
              options: { Size: "M", Color: "Gray" },
              prices: [{ amount: 35, currency_code: "usd" }]
            },
            {
              title: "L / Black",
              sku: "HD-L-BLK",
              options: { Size: "L", Color: "Black" },
              prices: [{ amount: 35, currency_code: "usd" }]
            },
            {
              title: "L / Gray",
              sku: "HD-L-GRY",
              options: { Size: "L", Color: "Gray" },
              prices: [{ amount: 35, currency_code: "usd" }]
            },
            {
              title: "XL / Black",
              sku: "HD-XL-BLK",
              options: { Size: "XL", Color: "Black" },
              prices: [{ amount: 35, currency_code: "usd" }]
            },
            {
              title: "XL / Gray",
              sku: "HD-XL-GRY",
              options: { Size: "XL", Color: "Gray" },
              prices: [{ amount: 35, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Premium Polo Shirts",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Apparel")!.id,
          ],
          description: "Stylish polo shirts with breathable fabric for casual and formal settings.",
          handle: "premium-polo-shirts",
          weight: 220,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406817/hummel-jaye-polo-t-shirt-66830349455492_oo1rax.jpg" },{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745406883/custom-maroon_o5y7uh.jpg" }],
          options: [
            { title: "Size", values: ["S", "M", "L"] },
            { title: "Color", values: ["Blue", "White"] }
          ],
          variants: [
            {
              title: "S / Blue",
              sku: "PL-S-BLU",
              options: { Size: "S", Color: "Blue" },
              prices: [{ amount: 22, currency_code: "usd" }]
            },
            {
              title: "S / White",
              sku: "PL-S-WHT",
              options: { Size: "S", Color: "White" },
              prices: [{ amount: 22, currency_code: "usd" }]
            },
            {
              title: "M / Blue",
              sku: "PL-M-BLU",
              options: { Size: "M", Color: "Blue" },
              prices: [{ amount: 22, currency_code: "usd" }]
            },
            {
              title: "M / White",
              sku: "PL-M-WHT",
              options: { Size: "M", Color: "White" },
              prices: [{ amount: 22, currency_code: "usd" }]
            },
            {
              title: "L / Blue",
              sku: "PL-L-BLU",
              options: { Size: "L", Color: "Blue" },
              prices: [{ amount: 22, currency_code: "usd" }]
            },
            {
              title: "L / White",
              sku: "PL-L-WHT",
              options: { Size: "L", Color: "White" },
              prices: [{ amount: 22, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Canvas Tote Bags",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Apparel")!.id,
          ],
          description: "Eco-friendly canvas tote bags for daily use or custom branding.",
          handle: "canvas-tote-bags",
          weight: 150,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745408570/il_570xN.5828518390_9595_rfo30b.jpg" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745408576/41kUqMxycuL._AC_UY1100__fvgclo.jpg"}],
          options: [
            { title: "Color", values: ["Natural", "Black", "Green"] }
          ],
          variants: [
            {
              title: "Natural",
              sku: "TOTE-NAT",
              options: { Color: "Natural" },
              prices: [{ amount: 12, currency_code: "usd" }]
            },
            {
              title: "Black",
              sku: "TOTE-BLK",
              options: { Color: "Black" },
              prices: [{ amount: 12, currency_code: "usd" }]
            },
            {
              title: "Green",
              sku: "TOTE-GRN",
              options: { Color: "Green" },
              prices: [{ amount: 12, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Scented Soy Candles",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Home & Personal")!.id,
          ],
          description: "Hand-poured soy candles with natural fragrances to set the perfect ambiance.",
          handle: "scented-soy-candles",
          weight: 500,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409028/il_fullxfull.6180282573_lbjc_amqcal.jpg" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409000/10oz_DWC-Candle-clear-edit_nlhagt.jpg"}],
          options: [
            { title: "Scent", values: ["Lavender", "Vanilla", "Citrus"] }
          ],
          variants: [
            {
              title: "Lavender",
              sku: "CANDLE-LAV",
              options: { Scent: "Lavender" },
              prices: [{ amount: 18, currency_code: "usd" }]
            },
            {
              title: "Vanilla",
              sku: "CANDLE-VAN",
              options: { Scent: "Vanilla" },
              prices: [{ amount: 18, currency_code: "usd" }]
            },
            {
              title: "Citrus",
              sku: "CANDLE-CTR",
              options: { Scent: "Citrus" },
              prices: [{ amount: 18, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Reusable Water Bottles",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Home & Personal")!.id,
          ],
          description: "Stay hydrated on the go with these stainless steel reusable water bottles.",
          handle: "reusable-water-bottles",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409465/Artboard3_jpg_2a6a7493-2112-4960-80d4-50d3527693c5_1080x_mz4l4l.png" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409472/s-l1200_jg4zvm.png"}],
          options: [
            { title: "Color", values: ["Blue", "Silver", "Black"] },
            { title: "Size", values: ["500ml", "750ml"] }
          ],
          variants: [
            {
              title: "Blue / 500ml",
              sku: "BOTTLE-BLU-500",
              options: { Color: "Blue", Size: "500ml" },
              prices: [{ amount: 25, currency_code: "usd" }]
            },
            {
              title: "Blue / 750ml",
              sku: "BOTTLE-BLU-750",
              options: { Color: "Blue", Size: "750ml" },
              prices: [{ amount: 28, currency_code: "usd" }]
            },
            {
              title: "Silver / 500ml",
              sku: "BOTTLE-SLV-500",
              options: { Color: "Silver", Size: "500ml" },
              prices: [{ amount: 25, currency_code: "usd" }]
            },
            {
              title: "Silver / 750ml",
              sku: "BOTTLE-SLV-750",
              options: { Color: "Silver", Size: "750ml" },
              prices: [{ amount: 28, currency_code: "usd" }]
            },
            {
              title: "Black / 500ml",
              sku: "BOTTLE-BLK-500",
              options: { Color: "Black", Size: "500ml" },
              prices: [{ amount: 25, currency_code: "usd" }]
            },
            {
              title: "Black / 750ml",
              sku: "BOTTLE-BLK-750",
              options: { Color: "Black", Size: "750ml" },
              prices: [{ amount: 28, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },                                                                                                        {
          title: "Bamboo Bath Towels",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Home & Personal")!.id,
          ],
          description: "Ultra-soft bamboo towels that are highly absorbent and quick drying.",
          handle: "bamboo-bath-towels",
          weight: 600,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409648/81KAOvuPR1L._AC_UF894_1000_QL80__nxtunu.jpg" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409678/71-eSTBxciL_ugaqyd.jpg"}],
          options: [
            { title: "Color", values: ["White", "Gray", "Beige"] }
          ],
          variants: [
            {
              title: "White",
              sku: "TOWEL-WHT",
              options: { Color: "White" },
              prices: [{ amount: 32, currency_code: "usd" }]
            },
            {
              title: "Gray",
              sku: "TOWEL-GRY",
              options: { Color: "Gray" },
              prices: [{ amount: 32, currency_code: "usd" }]
            },
            {
              title: "Beige",
              sku: "TOWEL-BEG",
              options: { Color: "Beige" },
              prices: [{ amount: 32, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Ceramic Mug Set",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Home & Personal")!.id,
          ],
          description: "Set of 4 handcrafted ceramic mugs with a matte finish.",
          handle: "ceramic-mug-set",
          weight: 1200,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [{ url: "https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409848/s-l1200_wsqycm.jpg" },{url:"https://res.cloudinary.com/dqhzef5yz/image/upload/v1745409887/mr-mrs-mug-set-2_hgnavp.gif"}],
          options: [
            { title: "Color", values: ["White"] }
          ],
          variants: [
            {
              title: "Default",
              sku: "MUGSET-4PC",
              options: { Color: "White" },
              prices: [{ amount: 35, currency_code: "usd" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        }                      
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
