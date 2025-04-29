"use client"

import React from "react"
import ShopNow from "./ShopNow"
import { Carousel } from "@material-tailwind/react"
import { motion } from "framer-motion"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Image from "next/image"

const HeroCarousel = ({ heroBannerContent }: any) => {
  const filteredItems = heroBannerContent.filter(
    (item: any) =>
      item.handle.includes("home_page-hero_banner") &&
      item.metadata?.active === true
  )

  return (
    <div
      className="w-full relative overflow-hidden"
      data-component="hero_banner"
    >
      {filteredItems.length > 1 ? (
        <Carousel
          prevArrow={({ handlePrev }) => (
            <button
              className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-1 md:p-2 rounded-full shadow-lg hover:bg-white transition"
              onClick={handlePrev}
            >
              <FaChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-900" />
            </button>
          )}
          nextArrow={({ handleNext }) => (
            <button
              className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/30 p-1 md:p-2 rounded-full shadow-lg hover:bg-white transition"
              onClick={handleNext}
            >
              <FaChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-900" />
            </button>
          )}
          className="h-full"
        >
          {filteredItems.map((banner: any, index: any) => (
            <motion.div
              key={index}
              className="relative flex flex-col-reverse md:flex-row items-center justify-center max-w-7xl mx-auto px-4 w-full h-[400px] sm:h-[450px] md:h-[500px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full h-full md:w-1/2">
                <motion.img
                  alt="display-image"
                  src={banner.metadata.image1}
                  className="w-full h-full object-cover rounded-xl"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:gradient-to-r from-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 md:relative md:w-1/2 z-10 p-4 md:p-6 lg:p-8 bg-gradient-to-t from-black/80 to-transparent md:bg-none">
                <div className="max-w-md mx-auto text-center md:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white md:text-gray-900">
                    {banner.title}
                  </h1>
                  <p className="mt-2 text-sm sm:text-base md:text-lg text-white/90 md:text-gray-600">
                    {banner.metadata.description}
                  </p>
                  <div className="mt-4">
                    <ShopNow
                      baseUrl={process.env.NEXT_PUBLIC_BASE_URL}
                      buttonHref={banner.metadata.button_href}
                      buttonText={banner.metadata.button_text}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Carousel>
      ) : (
        <div className="relative flex flex-col md:flex-row items-stretch w-full h-[400px] sm:h-[450px] md:h-[500px]">
          {/* Left Side */}
          <div className="relative w-full md:w-1/2 h-full">
            <Image
              alt="display-image"
              src="https://res.cloudinary.com/dqhzef5yz/image/upload/v1745412332/Gemini_Generated_Image_af32gpaf32gpaf32_avuuqf.jpg"
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 md:bg-opacity-90 md:bottom-4 md:left-4 md:right-auto md:rounded-lg md:w-56 lg:w-64">
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                My Identity
              </p>
              <p className="text-sm text-gray-500">
                100 Standard Visiting Cards at $3.21
              </p>
              <a
                href="/shop"
                className="mt-2 inline-block bg-black text-white px-4 py-2 rounded-md text-sm"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative w-full md:w-1/2 h-full">
            <Image
              alt="display-image"
              src="https://res.cloudinary.com/dqhzef5yz/image/upload/v1745412543/Gemini_Generated_Image_ktcknsktcknsktck_ykh20v.jpg"
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 md:bg-opacity-90 md:bottom-4 md:left-4 md:right-auto md:rounded-lg md:w-56 lg:w-64">
              <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                Personalized Gifting Solutions
              </p>
              <p className="text-sm text-gray-500">Starting at $9.93</p>
              <a
                href="/shop"
                className="mt-2 inline-block bg-black text-white px-4 py-2 rounded-md text-sm"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroCarousel
