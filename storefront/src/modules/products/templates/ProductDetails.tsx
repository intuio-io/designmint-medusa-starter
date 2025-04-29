"use client"

import { useEffect, useState } from "react"
import { ChevronDown, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import ProductActions from "../components/product-actions"
import { addToRecentlyViewed } from "@lib/util/recentlyViewed"
import fetchClient from "@lib/util/fetchClient"

// design components
import FileUpload from "../components/fileupload/FileUpload"
import { FileList } from "../components/fileupload/FileUpload"
import DesignerUpload from "./designer/DesignerUpload"

interface FileInfo {
  url: string
  name: string
  type: string
  uploadedAt: string
  size: number
  file_key: string
}

const ProductDetails = ({ product, region, countryCode }: any) => {
  console.log("product", product)
  const accordian = {
    shipping:
      "Free shipping on orders over $50. Delivery within 5-7 business days.",
    returnPolicy: "30-day return policy. Full refund or exchange available.",
    materialQuality:
      "Made from high-quality synthetic leather with breathable mesh.",
  }

  const [selectedImage, setSelectedImage] = useState(product.images[0].url)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [prevUrl, setPrevUrl] = useState("")

  // design
  const [files, setFiles] = useState<FileInfo[]>([])
  const [designDetails, setDesignDetails] = useState(null)
  const [uploading, setUploading] = useState<boolean>(false)

  useEffect(() => {
    setPrevUrl(document.referrer)
  }, [])

  useEffect(() => {
    if (product?.id) {
      addToRecentlyViewed(product.id)
    }
  }, [product?.id])

  // to check if a product has a design associated
  useEffect(() => {
    const fetchDesignDetails = async () => {
      try {
        let response = await fetchClient(
          `/store/designer/product/${product?.id}`,
          {
            method: "GET",
          }
        )

        if (!response?.data) {
          response = await fetchClient(
            `/store/designer/collection/${product?.collection_id}`,
            {
              method: "GET",
            }
          )
        }

        setDesignDetails(response?.data || null)
      } catch (error) {
        console.log("Error fetching design details:", error)
        setDesignDetails(null)
      }
    }

    if (product?.id) {
      fetchDesignDetails()
    }
  }, [product])

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumbs */}
      <nav className="text-gray-600 text-sm mb-4 flex items-center">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <Link href={`${prevUrl}`} className="hover:underline">
          {prevUrl.includes("store") ? "Store" : "Category"}
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="font-semibold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image Gallery */}
        <div>
          <div className="relative">
            <img
              src={selectedImage}
              alt="Product Image"
              className="w-full h-96 object-contain border rounded-lg"
            />
            <span className="absolute bottom-1 right-2 text-xs text-gray-500 bg-white bg-opacity-70 px-2 py-0.5 rounded">
              Image by Freepik
            </span>
          </div>

          <div className="flex gap-3 mt-4">
            {product.images.map((pro: any, index: any) => (
              <img
                key={index}
                src={pro.url}
                alt="Thumbnail"
                className={`w-20 h-20 rounded-lg cursor-pointer object-contain border-2 ${
                  selectedImage === pro.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(pro.url)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-gray-600 text-lg mt-2">{product.description}</p>

          {/* Size Selection */}
          {/* <div className="mt-4">
            <h3 className="text-lg font-semibold">Select Size</h3>
            <div className="flex gap-3 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded-md border ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div> */}

          {/* Color Selection */}
          {/* <div className="mt-4">
            <h3 className="text-lg font-semibold">Select Color</h3>
            <div className="flex gap-3 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 rounded-md border ${
                    selectedColor === color
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div> */}

          {designDetails && (
            <div className="pt-5">
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                <div className="w-full xl:w-1/2">
                  <FileUpload
                    uploading={uploading}
                    setUploading={setUploading}
                    setUploadedFiles={setFiles}
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <DesignerUpload
                    setUploadedFiles={setFiles}
                    designDetails={designDetails}
                  />
                </div>
              </div>

              <div>
                <FileList uploadedFiles={files} setUploadedFiles={setFiles} />
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <div className="mt-6">
            <ProductActions
              product={product}
              region={region}
              designDetails={designDetails}
              files={files}
              setFiles={setFiles}
            />
          </div>

          {/* Accordions Section */}
          <div className="mt-8">
            {[
              { title: "Shipping & Delivery", content: accordian.shipping },
              {
                title: "Return & Refund Policy",
                content: accordian.returnPolicy,
              },
              {
                title: "Material & Quality",
                content: accordian.materialQuality,
              },
            ].map((item, index) => (
              <div key={index} className="border-b">
                <button
                  className="w-full flex justify-between items-center py-3 text-left font-semibold"
                  onClick={() =>
                    setOpenAccordion(
                      openAccordion === item.title ? null : item.title
                    )
                  }
                >
                  {item.title}
                  <ChevronDown
                    className={`transition-transform ${
                      openAccordion === item.title ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openAccordion === item.title && (
                  <p className="text-gray-600 pb-3">{item.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {/* <div className="mt-12">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="mt-4">
          {product.reviews.map((review, index) => (
            <div key={index} className="p-4 border rounded-lg my-2">
              <p className="font-semibold">{review.user}</p>
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default ProductDetails
