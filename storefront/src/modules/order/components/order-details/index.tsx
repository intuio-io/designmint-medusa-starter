import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Text className="text-lg text-gray-700">
        We have sent the order confirmation details to{" "}
        <span className="text-gray-900 font-semibold" data-testid="order-email">
          {order.email}
        </span>
        .
      </Text>

      <div className="mt-4 space-y-2">
        <Text className="text-md text-gray-600">
          Order Date:{" "}
          <span className="font-medium text-gray-900" data-testid="order-date">
            {new Date(order.created_at).toDateString()}
          </span>
        </Text>
        <Text className="text-md text-gray-600">
          Order Number:{" "}
          <span className="font-medium text-gray-900" data-testid="order-id">
            {order.display_id}
          </span>
        </Text>
      </div>

      {showStatus && (
        <div className="mt-4 p-4 bg-white border rounded-md shadow-sm">
          <Text className="text-md text-gray-600">
            Order Status:{" "}
            <span
              className="font-medium text-gray-900"
              data-testid="order-status"
            >
              {formatStatus(order.fulfillment_status)}
            </span>
          </Text>
          <Text className="text-md text-gray-600 mt-1">
            Payment Status:{" "}
            <span
              className="font-medium text-gray-900"
              data-testid="order-payment-status"
            >
              {formatStatus(order.payment_status)}
            </span>
          </Text>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
