"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div className="w-64  bg-white-100 p-6 shadow-md sticky top-20">
      <h3 className="text-lg font-semibold mb-6">
        Hello {customer?.first_name}
      </h3>
      <ul className="space-y-4">
        <AccountNavLink href="/account" route={route!}>
          <User size={20} /> Overview
        </AccountNavLink>
        <AccountNavLink href="/account/profile" route={route!}>
          <User size={20} /> Profile
        </AccountNavLink>
        <AccountNavLink href="/account/addresses" route={route!}>
          <MapPin size={20} /> Addresses
        </AccountNavLink>
        <AccountNavLink href="/account/orders" route={route!}>
          <Package size={20} /> Orders
        </AccountNavLink>
        <AccountNavLink href="/account/subscriptions" route={route!}>
          <Package size={20} /> Subscriptions
        </AccountNavLink>
        <li>
          <button
            type="button"
            className="flex items-center gap-x-2 text-red-600 hover:text-red-800 w-full text-left"
            onClick={handleLogout}
          >
            <ArrowRightOnRectangle /> Log out
          </button>
        </li>
      </ul>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
}

const AccountNavLink = ({ href, route, children }: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()
  const active = route.split(countryCode)[1] === href

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex items-center gap-x-2 p-2 rounded-md transition-all",
        "text-gray-700 hover:text-black hover:bg-gray-200",
        { "bg-gray-300 font-semibold": active }
      )}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
