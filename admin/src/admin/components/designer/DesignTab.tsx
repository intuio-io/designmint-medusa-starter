// src/admin/components/designer/DesignTab.tsx
import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, Container, Table, Heading, Input, Text, Select, toast, Tabs } from "@medusajs/ui"
import { sdk } from "../../lib/sdk"
import { Plus, Trash, PenSquare, AlertCircle } from "lucide-react"
import { format } from 'date-fns'

type Design = {
  id: string
  name: string
  img_url: string
  guide_url: string
  meta_data: any
  design_type_id: string
  collection_id: string | null
  product_id: string | null
  design_type: {
    id: string
    name: string
  }
  collection?: {
    id: string
    title: string
  }
  product?: {
    id: string
    title: string
  }
  created_at: string
  updated_at: string
}

// Modal Animation Component
const ModalAnimation: React.FC<{
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}> = ({ children, isOpen, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      // Delay the animation start slightly
      const openTimer = setTimeout(() => {
        setIsAnimating(true)
      }, 10)
      return () => clearTimeout(openTimer)
    } else {
      setIsAnimating(false)
      // Wait for animation to complete
      const closeTimer = setTimeout(() => {
        setIsRendered(false)
      }, 300)
      return () => clearTimeout(closeTimer)
    }
  }, [isOpen])

  if (!isRendered) return null

  return (
    <div
      className={`fixed inset-0 bg-black transition-all duration-300 ease-in-out z-50
        ${isAnimating ? "bg-opacity-50" : "bg-opacity-0"}`}
      onClick={onClose}
    >
      <div
        className={`fixed left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 
          transition-all duration-300 ease-in-out transform
          ${isAnimating 
            ? "-translate-y-1/2 opacity-100 scale-100" 
            : "translate-y-10 opacity-0 scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  name: string
  isDeleting: boolean
}> = ({ isOpen, onClose, onConfirm, name, isDeleting }) => {
  return (
    <ModalAnimation isOpen={isOpen} onClose={onClose}>
      <div className="bg-ui-bg-base rounded-lg shadow-lg mx-4">
        <div className="p-4 border-b border-ui-border-base">
          <div className="flex items-center gap-3">
            <div className="bg-ui-bg-danger p-2 rounded-full">
              <AlertCircle className="text-ui-fg-danger" size={22} />
            </div>
            <h3 className="text-lg font-semibold text-ui-fg-base">
              Confirm Deletion
            </h3>
          </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-ui-fg-subtle text-lg">
            Are you sure you want to delete <br />
            <span className="font-medium text-ui-fg-base">"{name}"</span>?
          </p>
        </div>

        <div className="px-6 py-4 bg-ui-bg-subtle border-t border-ui-border-base rounded-b-lg flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </ModalAnimation>
  )
}

// Edit Design Modal Component
const EditDesignModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  design: Design | null
  designTypes: any[]
  collections: any[]
  products: any[]
  onUpdate: (data: any) => Promise<void>
  isSubmitting: boolean
}> = ({ 
  isOpen, 
  onClose, 
  design, 
  designTypes, 
  collections, 
  products,
  onUpdate,
  isSubmitting
}) => {
  const [name, setName] = useState("")
  const [designTypeId, setDesignTypeId] = useState<string | null>(null)
  const [targetType, setTargetType] = useState<string>("collection") // "collection" or "product"
  const [collectionId, setCollectionId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)

  // Reset form when design changes
  useEffect(() => {
    if (design) {
      setName(design.name)
      setDesignTypeId(design.design_type_id)

      if (design.product_id) {
        setTargetType('product')
        setProductId(design.product_id)
        setCollectionId(null)
      } else {
        setTargetType('collection')
        setCollectionId(design.collection_id)
        setProductId(null)
      }
    }
  }, [design])

  // Merge current collection with available collections
  const allCollections = React.useMemo(() => {
    if (!design) return collections || []
    
    // Start with available collections
    const result = [...(collections || [])]
    
    // If current collection is not in the available collections, add it
    const currentCollection = design.collection
    if (currentCollection && !result.some(c => c.id === currentCollection.id)) {
      result.push(currentCollection)
    }
    
    return result
  }, [collections, design])

  // Merge current product with available products
  const allProducts = React.useMemo(() => {
    if (!design) return products || []
    
    // Start with available products
    const result = [...(products || [])]
    
    // If current product is not in the available products, add it
    const currentProduct = design.product
    if (currentProduct && !result.some(p => p.id === currentProduct.id)) {
      result.push(currentProduct)
    }
    
    return result
  }, [products, design])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !designTypeId) return

    // Either collectionId or productId must be set based on targetType
    if ((targetType === "collection" && !collectionId) || 
        (targetType === "product" && !productId)) {
      return
    }
    
    try {
      const updateData = {
        name: name.trim(),
        design_type_id: designTypeId,
        // Set either collection_id or product_id based on targetType
        collection_id: targetType === "collection" ? collectionId : null,
        product_id: targetType === "product" ? productId : null,
        // Preserve existing data
        img_url: design?.img_url,
        guide_url: design?.guide_url,
        meta_data: design?.meta_data,
      }

      await onUpdate(updateData)
    } catch (error) {
      console.error("Error updating design:", error)
    }
  }

  const formatImageUrl = (url: string): string => {
    if (!url) return ""
    try {
      const decodedUrl = decodeURI(url)
      return encodeURI(decodedUrl)
    } catch {
      return url
    }
  }

  return (
    <ModalAnimation isOpen={isOpen} onClose={onClose}>
      <div className="bg-ui-bg-base rounded-lg shadow-lg mx-4">
        <div className="p-4 border-b border-ui-border-base">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-ui-bg-interactive p-2 rounded-full">
                <PenSquare className="text-ui-fg-on-interactive" size={22} />
              </div>
              <h2 className="text-lg font-semibold text-ui-fg-base">
                Edit Design
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-ui-fg-subtle hover:text-ui-fg-base"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-ui-fg-subtle mb-2">
                Name <span className="text-ui-fg-error">*</span>
              </label>
              <Input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter design name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ui-fg-subtle mb-2">
                Design Type <span className="text-ui-fg-error">*</span>
              </label>
              <Select
                value={designTypeId || ""}
                onValueChange={(value) => setDesignTypeId(value || null)}
                >
                <Select.Trigger className="w-full">
                    <Select.Value placeholder="Select a design type" />
                </Select.Trigger>
                <Select.Content className="z-[100]">
                    {designTypes?.map((type) => (
                    <Select.Item key={type.id} value={type.id}>
                        {type.name}
                    </Select.Item>
                    ))}
                </Select.Content>
                </Select>
            </div>

          {/* Target Type Tabs */}
            <div className="space-y-2">
              <label className="text-ui-fg-subtle font-medium text-sm">
                Target Type *
              </label>
              <Tabs 
                value={targetType} 
                onValueChange={(value) => {
                  setTargetType(value)
                  if (value === "collection") {
                    setProductId(null)
                  } else {
                    setCollectionId(null)
                  }
                }}
              >
                <Tabs.List>
                  <Tabs.Trigger value="collection">Collection</Tabs.Trigger>
                  <Tabs.Trigger value="product">Product</Tabs.Trigger>
                </Tabs.List>
                
                <div className="mt-3">
                  <Tabs.Content value="collection">
                    <Select
                      value={collectionId || ""}
                      onValueChange={(value) => setCollectionId(value || null)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select collection" />
                      </Select.Trigger>
                      <Select.Content className="z-50">
                        {allCollections?.map((collection) => (
                          <Select.Item key={collection.id} value={collection.id}>
                            {collection.title}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Tabs.Content>
                  
                  <Tabs.Content value="product">
                    <Select
                      value={productId || ""}
                      onValueChange={(value) => setProductId(value || null)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select product" />
                      </Select.Trigger>
                      <Select.Content className="z-50">
                        {allProducts?.map((product) => {
                          return (
                            <Select.Item key={product.id} value={product.id}>
                              {product.title}
                            </Select.Item>
                          )
                        })}
                      </Select.Content>
                    </Select>
                  </Tabs.Content>
                </div>
              </Tabs>
            </div>

            {/* Preview Images */}
            {design && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-ui-fg-subtle">
                  Preview Images
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-ui-fg-subtle mb-2">
                      Design Image
                    </label>
                    <div className="aspect-square rounded-lg border flex items-center justify-center bg-ui-bg-subtle">
                      <img
                        src={formatImageUrl(design?.meta_data?.previewImage)}
                        alt="Design"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-ui-fg-subtle mb-2">
                      Guide Image
                    </label>
                    <div className="aspect-square rounded-lg border flex items-center justify-center bg-ui-bg-subtle">
                      <img
                        src={formatImageUrl(design?.guide_url)}
                        alt="Guide"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-4 bg-ui-bg-subtle border-t border-ui-border-base rounded-b-lg flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || !name.trim() || !designTypeId || 
                (targetType === "collection" && !collectionId) || 
                (targetType === "product" && !productId)}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </ModalAnimation>
  )
}

const DesignTab = ({ setActiveTab }: any) => {
  const queryClient = useQueryClient()
  
  // State for search and pagination
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10
  
  // State for edit/delete modals
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentDesign, setCurrentDesign] = useState<Design | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deletingName, setDeletingName] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      // Reset to first page when searching
      setCurrentPage(0)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Query designs with pagination and search
  const { data, isLoading }: any = useQuery({
    queryKey: ["designs", currentPage, pageSize, debouncedSearch],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch(`/admin/designer/designs?page=${currentPage + 1}&limit=${pageSize}&q=${debouncedSearch}`, {}) as any
        return {
          designs: response.designs || [],
          count: response.count || 0,
          limit: response.limit || pageSize,
          offset: response.offset || 0
        }
      } catch (error) {
        console.error("Error fetching designs:", error)
        return { designs: [], count: 0, limit: pageSize, offset: 0 }
      }
    }
  })

  // Query design types
  const { data: designTypesData } = useQuery({
    queryKey: ["design-types"],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/designer/design-types", {}) as any
        return response
      } catch (error) {
        console.error("Error fetching design types:", error)
        return { types: [] }
      }
    }
  })

  // Query collections
  const { data: collectionsData } = useQuery({
    queryKey: ["available-collections", currentDesign?.id],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/designer/available-collections", {}) as any
        return response
      } catch (error) {
        console.error("Error fetching collections:", error)
        return { collections: [] }
      }
    }
  })

  // Query products
  const { data: productsData } = useQuery({
    queryKey: ["available-products", currentDesign?.id],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/designer/available-products", {}) as any
        return response
      } catch (error) {
        console.error("Error fetching products:", error)
        return { products: [] }
      }
    }
  })

  // Update design mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await sdk.client.fetch(`/admin/designer/designs/${id}`, {
        method: "PUT",
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] })
      queryClient.invalidateQueries({ queryKey: ["available-collections"] })
      queryClient.invalidateQueries({ queryKey: ["available-products"] })
      setShowEditModal(false)
      setCurrentDesign(null)
      toast.success("Design updated successfully", {
        position: "top-right"
      })
    },
    onError: (error: any) => {
      console.error("Error updating design:", error)
      toast.error(error.message || "Error updating design", {
        position: "top-right"
      })
    }
  })

  // Delete design mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await sdk.client.fetch(`/admin/designer/designs/${id}`, {
        method: "DELETE"
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs"] })
      queryClient.invalidateQueries({ queryKey: ["available-collections"] })
      queryClient.invalidateQueries({ queryKey: ["available-products"] })
      setShowDeleteModal(false)
      setDeletingId(null)
      setDeletingName("")
      toast.success("Design deleted successfully", {
        position: "top-right"
      })
    },
    onError: (error: any) => {
      console.error("Error deleting design:", error)
      toast.error(error.message || "Error deleting design", {
        position: "top-right"
      })
      setShowDeleteModal(false)
      setDeletingId(null)
      setDeletingName("")
    }
  })

  // Handle update form submission
  const handleUpdateDesign = async (updateData: any) => {
    if (!currentDesign) return
    
    updateMutation.mutate({
      id: currentDesign.id,
      data: updateData
    })
  }

  // Handle delete confirmation
  const handleDelete = () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId)
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return `${format(date, 'd MMM, yyyy')}`
  }

  // Helper to determine target type and display value
  const getTargetInfo = (design: Design) => {
    if (design.product_id) {
      return {
        type: "Product",
        value: design.product?.title || design.product_id
      }
    } else {
      return {
        type: "Collection", 
        value: design.collection?.title || design.collection_id
      }
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil((data?.count || 0) / pageSize)

  // Loading state UI
  const LoadingState = () => (
    <div className="w-full py-12 flex justify-center items-center">
      <div className="text-center">
        <div className="animate-pulse mb-2">
          <div className="h-8 w-8 mx-auto bg-ui-bg-base rounded-full"></div>
        </div>
        <Text className="text-ui-fg-subtle">Loading designs...</Text>
      </div>
    </div>
  )

  // Empty state UI
  const EmptyState = () => (
    <div className="w-full py-12 flex justify-center items-center">
      <div className="text-center">
        <div className="bg-ui-bg-subtle p-3 rounded-full inline-flex mb-3">
          <AlertCircle className="text-ui-fg-subtle" size={24} />
        </div>
        <Text className="text-ui-fg-subtle block">No designs found</Text>
      </div>
    </div>
  )

  return (
    <Container className="p-0">
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row py-4 px-6 sm:justify-between sm:items-center">
          <Heading level="h2">Designs</Heading>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search designs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-64 pl-10"
                autoComplete="off"
              />
            </div>
            <Button 
              variant="primary" 
              size="base"
              onClick={() => {
                // Redirect to the designer page for creating a new design
                setActiveTab('designer')
            }}
            >
              <Plus size={16} /> Create Design
            </Button>
          </div>
        </div>
        
        {/* Conditionally render table or loading/empty states */}
        {isLoading ? (
          <LoadingState />
        ) : !data?.designs?.length ? (
          <EmptyState />
        ) : (
          <>
            {/* Render table */}
            <div className="overflow-x-auto">
              <Table className="border border-ui-border-base rounded-lg w-full">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Target Type</Table.HeaderCell>
                    <Table.HeaderCell>Target</Table.HeaderCell>
                    <Table.HeaderCell className="hidden md:table-cell">Created</Table.HeaderCell>
                    <Table.HeaderCell className="hidden md:table-cell">Updated</Table.HeaderCell>
                    <Table.HeaderCell className="text-right">Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body className="divide-y divide-ui-border-base">
                  {data.designs.map((design: Design) => {
                    const targetInfo = getTargetInfo(design);
                    return (
                      <Table.Row key={design.id} className="hover:bg-ui-bg-base-hover transition-colors">
                        <Table.Cell>{design.name}</Table.Cell>
                        <Table.Cell className="text-ui-fg-subtle">{design.design_type?.name}</Table.Cell>
                        <Table.Cell className="text-ui-fg-subtle">{targetInfo.type}</Table.Cell>
                        <Table.Cell className="text-ui-fg-subtle">{targetInfo.value}</Table.Cell>
                        <Table.Cell className="text-ui-fg-subtle hidden md:table-cell">{formatDate(design.created_at)}</Table.Cell>
                        <Table.Cell className="text-ui-fg-subtle hidden md:table-cell">{formatDate(design.updated_at)}</Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-1.5 rounded-md text-ui-fg-subtle hover:bg-ui-bg-base-hover hover:text-ui-fg-base transition-colors"
                              onClick={() => {
                                setCurrentDesign(design)
                                setShowEditModal(true)
                              }}
                              title="Edit"
                            >
                              <PenSquare size={18} />
                            </button>
                            <button
                              className="p-1.5 rounded-md text-ui-fg-subtle hover:bg-ui-bg-danger hover:text-ui-fg-base transition-colors"
                              onClick={() => {
                                setDeletingId(design.id)
                                setDeletingName(design.name)
                                setShowDeleteModal(true)
                              }}
                              title="Delete"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </div>

            {/* Pagination */}
            {data?.count > 10 && (
              <div className="flex items-center justify-between py-4 px-6">
                <Text className="text-ui-fg-subtle">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, data.count)} of {data.count} entries
                </Text>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    size="small"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Edit Modal */}
        <EditDesignModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setCurrentDesign(null)
          }}
          design={currentDesign}
          designTypes={designTypesData?.types || []}
          collections={collectionsData?.collections || []}
          products={productsData?.products || []}
          onUpdate={handleUpdateDesign}
          isSubmitting={updateMutation.isPending}
        />
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setDeletingId(null)
            setDeletingName("")
          }}
          onConfirm={handleDelete}
          name={deletingName}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </Container>
  )
}

export default DesignTab