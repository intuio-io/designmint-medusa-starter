"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="bg-white p-2 flex flex-col gap-y-6">
      {/* Header */}
      <Heading
        level="h2"
        className="text-3xl font-semibold text-gray-900 border-b pb-4"
      >
        Order Summary
      </Heading>

      {/* Discount Code */}
      <div className="rounded-md">
        <DiscountCode cart={cart} />
      </div>

      {/* Divider */}
      <Divider />

      {/* Cart Totals */}
      <div className="rounded-md">
        <CartTotals totals={cart} />
      </div>

      {/* Checkout Button */}
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full  text-sm font-medium transition-all duration-200">
          Proceed to Checkout
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
