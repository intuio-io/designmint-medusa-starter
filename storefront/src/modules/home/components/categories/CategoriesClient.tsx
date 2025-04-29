"use client"
import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

const CategoriesClient = ({ categories }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showArrows, setShowArrows] = useState(false)

  // Check if scrolling is needed
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        setShowArrows(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        )
      }
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [categories])

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" })
    }
  }

  return (
    <div className="relative mx-auto my-12 px-8">
      {/* Heading */}
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <h2
          id="category-heading"
          className="text-3xl tracking-tight text-gray-900"
        >
          Explore all categories
        </h2>
      </div>

      {/* Scroll Buttons (Only show if overflow) */}
      {showArrows && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full hidden md:flex"
          >
            <FaChevronLeft className="text-gray-600" size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow-md rounded-full hidden md:flex"
          >
            <FaChevronRight className="text-gray-600" size={24} />
          </button>
        </>
      )}

      {/* Scrollable Circular Category Icons */}
      <div
        ref={scrollRef}
        className="mt-8 px-4 py-5 md:px-6 flex gap-6 overflow-x-auto scroll-smooth snap-x scrollbar-hide"
      >
        {categories.map((category: any) => (
          <article
            key={category.name}
            className="flex flex-col items-center snap-start"
          >
            <a href={`/store?category=${category.name}`} className="block">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  alt={category.name}
                  src={category?.metadata?.banner}
                  className="object-cover"
                  fill
                  priority
                />
              </div>
            </a>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {category.name}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CategoriesClient
