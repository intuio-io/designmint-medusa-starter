import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Heading level="h2" className="text-2xl font-semibold text-gray-900 mb-6">
        Delivery Information
      </Heading>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Address */}
        <div className="flex flex-col" data-testid="shipping-address-summary">
          <Text className="text-lg font-medium text-gray-900 mb-1">
            Shipping Address
          </Text>
          <Text className="text-gray-700">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="text-gray-700">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="text-gray-700">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="text-gray-700">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col" data-testid="shipping-contact-summary">
          <Text className="text-lg font-medium text-gray-900 mb-1">
            Contact
          </Text>
          <Text className="text-gray-700">{order.shipping_address?.phone}</Text>
          <Text className="text-gray-700">{order.email}</Text>
        </div>

        {/* Shipping Method */}
        <div className="flex flex-col" data-testid="shipping-method-summary">
          <Text className="text-lg font-medium text-gray-900 mb-1">Method</Text>
          <Text className="text-gray-700">
            {(order as any).shipping_methods[0]?.name} (
            <span className="font-medium text-gray-900">
              {convertToLocale({
                amount: order.shipping_methods?.[0].total ?? 0,
                currency_code: order.currency_code,
              })
                .replace(/,/g, "")
                .replace(/\./g, ",")}
            </span>
            )
          </Text>
        </div>
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
