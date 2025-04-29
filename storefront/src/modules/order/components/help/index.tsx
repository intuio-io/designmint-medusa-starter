import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Help = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
      <Heading className="text-lg font-semibold text-gray-900 mb-2">
        Need Help?
      </Heading>
      <Text className="text-gray-700 mb-3">
        We’re here to assist you with any questions.
      </Text>
      <ul className="flex flex-col gap-2">
        <li>
          <LocalizedClientLink
            href="/contact"
            className="text-blue-600 hover:underline"
          >
            Contact Support
          </LocalizedClientLink>
        </li>
        <li>
          <LocalizedClientLink
            href="/contact"
            className="text-blue-600 hover:underline"
          >
            Returns & Exchanges
          </LocalizedClientLink>
        </li>
      </ul>
    </div>
  )
}

export default Help
