// src/admin/widgets/order-files-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { 
  Container, 
  Heading, 
  Text, 
  Button, 
  Badge
} from "@medusajs/ui"
import { Download, Loader, FileText } from "lucide-react"
import { useState } from "react"

// Define the structure of a file
interface FileItem {
  url: string
  name: string
  product: string
  [key: string]: any
}

/**
 * OrderFilesWidget - Displays and manages downloadable files attached to an order
 * @param {DetailWidgetProps} props - Order details passed from Medusa admin
 */
const OrderFilesWidget = ({ 
  data: order,
}: DetailWidgetProps<any>) => {
  // State for tracking bulk download progress
  const [downloading, setDownloading] = useState(false)
  const [downloadingProduct, setDownloadingProduct] = useState<string | null>(null)

  // Extract and transform files from order items metadata
  const filesFromItems: FileItem[] =
    order.items
      ?.flatMap((item: any) =>
        // Map each file and add product context
        item.metadata?.files?.map((file: any) => ({
          ...file,
          product: item.title,
        }))
      )
      .filter(Boolean) || []

  // Don't render if no files are present
  if (filesFromItems.length === 0) {
    return null
  }

  /**
   * Downloads a single file using the browser's download capability
   * @param {string} url - The URL of the file to download
   * @param {string} filename - The name to save the file as
   */
  const downloadFile = async (url: string, filename: string) => {
    try {
        const response = await fetch(url, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.blob()
        const objectUrl = window.URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = objectUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()

        setTimeout(() => {
          document.body.removeChild(link)
          window.URL.revokeObjectURL(objectUrl)
        }, 1000)

    } catch (error) {
      console.error("Download failed:", error)
      // In case of error in production, fallback to opening in new tab
      window.open(url, "_blank")
    }
  }

  /**
   * Initiates download of all files in the order
   */
  const downloadAllFiles = async () => {
    setDownloading(true)
    try {
      // Download files sequentially to avoid browser limitations
      for (const file of filesFromItems) {
        await downloadFile(file.url, file.name)
      }
    } catch (error) {
      console.error("Bulk download failed:", error)
    } finally {
      setDownloading(false)
    }
  }

  /**
   * Initiates download of all files for a specific product
   */
  const downloadProductFiles = async (product: string) => {
    setDownloadingProduct(product)
    try {
      // Get all files for this product
      const productFiles = filesFromItems.filter(f => f.product === product)
      
      // Download files sequentially
      for (const file of productFiles) {
        await downloadFile(file.url, file.name)
      }
    } catch (error) {
      console.error(`Download failed for ${product}:`, error)
    } finally {
      setDownloadingProduct(null)
    }
  }

  // Get unique product names as an array of strings
  const uniqueProducts = Array.from(
    new Set(filesFromItems.map((f) => f.product))
  ) as string[]

  // Group files by product
  const filesByProduct = uniqueProducts.reduce((acc, product) => {
    acc[product] = filesFromItems.filter(f => f.product === product)
    return acc
  }, {} as Record<string, FileItem[]>)

  return (
    <Container className="divide-y p-0">
      {/* Header with title and download all button */}
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Order Files</Heading>
        {filesFromItems.length > 1 && ( // Only show if there are multiple files
          <Button
            variant="secondary"
            size="small"
            onClick={downloadAllFiles}
            disabled={downloading}
          >
            {downloading ? (
              <div className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                <span>Downloading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download size={16} />
                <span>Download All ({filesFromItems.length} files)</span>
              </div>
            )}
          </Button>
        )}
      </div>

      {/* File list by product */}
      <div className="px-6 py-4">
        {uniqueProducts.map((product: string, idx: number) => (
          <div key={product} className="mb-6 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Text weight="plus" className="text-ui-fg-base">
                  {product}
                </Text>
                <Badge size="small" className="ml-2">
                  {filesByProduct[product].length} files
                </Badge>
              </div>
              
              {filesByProduct[product].length > 1 && uniqueProducts.length > 1 && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => downloadProductFiles(product)}
                  disabled={downloadingProduct === product}
                >
                  {downloadingProduct === product ? (
                    <div className="flex items-center gap-2">
                      <Loader size={14} className="animate-spin" />
                      <span>Downloading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download size={14} />
                      <span>Download All</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
            
            <div className="pl-1 mt-3 w-full space-y-2">
              {filesByProduct[product].map((file: FileItem, index: number) => (
                <button key={index} title='Download file'  onClick={() => downloadFile(file.url, file.name)} className="flex w-full items-center text-ui-fg-subtle hover:text-ui-fg-base transition-colors p-2 rounded hover:bg-ui-bg-base-hover">
                  <FileText size={16} className="mr-2 flex-shrink-0" />
                  <span className="mr-2 truncate">{file.name}</span>
                  <span
                    className="ml-auto"
                    title="Download file"
                  >
                    <Download size={14} />
                  </span>
                </button>
              ))}
            </div>
            
            {/* Add separator between products */}
            {idx < uniqueProducts.length - 1 && (
              <div className="h-px bg-ui-border-base my-4"></div>
            )}
          </div>
        ))}
      </div>
    </Container>
  )
}

// The widget's configurations
export const config = defineWidgetConfig({
  zone: "order.details.after",
})

export default OrderFilesWidget