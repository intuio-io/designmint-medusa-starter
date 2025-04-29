// src/admin/components/designer/DesignerForm.tsx
import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input, Select, Button, toast, Tabs } from "@medusajs/ui"
import { Cloud, Upload } from "lucide-react"
import { sdk } from "../../lib/sdk"

interface DesignerFormProps {
  name: string
  setName: (name: string) => void
  designTypeId: string | null
  setDesignTypeId: any
  selectedCollection: any
  setSelectedCollection: (collection: any) => void
  selectedProduct?: any  // New optional prop
  setSelectedProduct?: (product: any) => void  // New optional prop
  guideFile: any
  setGuideFile: (file: any) => void
  mainImage: any
  handleMainImageUpload: any
  isMainImageUploading: boolean
  mainImageUploadError: any
}

const DesignerForm: React.FC<DesignerFormProps> = ({
  name,
  setName,
  designTypeId,
  setDesignTypeId,
  selectedCollection,
  setSelectedCollection,
  selectedProduct,
  setSelectedProduct,
  guideFile,
  setGuideFile,
  mainImage,
  handleMainImageUpload,
  isMainImageUploading,
  mainImageUploadError
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const imageInputRef = React.useRef<HTMLInputElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [targetType, setTargetType] = useState("collection") // "collection" or "product"
  

  // Fetch available collections
  const { data: collectionsData, isLoading: isLoadingCollections } = useQuery({
    queryKey: ["available-collections"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/designer/available-collections", {}) as any
      return response
    }
  })

  // Fetch available products
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["available-products"],
    queryFn: async () => {
      if (targetType !== "product") return { products: [], count: 0 }
      const response = await sdk.client.fetch("/admin/designer/available-products", {}) as any
      return response
    },
    enabled: targetType === "product" // Only fetch when product tab is selected
  })

  // Fetch design types
  const { data: designTypesData, isLoading: isLoadingDesignTypes } = useQuery({
    queryKey: ["design-types"],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/designer/design-types", {}) as any
      return response
    }
  })

  // Handle guide image upload
  const handleGuideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("files", file)

      // Upload the file using the SDK
      const { files } = await sdk.admin.upload.create({
        files: [file]
      }) as any
      
      // Set the guide file with URL and key
      setGuideFile({
        url: files[0]?.url,
        key: files[0]?.key,
      })
      
      toast.success("Guide image uploaded successfully", {
        position: "top-right"
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload guide image", {
        position: "top-right"
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      e.target.value = ""
    }
  }

  // Function to trigger file input click
  const triggerImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

   // Function to trigger file input click
   const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
    
  // Handle tab change
  const handleTabChange = (value: string) => {
    setTargetType(value)
    // Reset selections when changing type
    if (value === "collection") {
      setSelectedProduct && setSelectedProduct(null)
    } else {
      setSelectedCollection(null)
    }
  }

  return (
    <div className="bg-ui-bg-base border rounded-lg shadow-sm px-6 pt-2 pb-6 mb-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6 items-end">
        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <label className="text-ui-fg-subtle font-medium text-sm">
            Design Name <span className="text-ui-fg-error">*</span>
          </label>
          <Input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter design name"
            size="base"
          />
        </div>

        {/* Design Type Select */}
        <div className="flex flex-col gap-2">
          <label className="text-ui-fg-subtle font-medium text-sm">
            Design Type <span className="text-ui-fg-error">*</span>
          </label>
          <Select
            disabled={isLoadingDesignTypes}
            value={designTypeId || ""}
            onValueChange={(value) => setDesignTypeId(value || null)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select a design type" />
            </Select.Trigger>
            <Select.Content>
              {designTypesData?.types?.map((type: any) => (
                <Select.Item key={type.id} value={type.id}>
                  {type.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        {/* Collection/Product Select */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-ui-fg-subtle font-medium text-sm">
              Target <span className="text-ui-fg-error">*</span>
            </label>
            <Tabs onValueChange={handleTabChange} value={targetType}>
              <Tabs.List>
                <Tabs.Trigger value="collection">Collection</Tabs.Trigger>
                <Tabs.Trigger value="product">Product</Tabs.Trigger>
              </Tabs.List>
            </Tabs>
          </div>
          
          {targetType === "collection" ? (
            <Select
              disabled={isLoadingCollections}
              value={selectedCollection?.value || ""}
              onValueChange={(value) => {
                const collection = collectionsData?.collections?.find((c: any) => c.id === value)
                setSelectedCollection({
                  value: collection?.id,
                  label: collection?.title
                })
              }}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select a collection" />
              </Select.Trigger>
              <Select.Content>
                {collectionsData?.collections?.map((collection: any) => (
                  <Select.Item key={collection.id} value={collection.id}>
                    {collection.title}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          ) : (
            <Select
              disabled={isLoadingProducts}
              value={selectedProduct?.value || ""}
              onValueChange={(value) => {
                if (!setSelectedProduct) return
                const product = productsData?.products?.find((p: any) => p.id === value)
                setSelectedProduct({
                  value: product?.id,
                  label: product?.title
                })
              }}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select a product" />
              </Select.Trigger>
              <Select.Content>
                {productsData?.products?.map((product: any) => (
                  <Select.Item key={product.id} value={product.id}>
                    {product.title}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-ui-fg-subtle font-medium text-sm">
              Image <span className="text-ui-fg-error">*</span>
          </label>
         <div className="flex flex-col gap-2">
              <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className="hidden"
                  id="imageUpload"
                  disabled={isMainImageUploading}
              />
              <Button
                  variant={mainImage ? "secondary" : "primary"}
                  size="base"
                  className="w-full"
                  disabled={isMainImageUploading}
                  onClick={triggerImageUpload}
              >
                  <Upload className="mr-2 h-4 w-4"/>
                      {isMainImageUploading
                          ? "Uploading..."
                          : mainImage
                          ? "Change Image"
                          : "Upload Image"}
              </Button>

              {mainImage && (
                <span className="text-sm text-ui-fg-subtle mt-1 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  image uploaded
                </span>
              )}
              
              {mainImageUploadError && (
                  <span className="text-ui-fg-error text-sm">{mainImageUploadError}</span>
              )}
          </div>
        </div>
 
        {/* Guide Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-ui-fg-subtle font-medium text-sm">
            Guide Image <span className="text-ui-fg-error">*</span>
          </label>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleGuideUpload}
              className="hidden"
              id="guideUpload"
              disabled={isUploading}
            />
            <Button
              variant={guideFile ? "secondary" : "primary"}
              size="base"
              className="w-full"
              disabled={isUploading}
              onClick={triggerFileInput}
            >
              <Cloud className="mr-2 h-4 w-4" />
              {isUploading
                ? "Uploading..."
                : guideFile
                ? "Change Guide Image"
                : "Upload Guide Image"}
            </Button>
            {guideFile && (
              <span className="text-sm text-ui-fg-subtle mt-1 flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Guide image uploaded
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DesignerForm)