import React from "react"
import fetchClient from "@lib/util/fetchClient"
import { getBannerContentFromJson2 } from "@modules/helpers/BannerContentFromJson"
import DiscountCB from "./DiscountCB"

const DiscountBlock = async ({ disocuntConetent }: any) => {
  return <DiscountCB discountContent={disocuntConetent} />
}

export default DiscountBlock
