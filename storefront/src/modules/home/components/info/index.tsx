"use client"
import Image from "next/image"
import React, { useState } from "react"

const Info = () => {
  return (
    <div className="relative flex flex-col md:flex-row justify-center mx-auto w-full h-auto md:h-[490px] pt-12 gap-8 px-4">
      {/* Left Side - Main Content */}
      <div className="relative flex flex-col items-start justify-center w-full md:w-1/2 h-auto md:h-full px-4 md:px-12 py-6 text-left">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
          Brandify: The leader in customisation
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl">
          For more than 20 years, Brandify has helped business owners,
          entrepreneurs and individuals create their identities with custom
          designs and professional marketing. Our online printing services are
          intended to help you find high quality customised products you need –
          visiting cards, personalized clothing, gifting products, and much
          more.
        </p>
      </div>

      {/* Right Side - Features */}
      <div className="relative w-full md:w-1/2 h-auto md:h-full flex flex-col items-start justify-center text-left px-4 md:px-12 py-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg md:text-xl font-semibold">
              Even Low Quantities @ Best Prices
            </h2>
            <p className="text-gray-700 mt-1">
              We offer low/ single product quantities at affordable prices.
            </p>
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-semibold">
              High quality products and Easy design
            </h2>
            <p className="text-gray-700 mt-1">
              Our wide selection of high-quality products and online design
              tools make it easy for you to customize and order your favourite
              products.
            </p>
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-semibold">
              Free replacement or Full Refund
            </h2>
            <p className="text-gray-700 mt-1">
              We stand by everything we sell. So if you’re not satisfied, we’ll
              make it right.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
