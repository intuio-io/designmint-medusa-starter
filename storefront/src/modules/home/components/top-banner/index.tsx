"use client"
import React, { useLayoutEffect, useState } from "react"
import fetchClient from "@lib/util/fetchClient"
import { useSearchParams } from "next/navigation"
import { getBannerContentFromJson2 } from "@modules/helpers/BannerContentFromJson"
import { Carousel } from "@material-tailwind/react"

const Topbanner = () => {
  const searchParams = useSearchParams()
  const titleBanners = searchParams.getAll("title_banner")
  const [banner, setBanner] = useState<any>(null)

  const loadBanner = async () => {
    try {
      if (titleBanners.length > 0) {
        // Fetch each banner by handle
        const bannerPromises = titleBanners.map((handle) =>
          fetchClient(`/store/collections?handle=${handle}`, {
            method: "GET",
          })
        )

        const responses = await Promise.all(bannerPromises)
        const bannerData = responses.map(
          (response) => response.data.collection.metadata
        )
        setBanner(bannerData)
      } else {
        console.log("else")
        const response = await fetchClient(`/store/collections`, {
          method: "GET",
        })
        const filteredItems = response.data.collections.filter(
          (item: any) =>
            item.handle.includes("home_page-title_banner") &&
            item.metadata?.active === true
        )
        setBanner(filteredItems.map((item: any) => item.metadata))
      }
    } catch (error) {
      console.log("Failed to load banner", error)
    }
  }

  useLayoutEffect(() => {
    loadBanner()
  }, [])

  const titleContent =
    banner?.length > 0 ? getBannerContentFromJson2("title_banner", banner) : []

  const validate = titleContent.length > 0 ? true : false

  return validate ? (
    <div className="w-full" data-component="title_banner">
      {titleContent.length > 1 ? (
        <Carousel
          loop={true}
          autoplay={true}
          navigation={() => <div></div>}
          prevArrow={() => <div></div>}
          nextArrow={() => <div></div>}
          className="h-auto"
        >
          {titleContent.map((bannerContent, index) => (
            <div key={index} className="h-full">
              <p
                style={{
                  background: bannerContent.background_color,
                  color: bannerContent.text_color,
                }}
                className="flex py-2 md:py-3 items-center justify-center px-2 text-xs sm:text-sm font-medium text-center text-white sm:px-4 lg:px-8"
                data-text={bannerContent.text}
                data-text-color={bannerContent.text_color}
                data-background-color={bannerContent.background_color}
              >
                {bannerContent.text}
              </p>
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="h-full">
          <p
            style={{
              background: titleContent[0]?.background_color,
              color: titleContent[0]?.text_color,
            }}
            className="flex py-2 md:py-3 items-center justify-center px-2 text-xs sm:text-sm font-medium text-center text-white sm:px-4 lg:px-8"
            data-text={titleContent[0]?.text}
            data-text-color={titleContent[0]?.text_color}
            data-background-color={titleContent[0]?.background_color}
          >
            {titleContent[0]?.text}
          </p>
        </div>
      )}
    </div>
  ) : (
    <div className="h-full">
      <p
        style={{
          background: "black",
          color: "white",
        }}
        className="flex py-2 md:py-3 items-center justify-center px-2 text-xs sm:text-sm font-medium text-center text-white sm:px-4 lg:px-8"
      >
        Buy More, Save More! Flat 5% OFF on Orders ₹10,000+ | Code: SAVE5
      </p>
    </div>
  )
}

export default Topbanner
