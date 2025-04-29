import { Container, Heading, Text } from "@medusajs/ui"
import { isStripe, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Heading level="h2" className="text-2xl font-semibold text-gray-900 mb-6">
        Payment Information
      </Heading>

      {payment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Method */}
          <div className="flex flex-col" data-testid="payment-method-summary">
            <Text className="text-lg font-medium text-gray-900 mb-1">
              Payment Method
            </Text>
            <Text className="text-gray-700">
              {paymentInfoMap[payment.provider_id]?.title}
            </Text>
          </div>

          {/* Payment Details */}
          <div className="flex flex-col" data-testid="payment-details-summary">
            <Text className="text-lg font-medium text-gray-900 mb-1">
              Payment Details
            </Text>
            <div className="flex items-center gap-2 text-gray-700">
              <Container className="flex items-center h-7 w-fit p-2 bg-gray-100 rounded-md">
                {paymentInfoMap[payment.provider_id]?.icon}
              </Container>
              <Text>
                {isStripe(payment.provider_id) && payment.data?.card_last4
                  ? `**** **** **** ${payment.data.card_last4}`
                  : `${convertToLocale({
                      amount: payment.amount,
                      currency_code: order.currency_code,
                    })} paid at ${new Date(
                      payment.created_at ?? ""
                    ).toLocaleString()}`}
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <Text className="text-gray-500">No payment details available.</Text>
      )}

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
