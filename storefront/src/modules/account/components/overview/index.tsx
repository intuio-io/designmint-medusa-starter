"use client"
import { Dialog } from "@headlessui/react"
import {
  BeakerIcon,
  MapPinIcon,
  ShoppingBagIcon,
  UserIcon,
  NewspaperIcon,
} from "@heroicons/react/20/solid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React, { useEffect, useState } from "react"
import useZStore from "zustand/useZStore"

const OverviewV2 = ({ customer, orders }: any) => {
  const { colors, setColors }: any = useZStore()
  const [open, setOpen] = useState(false)
  const [colorSelected, setcolorSelected] = useState(colors?.primaryColor)
  const [primaryColorSelected, setprimaryColorSelected] = useState(
    colors?.primaryColor
  )
  const [secondaryColorSelected, setsecondaryColorSelected] = useState(
    colors?.secondaryColor
  )
  const [ternaryColorSelected, setternaryColorSelected] = useState(
    colors?.ternaryColor
  )

  useEffect(() => {
    setcolorSelected(colors?.primaryColor)
    setsecondaryColorSelected(colors?.secondaryColor)
    setternaryColorSelected(colors?.ternaryColor)
  }, [colors])

  const onColorChange = (e: any, type: any) => {
    if (type == "primaryColor") {
      setcolorSelected(e.target.value)
    } else if (type == "secondaryColor") {
      setsecondaryColorSelected(e.target.value)
    } else {
      setternaryColorSelected(e.target.value)
    }
  }

  const onColorUpdate = (e: any, type: any) => {
    e.preventDefault()
    if (type == "primaryColor") {
      setColors({ ...colors, primaryColor: colorSelected })
    } else if (type == "secondaryColor") {
      setColors({ ...colors, secondaryColor: secondaryColorSelected })
    } else {
      setColors({ ...colors, ternaryColor: ternaryColorSelected })
    }
  }

  function adjustBrightness(hexColor: any, factor: any) {
    hexColor = hexColor.replace("#", "")

    let r = parseInt(hexColor.substring(0, 2), 16)
    let g = parseInt(hexColor.substring(2, 4), 16)
    let b = parseInt(hexColor.substring(4, 6), 16)

    r = Math.min(255, Math.max(0, Math.floor(r * factor)))
    g = Math.min(255, Math.max(0, Math.floor(g * factor)))
    b = Math.min(255, Math.max(0, Math.floor(b * factor)))

    const adjustedColor = `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    return adjustedColor
  }

  return (
    <>
      <div className="mb-4 px-10">
        <div className="flex justify-between items-center px-10">
          <span className="text-xl-semi">Hello {customer?.first_name}</span>
          <span className="text-sm">{customer?.email}</span>
        </div>
        <hr className="mt-2 border-gray-300" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-10">
        {["profile", "addresses", "orders", "subscriptions"].map((item) => (
          <LocalizedClientLink
            key={item}
            href={`/account/${item}`}
            className="group"
          >
            <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
              <div className="flex-shrink-0">
                {item === "profile" && (
                  <UserIcon
                    style={{ color: colors?.primaryColor }}
                    className="h-10 w-10"
                  />
                )}
                {item === "addresses" && (
                  <MapPinIcon
                    style={{ color: colors?.primaryColor }}
                    className="h-10 w-10"
                  />
                )}
                {item === "orders" && (
                  <ShoppingBagIcon
                    style={{ color: colors?.primaryColor }}
                    className="h-10 w-10"
                  />
                )}
                {item === "subscriptions" && (
                  <NewspaperIcon
                    style={{ color: colors?.primaryColor }}
                    className="h-10 w-10"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                  <p className="text-sm font-medium text-gray-900">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {item === "profile" && "Edit and save your profile"}
                    {item === "addresses" && "Add and update your addresses"}
                    {item === "orders" && "View your orders"}
                    {item === "subscriptions" &&
                      "Manage your Newsletters & Subscriptions"}
                  </p>
                </div>
              </div>
            </div>
          </LocalizedClientLink>
        ))}
        {/* <div
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex-shrink-0">
            <BeakerIcon
              style={{ color: colors?.primaryColor }}
              className="h-10 w-10"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <p className="text-sm font-medium text-gray-900">Theme</p>
              <p className="truncate text-sm text-gray-500">
                Change your theme
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default OverviewV2
