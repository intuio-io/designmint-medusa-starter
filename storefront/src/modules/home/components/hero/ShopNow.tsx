"use client"
import React from "react"
import useZStore from "zustand/useZStore"

type ShopNowProps = {
  baseUrl?: any
  buttonHref?: any
  buttonText?: any
}

const ShopNow = ({ baseUrl, buttonHref, buttonText }: ShopNowProps) => {
  const { colors }: any = useZStore()
  return (
    <a
      href={`${baseUrl}/us/${buttonHref}`}
      style={{ background: colors?.primaryColor }}
      className="mt-4 inline-block rounded-md border border-transparent px-8 py-3 text-center font-medium text-white"
      data-button-text={buttonText}
      data-button-href={buttonHref}
    >
      {buttonText}
    </a>
  )
}

export default ShopNow
