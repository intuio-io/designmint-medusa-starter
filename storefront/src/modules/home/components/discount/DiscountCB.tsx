"use client"
import React from "react"
import GradientBG from "./GradientBG"
import { ChevronRight } from "lucide-react"
import Slider from "./Slider"
import Image from "next/image"

const ContentBlock = ({ content }: { content: any }) => {
  return (
    <div className="grid lg:grid-cols-2 min-h-[600px] w-full">
      <div className="relative pr-0.5overflow-hidden bg-black h-full min-h-[400px]">
        <img
          alt={`${content?.metadata.title} promotion`}
          src={content?.metadata.image1}
          className="h-full w-full object-cover object-center"
          data-image1={content?.metadata.image1}
        />
      </div>

      <div className="relative p-8 lg:p-16 flex items-center overflow-hidden">
        <GradientBG />

        <div className="relative max-w-2xl mx-auto text-white">
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span
                  className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-sm font-medium text-white backdrop-blur-sm border border-white/10"
                  data-badge={content?.metadata.badge_text}
                >
                  {content?.metadata.badge_text || "Special Offer"}
                </span>
                <span className="h-[1px] w-12 bg-gradient-to-r from-white/30 to-transparent"></span>
              </div>
              <h2
                id="sale-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-normal"
                data-title={content?.metadata.title}
                style={{ lineHeight: "1.1" }}
              >
                {content?.metadata.title}
              </h2>
            </div>
            <p
              className="text-lg text-gray-200 leading-relaxed tracking-wide"
              data-description={content?.metadata.description}
            >
              {content?.metadata.description}
            </p>

            <div className="flex items-center space-x-4">
              <a
                href={`${content?.metadata.button_href}`}
                className="group relative inline-flex items-center px-8 py-4 mt-2.5 rounded-lg bg-white text-gray-900 font-medium transition-all duration-300 hover:shadow-lg"
                data-button-href={content?.metadata.button_href}
                data-button-text={content?.metadata.button_text}
              >
                <span>{content?.metadata.button_text}</span>
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DiscountCB = ({ discountContent }: any) => {
  if (!discountContent || discountContent.length === 0) return null

  return (
    // <section aria-labelledby="sale-heading" data-component="discount_banner">
    //   <div className="overflow-hidden  mx-auto">
    //     {discountContent.length > 1 ? (
    //       <Slider>
    //         {discountContent.map((content: any, index: number) => (
    //           <div key={index}>
    //             <ContentBlock content={content} />
    //           </div>
    //         ))}
    //       </Slider>
    //     ) : (
    //       <ContentBlock content={discountContent[0]} />
    //     )}
    //   </div>
    // </section>
    <div className="relative flex flex-col md:flex-row items-center justify-center mx-auto w-full h-[400px] md:h-[490px]">
      {/* Left Side - Text Content */}
      <div className="relative w-full md:w-1/2 h-full text-center md:text-left z-10 pr-0.5">
        <Image
          alt="display-image"
          src="https://res.cloudinary.com/dqhzef5yz/image/upload/v1743747972/Gemini_Generated_Image_xjnf8lxjnf8lxjnf_svti3t.jpg"
          className="h-[300px] md:h-full w-full object-cover"
          width={1000}
          height={1000}
        />
        {/* Bottom-left overlay */}
        <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 p-4 rounded-lg text-white text-center w-56 md:w-64">
          <p className="text-3xl font-semibold text-gray-900">
            Perfect gifting solutions
          </p>
          <p className="text-gray-500">Personalized to your need</p>
          <a
            href="/shop"
            className="mt-2 inline-block bg-black text-white px-4 py-2 rounded-md"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="relative w-full md:w-1/2 pl-0.5 h-full flex items-center justify-center overflow-hidden">
        <Image
          alt="display-image"
          src="https://res.cloudinary.com/dqhzef5yz/image/upload/v1743747945/Gemini_Generated_Image_2ity7k2ity7k2ity_sina9m.jpg"
          className="h-[300px] md:h-full w-full object-cover"
          width={1000}
          height={1000}
        />
        {/* Bottom-right overlay */}
        <div className="absolute bottom-5 left-5 bg-white bg-opacity-90 p-4 rounded-lg text-white text-center w-65 md:w-64">
          <p className="text-3xl font-semibold text-gray-900">
            Promote Your Brand with Custom Labels, Stickers & Packaging!
          </p>
          <p className="text-gray-500">Start designing now</p>
          <a
            href="/shop"
            className="mt-2 inline-block bg-black text-white px-4 py-2 rounded-md"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default DiscountCB
