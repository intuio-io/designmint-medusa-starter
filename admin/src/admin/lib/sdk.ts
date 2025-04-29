import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    debug: process.env.NODE_ENV === "development",
    auth: {
        type: "session",
    },
})