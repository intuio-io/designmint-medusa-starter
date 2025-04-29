"use client"
import Image from "next/image"
import React, { useState } from "react"

const SubscriptionForm = () => {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
    }
  }

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center mx-auto w-full h-auto md:h-[490px] pt-12 gap-2">
      {/* Left Side - Image Content */}
      <div className="relative flex items-center bg-[#f3f3f3] justify-center w-full md:w-1/2 h-[250px] md:h-full p-6 md:p-12">
        <Image
          alt="display-image"
          src="https://res.cloudinary.com/dqhzef5yz/image/upload/v1743754193/Gemini_Generated_Image_9eppiv9eppiv9epp_hz8tnk.jpg"
          className="h-full max-h-[250px] md:max-h-[390px] w-full max-w-[90%] object-cover rounded-2xl"
          width={1000}
          height={1000}
        />
      </div>

      {/* Right Side - Text & Form */}
      <div className="relative w-full md:w-1/2 bg-[#f3f3f3] h-auto md:h-full flex flex-col items-center justify-center text-center px-4 py-6 md:p-12">
        <h2 className="text-2xl md:text-3xl font-semibold">
          It's good to be on the list.
        </h2>
        <p className="text-gray-700 mt-2 max-w-md">
          Get 15% off* your first order when you sign up for our emails
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-2 mt-4 w-full max-w-sm px-2"
        >
          <input
            type="email"
            placeholder="Subscription email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            disabled={!email}
            className={`w-auto px-4 py-2 text-white rounded-md ${
              email ? "bg-black" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitted ? "Subscribed" : "Submit"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-3 max-w-md px-2">
          Yes, I'd like to receive special offer emails from VistaPrint, as well
          as news about products, services, and my designs in progress. Read our
          <a href="#" className="text-black underline">
            {" "}
            Privacy and Cookie policy
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default SubscriptionForm
