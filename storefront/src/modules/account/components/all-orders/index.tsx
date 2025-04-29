"use client"
import { useEffect, useState } from "react"
import {
  ShoppingCartIcon,
  ArrowPathIcon,
  TruckIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import { formatAmount } from "@lib/util/prices"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/20/solid"
import useZStore from "zustand/useZStore"
// Secondary navigation tabs
const secondaryNavigation = [
  { name: "Orders", identifier: "orders", icon: ShoppingCartIcon },
  { name: "Buy Again", identifier: "buyagain", icon: ArrowPathIcon },
  { name: "Not Yet Shipped", identifier: "notyetshipped", icon: TruckIcon },
  {
    name: "Cancelled Orders",
    identifier: "cancelledorders",
    icon: XCircleIcon,
  },
]
const products = [
  {
    id: 1,
    name: "Lotus Herbals Safe Sun UV Screen Matte Gel SPF 50",
    description: "Comfrey, Vanilla, Horse Extract",
    details: "Paraben Free, Cruelty Free, Matte Gel, No White Cast",
    skinType: "Normal to Oily Skin | PA+++ | 100gm",
    unscented: "Unscented · 100 g (Pack of 1)",
    discountedPrice: "₹305.00",
    originalPrice: "₹565.00",
    deliveryDate: "Saturday, October 26",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  {
    id: 2,
    name: "Another Product",
    description: "Description of another product",
    details: "Details about the product",
    skinType: "Normal Skin | SPF 30 | 50gm",
    unscented: "Unscented · 50 g (Pack of 1)",
    discountedPrice: "₹250.00",
    originalPrice: "₹450.00",
    deliveryDate: "Sunday, October 27",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  {
    id: 3,
    name: "Another Product",
    description: "Description of another product",
    details: "Details about the product",
    skinType: "Normal Skin | SPF 30 | 50gm",
    unscented: "Unscented · 50 g (Pack of 1)",
    discountedPrice: "₹250.00",
    originalPrice: "₹450.00",
    deliveryDate: "Sunday, October 27",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  {
    id: 4,
    name: "Another Product",
    description: "Description of another product",
    details: "Details about the product",
    skinType: "Normal Skin | SPF 30 | 50gm",
    unscented: "Unscented · 50 g (Pack of 1)",
    discountedPrice: "₹250.00",
    originalPrice: "₹450.00",
    deliveryDate: "Sunday, October 27",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  {
    id: 5,
    name: "Another Product",
    description: "Description of another product",
    details: "Details about the product",
    skinType: "Normal Skin | SPF 30 | 50gm",
    unscented: "Unscented · 50 g (Pack of 1)",
    discountedPrice: "₹250.00",
    originalPrice: "₹450.00",
    deliveryDate: "Sunday, October 27",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  {
    id: 6,
    name: "Another Product",
    description: "Description of another product",
    details: "Details about the product",
    skinType: "Normal Skin | SPF 30 | 50gm",
    unscented: "Unscented · 50 g (Pack of 1)",
    discountedPrice: "₹250.00",
    originalPrice: "₹450.00",
    deliveryDate: "Sunday, October 27",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  {
    id: 7,
    name: "Another Product",
    description: "Description of another product",
    details: "Details about the product",
    skinType: "Normal Skin | SPF 30 | 50gm",
    unscented: "Unscented · 50 g (Pack of 1)",
    discountedPrice: "₹250.00",
    originalPrice: "₹450.00",
    deliveryDate: "Sunday, October 27",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  {
    id: 8,
    name: "Another Product",
    description: "Description of another product",
    details: "Details about the product",
    skinType: "Normal Skin | SPF 30 | 50gm",
    unscented: "Unscented · 50 g (Pack of 1)",
    discountedPrice: "₹250.00",
    originalPrice: "₹450.00",
    deliveryDate: "Sunday, October 27",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", // Replace with the actual image path
  },
  // Add more products as needed
]

// Helper function to join classes
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

function formatDate(input: string): string {
  const date = new Date(input)
  const day = date.getDate()
  const year = date.getFullYear()
  const month = date.toLocaleString("default", { month: "long" })

  return `${day} ${month} ${year}`
}

function truncateText(text: string, wordLimit: number = 5): string {
  const words = text?.split(" ")
  if (words?.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "..."
  }
  return text
}

// #region Pagination
interface PaginationProps {
  dataSrc: Array<{ data: string }> // Adjust 'data' type as per your actual data
  limit: number
  onPageChange: (page: number) => void
  colors: any
}
const Pagination: React.FC<PaginationProps> = ({
  dataSrc,
  limit,
  onPageChange,
  colors,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const totalPages = Math.ceil(dataSrc.length / limit)
  const totalItems = dataSrc.length
  const start = (currentPage - 1) * limit + 1
  const end = Math.min(start + limit - 1, totalItems)

  useEffect(() => {
    setCurrentPage(1)
  }, [dataSrc])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    onPageChange(page)
  }

  const generatePageNumbers = (): Array<number | string> => {
    let pages: Array<number | string> = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages]
      } else if (currentPage > totalPages - 3) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ]
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ]
      }
    }
    return pages
  }

  return (
    <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{start}</span> to{" "}
            <span className="font-medium">{end}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon aria-hidden="true" className="h-5 w-5" />
            </button>
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                className={`${
                  currentPage === page
                    ? "relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                }`}
                style={{
                  background:
                    page === "..." || currentPage !== page
                      ? "transparent"
                      : colors?.primaryColor,
                  transition: ".3s ease-in-out",
                }}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

interface UniqueProduct {
  title: string
  description: string
  thumbnail: string
  id: string
}

const index = ({ allOrders }: any) => {
  // console.log("allOrders", allOrders);
  const [activeTab, setActiveTab] = useState("orders")
  const [timeFrame, setTimeFrame] = useState("past-3-months")
  const [selectedFilter, setSelectedFilter] = useState("past-3-months")
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [uniqueYears, setUniqueYears] = useState<any[]>([])
  const limit = 5
  const [currentPage, setCurrentPage] = useState(1)
  const [startIndex, setstartIndex] = useState((currentPage - 1) * limit)
  const { colors }: any = useZStore()
  const [notShippedOrders, setnotShippedOrders] = useState([])
  const [cancelledOrders, setcancelledOrders] = useState([])
  const [buyAgainProducts, setbuyAgainProducts] = useState([])
  const [uniqueProducts, setUniqueProducts] = useState<UniqueProduct[]>([])
  const [isLoading, setisLoading] = useState(true)

  // console.log("uniqueProducts", uniqueProducts);

  const handlePageChange = (page: any) => setCurrentPage(page)

  const currentData = filteredData.slice(startIndex, startIndex + limit)

  console.log("currData", currentData)

  useEffect(() => {
    // Get unique years from the data
    const years = Array.from(
      new Set(
        allOrders.map((item: any) => new Date(item.created_at).getFullYear())
      )
    )
    setUniqueYears(years.sort((a: any, b: any) => b - a)) // Sort years in descending order
    setnotShippedOrders(
      allOrders.filter((x: any) => x.fulfillment_status == "not_fulfilled")
    )
    setcancelledOrders(
      allOrders.filter((x: any) => x.fulfillment_status == "canceled")
    )
    const productMap = new Map<string, UniqueProduct>()
    allOrders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const { title, description, thumbnail, variant } = item
        const product_id = variant.product_id
        if (!productMap.has(product_id)) {
          productMap.set(product_id, {
            title,
            description,
            thumbnail,
            id: product_id,
          })
        }
      })
    })
    setUniqueProducts(Array.from(productMap.values()))
    setisLoading(false)
  }, [allOrders])

  useEffect(() => {
    // Filter data based on selected option
    const now = new Date()
    let filtered: any[]

    switch (selectedFilter) {
      case "past-3-months":
        filtered = allOrders.filter((item: any) => {
          const itemDate = new Date(item.created_at)
          return (
            itemDate >=
            new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          )
        })
        break
      case "past-6-months":
        filtered = allOrders.filter((item: any) => {
          const itemDate = new Date(item.created_at)
          return (
            itemDate >=
            new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
          )
        })
        break
      default:
        const selectedYear = parseInt(selectedFilter)
        if (!isNaN(selectedYear)) {
          filtered = allOrders.filter(
            (item: any) =>
              new Date(item.created_at).getFullYear() === selectedYear
          )
        } else {
          filtered = allOrders // Show all if filter is not recognized
        }
        break
    }

    setFilteredData(filtered)
    setstartIndex(0)
  }, [selectedFilter, allOrders])

  useEffect(() => {
    setstartIndex((currentPage - 1) * limit)
  }, [currentPage])

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Navigation Tabs */}
        <nav className="border-b border-gray-200">
          <ul className="flex space-x-8" role="tablist">
            {secondaryNavigation.map((item) => (
              <li key={item.name} className="cursor-pointer">
                <a
                  onClick={() => setActiveTab(item.identifier)}
                  className={classNames(
                    activeTab === item.identifier
                      ? "border-indigo-500 text-indigo-600 font-semibold"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                    "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm"
                  )}
                >
                  <item.icon
                    className={classNames(
                      activeTab === item.identifier
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-2 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Section */}
        <div className="space-y-6">
          {/* 
                    // #region Orders
                     */}
          {activeTab === "orders" && (
            <div>
              {/* Filter Dropdown */}
              {currentData.length == 0 ? (
                ""
              ) : (
                <div className="flex flex-wrap justify-between items-center mb-4 pt-6">
                  <div className="flex items-center">
                    <label htmlFor="time-frame" className="mr-2 text-gray-600">
                      Filter by:
                    </label>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      style={{ width: "150px" }}
                      className="border rounded-md p-2 text-gray-700 focus:outline-none focus:ring focus:ring-indigo-500"
                    >
                      <option value="past-3-months">Past 3 Months</option>
                      <option value="past-6-months">Past 6 Months</option>
                      {uniqueYears.map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center w-full h-full text-ui-fg-base">
                  <Spinner size={36} />
                </div>
              ) : currentData.length == 0 ? (
                <div className="flex items-center justify-center w-full h-full text-ui-fg-base">
                  <div className="text-center">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 256 256"
                      xmlns="http://www.w3.org/2000/svg"
                      data-darkreader-inline-fill=""
                      data-darkreader-inline-stroke=""
                      className="mx-auto h-12 w-12 text-gray-400"
                    >
                      <path d="M221.76,69.66l-88-48.18a12,12,0,0,0-11.52,0l-88,48.18A12,12,0,0,0,28,80.18v95.64a12,12,0,0,0,6.24,10.52l88,48.18a11.95,11.95,0,0,0,11.52,0l88-48.18A12,12,0,0,0,228,175.82V80.18A12,12,0,0,0,221.76,69.66ZM126.08,28.5a3.94,3.94,0,0,1,3.84,0L216.67,76,178.5,96.89a4,4,0,0,0-.58-.4l-88-48.18Zm1.92,96L39.33,76,81.56,52.87l88.67,48.54Zm-89.92,54.8a4,4,0,0,1-2.08-3.5V83.29l88,48.16v94.91Zm179.84,0h0l-85.92,47V131.45l40-21.89V152a4,4,0,0,0,8,0V105.18l40-21.89v92.53A4,4,0,0,1,217.92,179.32Z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      No orders
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by placing a new order.
                    </p>
                    <div className="mt-6">
                      <LocalizedClientLink href="/">
                        <div className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm">
                          Shop Now
                        </div>
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {currentData.map((order: any) => (
                    <div
                      key={order.id}
                      className="bg-white border rounded-lg p-4 mb-6 transition-all duration-300"
                    >
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="flex-grow">
                          {/* Order Details in a single line */}
                          <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                            <div>
                              <p>Order id:</p>
                              <p className="font-semibold">
                                #{order.display_id}
                              </p>
                            </div>
                            <div>
                              <p>Order Placed:</p>
                              <p>{formatDate(order.created_at)}</p>
                            </div>
                            <div>
                              <p>Total:</p>
                              <p>
                                {/* {formatAmount({
                                  amount: order.total,
                                  region: order.region,
                                  includeTaxes: false,
                                })} */}
                                {order.total}
                              </p>
                            </div>
                            <div>
                              <p>Ship to:</p>
                              <p>
                                {order.customer.first_name}{" "}
                                {order.customer.last_name}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-4 mt-2 sm:mt-0">
                          <LocalizedClientLink
                            href={`/account/orders/details/${order.id}`}
                          >
                            <div className="text-blue-600 hover:underline">
                              View Order Details
                            </div>
                          </LocalizedClientLink>
                          {/* <a href="#" className="text-blue-600 hover:underline">Invoice</a> */}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 mt-4 pt-3 flex flex-col sm:flex-row sm:justify-between">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          {order.items.slice(0, 3).map((ele: any, ind: any) => {
                            return (
                              <div
                                key={ind}
                                className="flex flex-row items-start"
                              >
                                <div
                                  style={{ overflow: "hidden" }}
                                  className="w-16 h-16 rounded-md mr-4 mb-4 sm:mb-0"
                                >
                                  <img
                                    src={ele.thumbnail}
                                    alt="Product"
                                    style={{
                                      objectFit: "cover",
                                      height: "100%",
                                      width: "100%",
                                    }}
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <p className="font-semibold text-gray-800">
                                    {ele.title}{" "}
                                    <span className="text-sm text-gray-500">
                                      x{ele.quantity}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-500 text-ellipsis ">
                                    {truncateText(ele.description)}
                                  </p>

                                  <p className="text-sm text-green-500">
                                    {ele.metadata.etd
                                      ? `Estimated delivery date: ` +
                                        ele.metadata.etd
                                      : ""}
                                  </p>
                                  {/* Buttons positioned below product title for all items */}
                                  <div className="flex space-x-2 mt-2">
                                    {/* <button className="bg-yellow-500 text-black px-4 py-1 rounded-full shadow hover:bg-yellow-600 transition">
                                                                    Buy Again
                                                                </button> */}
                                    <LocalizedClientLink
                                      href={`/products/${ele.title
                                        .toLowerCase()
                                        .split(" ")
                                        .join("-")}`}
                                    >
                                      <div className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                                        View Your Item
                                      </div>
                                    </LocalizedClientLink>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                          {order.items.length > 3 ? (
                            <LocalizedClientLink
                              href={`/account/orders/details/${order.id}`}
                            >
                              <div className="text-blue-600 hover:underline">
                                More {order.items.length - 3}{" "}
                                {order.items.length - 3 == 1 ? "item" : "items"}
                              </div>
                            </LocalizedClientLink>
                          ) : (
                            ""
                          )}
                        </div>

                        {/* Additional Actions - adjusted to be consistently below the description */}
                        <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
                          <button className="bg-white-600 border-red-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                            Track Package
                          </button>
                          <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                            Return or Replace Items
                          </button>
                          <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                            Share Gift Receipt
                          </button>
                          <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                            Leave Seller Feedback
                          </button>
                          <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                            Leave Delivery Feedback
                          </button>
                          <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                            Write a Product Review
                          </button>
                          <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                            Archive Order
                          </button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`text-sm font-semibold ${
                            order.fulfillment_status == "canceled"
                              ? "text-red-600"
                              : order.fulfillment_status == "fulfilled"
                              ? "text-green-600"
                              : "text-grey-600"
                          }`}
                        >
                          Order{" "}
                          {order.fulfillment_status == "canceled"
                            ? "Cancelled"
                            : order.fulfillment_status == "fulfilled"
                            ? "Delivered"
                            : "Not Yet Shipped"}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Pagination
                    limit={limit}
                    dataSrc={filteredData}
                    onPageChange={handlePageChange}
                    colors={colors}
                  />
                </>
              )}
            </div>
          )}
          {/* 
                    // #region Buy Again
                    */}
          {activeTab === "buyagain" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {uniqueProducts.slice(0, 8).map((product) => (
                  <div
                    key={product.id}
                    className="border flex flex-col p-4 h-full"
                  >
                    {" "}
                    {/* Ensure the product card uses full height */}
                    <div style={{ height: "250px", width: "100%" }}>
                      <img
                        src={product.thumbnail}
                        loading="lazy"
                        alt={product.title}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {product.description}
                    </p>
                    {/* Ensure the button is placed at the bottom */}
                    <div
                      style={{ marginTop: "10px" }}
                      className="flex-grow flex items-end"
                    >
                      <LocalizedClientLink
                        className="w-full"
                        href={`/products/${product.title
                          .toLowerCase()
                          .split(" ")
                          .join("-")}`}
                      >
                        <button
                          style={{
                            background: colors?.primaryColor,
                            width: "100%",
                          }}
                          className="text-black px-4 py-2 rounded-lg shadow transition w-full"
                        >
                          Reorder
                        </button>
                      </LocalizedClientLink>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 
                    // #region not yet shipped
                    */}
          {activeTab === "notyetshipped" && (
            <>
              {notShippedOrders
                .slice(startIndex, startIndex + limit)
                .map((order: any) => (
                  <div
                    key={order.id}
                    className="bg-white border-black-400 rounded-lg p-4 mb-6 transition-all duration-300"
                  >
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex-grow">
                        {/* Order Details in a single line */}
                        <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                          <div>
                            <p>Order id:</p>
                            <p className="font-semibold">#{order.display_id}</p>
                          </div>
                          <div>
                            <p>Order Placed:</p>
                            <p>{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <p>Total:</p>
                            <p>
                              {formatAmount({
                                amount: order.total,
                                region: order.region,
                                includeTaxes: false,
                              })}
                            </p>
                          </div>
                          <div>
                            <p>Ship to:</p>
                            <p>
                              {order.customer.first_name}{" "}
                              {order.customer.last_name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-2 sm:mt-0">
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <div className="text-blue-600 hover:underline">
                            View Order Details
                          </div>
                        </LocalizedClientLink>
                        {/* <a href="#" className="text-blue-600 hover:underline">Invoice</a> */}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-3 flex flex-col sm:flex-row sm:justify-between">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                        }}
                      >
                        {order.items.slice(0, 3).map((ele: any, ind: any) => {
                          return (
                            <div
                              key={ind}
                              className="flex flex-row items-start"
                            >
                              <div
                                style={{ overflow: "hidden" }}
                                className="w-16 h-16 rounded-md mr-4 mb-4 sm:mb-0"
                              >
                                <img
                                  src={ele.thumbnail}
                                  alt="Product"
                                  style={{
                                    objectFit: "cover",
                                    height: "100%",
                                    width: "100%",
                                  }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <p className="font-semibold text-gray-800">
                                  {ele.title}{" "}
                                  <span className="text-sm text-gray-500">
                                    x{ele.quantity}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-500 text-ellipsis ">
                                  {truncateText(ele.description)}
                                </p>

                                {/* Buttons positioned below product title for all items */}
                                <div className="flex space-x-2 mt-2">
                                  {/* <button className="bg-yellow-500 text-black px-4 py-1 rounded-full shadow hover:bg-yellow-600 transition">
                                                                    Buy Again
                                                                </button> */}
                                  <LocalizedClientLink
                                    href={`/products/${ele.title
                                      .toLowerCase()
                                      .split(" ")
                                      .join("-")}`}
                                  >
                                    <div className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                                      View Your Item
                                    </div>
                                  </LocalizedClientLink>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {order.items.length > 3 ? (
                          <LocalizedClientLink
                            href={`/account/orders/details/${order.id}`}
                          >
                            <div className="text-blue-600 hover:underline">
                              More {order.items.length - 3}{" "}
                              {order.items.length - 3 == 1 ? "item" : "items"}
                            </div>
                          </LocalizedClientLink>
                        ) : (
                          ""
                        )}
                      </div>

                      {/* Additional Actions - adjusted to be consistently below the description */}
                      <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
                        <button className="bg-white-600 border-red-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Track Package
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Return or Replace Items
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Share Gift Receipt
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Leave Seller Feedback
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Leave Delivery Feedback
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Write a Product Review
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Archive Order
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-sm font-semibold ${
                          order.fulfillment_status == "canceled"
                            ? "text-red-600"
                            : order.fulfillment_status == "fulfilled"
                            ? "text-green-600"
                            : "text-grey-600"
                        }`}
                      >
                        Order{" "}
                        {order.fulfillment_status == "canceled"
                          ? "Cancelled"
                          : order.fulfillment_status == "fulfilled"
                          ? "Delivered"
                          : "Not Yet Shipped"}
                      </span>
                    </div>
                  </div>
                ))}
              <Pagination
                limit={limit}
                dataSrc={notShippedOrders}
                onPageChange={handlePageChange}
                colors={colors}
              />
            </>
          )}
          {/* 
                        // #region cancelled
                        */}
          {activeTab === "cancelledorders" && (
            <>
              {cancelledOrders
                .slice(startIndex, startIndex + limit)
                .map((order: any) => (
                  <div
                    key={order.id}
                    className="bg-white border-black-400 rounded-lg p-4 mb-6 transition-all duration-300"
                  >
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex-grow">
                        {/* Order Details in a single line */}
                        <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
                          <div>
                            <p>Order id:</p>
                            <p className="font-semibold">#{order.display_id}</p>
                          </div>
                          <div>
                            <p>Order Placed:</p>
                            <p>{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <p>Total:</p>
                            <p>
                              {formatAmount({
                                amount: order.total,
                                region: order.region,
                                includeTaxes: false,
                              })}
                            </p>
                          </div>
                          <div>
                            <p>Ship to:</p>
                            <p>
                              {order.customer.first_name}{" "}
                              {order.customer.last_name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-4 mt-2 sm:mt-0">
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <div className="text-blue-600 hover:underline">
                            View Order Details
                          </div>
                        </LocalizedClientLink>
                        {/* <a href="#" className="text-blue-600 hover:underline">Invoice</a> */}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-3 flex flex-col sm:flex-row sm:justify-between">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px",
                        }}
                      >
                        {order.items.slice(0, 3).map((ele: any, ind: any) => {
                          return (
                            <div
                              key={ind}
                              className="flex flex-row items-start"
                            >
                              <div
                                style={{ overflow: "hidden" }}
                                className="w-16 h-16 rounded-md mr-4 mb-4 sm:mb-0"
                              >
                                <img
                                  src={ele.thumbnail}
                                  alt="Product"
                                  style={{
                                    objectFit: "cover",
                                    height: "100%",
                                    width: "100%",
                                  }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <p className="font-semibold text-gray-800">
                                  {ele.title}{" "}
                                  <span className="text-sm text-gray-500">
                                    x{ele.quantity}
                                  </span>
                                </p>
                                <p className="text-sm text-gray-500 text-ellipsis ">
                                  {truncateText(ele.description)}
                                </p>

                                {/* Buttons positioned below product title for all items */}
                                <div className="flex space-x-2 mt-2">
                                  {/* <button className="bg-yellow-500 text-black px-4 py-1 rounded-full shadow hover:bg-yellow-600 transition">
                                                                    Buy Again
                                                                </button> */}
                                  <LocalizedClientLink
                                    href={`/products/${ele.title
                                      .toLowerCase()
                                      .split(" ")
                                      .join("-")}`}
                                  >
                                    <div className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                                      View Your Item
                                    </div>
                                  </LocalizedClientLink>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {order.items.length > 3 ? (
                          <LocalizedClientLink
                            href={`/account/orders/details/${order.id}`}
                          >
                            <div className="text-blue-600 hover:underline">
                              More {order.items.length - 3}{" "}
                              {order.items.length - 3 == 1 ? "item" : "items"}
                            </div>
                          </LocalizedClientLink>
                        ) : (
                          ""
                        )}
                      </div>

                      {/* Additional Actions - adjusted to be consistently below the description */}
                      <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
                        <button className="bg-white-600 border-red-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Track Package
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Return or Replace Items
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Share Gift Receipt
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Leave Seller Feedback
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Leave Delivery Feedback
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Write a Product Review
                        </button>
                        <button className="bg-white-600 text-black px-4 py-1 rounded-full shadow hover:bg-gray-100 transition">
                          Archive Order
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span
                        className={`text-sm font-semibold ${
                          order.fulfillment_status == "canceled"
                            ? "text-red-600"
                            : order.fulfillment_status == "fulfilled"
                            ? "text-green-600"
                            : "text-grey-600"
                        }`}
                      >
                        Order{" "}
                        {order.fulfillment_status == "canceled"
                          ? "Cancelled"
                          : order.fulfillment_status == "fulfilled"
                          ? "Delivered"
                          : "Not Yet Shipped"}
                      </span>
                    </div>
                  </div>
                ))}
              <Pagination
                limit={limit}
                dataSrc={cancelledOrders}
                onPageChange={handlePageChange}
                colors={colors}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default index
