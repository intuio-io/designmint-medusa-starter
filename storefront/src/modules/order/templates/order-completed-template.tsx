import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const hasSeenGif = cookies.get("has_seen_gif")?.value === "true"

  return (
    <div className="py-10 min-h-[calc(100vh-64px)] bg-gray-50">
      <div className="content-container flex flex-col items-center gap-y-12 max-w-4xl w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        <div
          className="flex flex-col gap-6 w-full bg-white shadow-md rounded-lg p-8"
          data-testid="order-complete-container"
        >
          {/* Show GIF only if the user hasn't seen it */}
          {!hasSeenGif && (
            <img
              src="https://res.cloudinary.com/dqhzef5yz/image/upload/v1741158058/output-onlinegiftools_2_nxphpi.gif"
              alt="Celebration GIF"
              className="w-40 mx-auto"
            />
          )}

          <Heading
            level="h1"
            className="text-center text-ui-fg-base text-4xl font-semibold"
          >
            Thank you!
          </Heading>
          <p className="text-center text-lg text-gray-600">
            Your order was placed successfully.
          </p>

          <div className="border-t border-gray-200 pt-6">
            <OrderDetails order={order} />
          </div>

          <Items order={order} />
          <CartTotals totals={order} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            <ShippingDetails order={order} />
            <PaymentDetails order={order} />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}
