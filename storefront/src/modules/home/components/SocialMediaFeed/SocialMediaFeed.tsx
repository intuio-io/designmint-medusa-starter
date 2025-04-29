"use client"
import React, { useEffect, useState } from "react"

const SocialMediaFeed = () => {
  const [socialImgs, setSocialImgs] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy-instagram")
        const result = await response.json()
        setSocialImgs(result.images || [])
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="mb-16 md:mb-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-center items-center py-6 md:py-12 text-center">
          <span className="text-xl md:text-2xl">
            Follow us on Instagram to see the latest by{" "}
          </span>
          <span className="text-xl md:text-2xl font-semibold">@brandify</span>
        </div>

        {/* Image Slider */}
        <div className="relative w-full overflow-hidden">
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto py-2 px-2 scrollbar-hide">
            {socialImgs.slice(0, 10).map((ele: any, ind: any) => (
              <div
                key={ind}
                className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={ele}
                  alt={`Instagram post ${ind + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaFeed
