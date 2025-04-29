// src/admin/components/designer/DesignTypeTab.tsx
import React, { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { 
  Button, 
  Container, 
  Table,
  Heading, 
  Input,
  Text,
  toast
} from "@medusajs/ui"
import { sdk } from "../../lib/sdk"
import { Plus, Trash, PenSquare, AlertCircle } from "lucide-react"
import { format } from 'date-fns'

type DesignType = {
  id: string
  name: string
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
              <AlertCircle className="text-ui-fg-dangerous" size={22} />
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

// Form Modal Component
const FormModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  title: string
  name: string
  setName: (name: string) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
}> = ({ 
  isOpen, 
  onClose, 
  title, 
  name, 
  setName, 
  onSubmit, 
  isSubmitting 
}) => {
  return (
    <ModalAnimation isOpen={isOpen} onClose={onClose}>
      <div className="bg-ui-bg-base rounded-lg shadow-lg mx-4">
        <div className="p-4 border-b border-ui-border-base">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-ui-bg-interactive p-2 rounded-full">
                {title.includes("Edit") ? (
                  <PenSquare className="text-white" size={22} />
                ) : (
                  <Plus className="text-white" size={22} />
                )}
              </div>
              <h2 className="text-lg font-semibold text-ui-fg-base">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="px-2 text-ui-fg-subtle hover:text-ui-fg-base rounded-lg hover:bg-ui-bg-base-hover transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-ui-fg-subtle mb-2">
                Name <span className="text-ui-fg-dangerous">*</span>
              </label>
              <Input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter design type name"
                className="w-full"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-ui-bg-subtle border-t border-ui-border-base rounded-b-lg flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              type="button"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting 
                ? (title.includes("Edit") ? "Saving..." : "Creating...") 
                : (title.includes("Edit") ? "Save" : "Create")}
            </Button>
          </div>
        </form>
      </div>
    </ModalAnimation>
  )
}

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return `${format(date, 'd MMM, yyyy')}`
}

const DesignTypeTab: React.FC = () => {
  const queryClient = useQueryClient()
  
  // State for search and pagination
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10
  
  // State for add/edit forms
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [currentDesignType, setCurrentDesignType] = useState<DesignType | null>(null)
  
  // Form values
  const [formName, setFormName] = useState("")
  
  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
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

  // Reset form values
  const resetForm = () => {
    setFormName("")
  }

  // Query design types
  const { data, isLoading } = useQuery({
    queryKey: ["design-types", currentPage, pageSize, debouncedSearch],
    queryFn: async () => {
      try {
        const response = await sdk.client.fetch("/admin/designer/design-types", {}) as { types: DesignType[] }
        
        // Filter by search term if present (client-side filtering for simplicity)
        let filteredTypes = response.types
        if (debouncedSearch) {
          const searchLower = debouncedSearch.toLowerCase()
          filteredTypes = filteredTypes.filter(type => 
            type.name.toLowerCase().includes(searchLower)
          )
        }
        
        // Calculate pagination
        const startIndex = currentPage * pageSize
        const endIndex = startIndex + pageSize
        const paginatedTypes = filteredTypes.slice(startIndex, endIndex)
        
        return {
          types: paginatedTypes,
          count: filteredTypes.length
        }
      } catch (error) {
        console.error("Error fetching design types:", error)
        return { types: [], count: 0 }
      }
    }
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      return await sdk.client.fetch("/admin/designer/design-types", {
        method: "POST",
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-types"] })
      setShowAddForm(false)
      resetForm()
      toast.success("Design type created successfully", {
        position: 'top-right'
      })
    },
    onError: (error) => {
      console.error("Error creating design type:", error)
      toast.error(error.message || "Error creating design type", {
        position: 'top-right'
      })
    }
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      return await sdk.client.fetch(`/admin/designer/design-types/${id}`, {
        method: "PUT",
        body: data
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-types"] })
      setShowEditForm(false)
      setCurrentDesignType(null)
      resetForm()
      toast.success("Design type updated successfully", {
        position: 'top-right'
      })
    },
    onError: (error) => {
      console.error("Error updating design type:", error)
      toast.error(error.message || "Error updating design type", {
        position: 'top-right'
      })
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await sdk.client.fetch(`/admin/designer/design-types/${id}`, {
        method: "DELETE"
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["design-types"] })
      setShowDeleteConfirm(false)
      setDeleteId(null)
      toast.success("Design type deleted successfully", {
        position: "top-right"
      })
    },
    onError: (error) => {
      console.error("Error deleting design type:", error)
      toast.error(error.message || "Error deleting design type", {
        position: 'top-right'
      })
    }
  })

  // Handle create form submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName) return
    
    createMutation.mutate({ name: formName })
  }

  // Handle edit form submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName || !currentDesignType) return
    
    updateMutation.mutate({
      id: currentDesignType.id,
      data: { name: formName }
    })
  }

  // Handle delete confirmation
  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId)
    }
  }

  // Handle edit button click
  const handleEditClick = (designType: DesignType) => {
    setCurrentDesignType(designType)
    setFormName(designType.name)
    setShowEditForm(true)
    setShowAddForm(false)
  }

  // Handle delete button click
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteId(id)
    setDeletingName(name)
    setShowDeleteConfirm(true)
  }

  // Calculate total pages
  const totalPages = Math.ceil((data?.count || 0) / pageSize)

  // Render table
  const renderTable = () => {
    if (isLoading) {
      return <div className="text-center p-4 text-ui-fg-subtle">Loading...</div>
    }

    if (!data?.types.length) {
      return <div className="text-center p-8 text-ui-fg-subtle">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <div className="bg-ui-bg-subtle p-3 rounded-full">
            <AlertCircle className="text-ui-fg-subtle" size={24} />
          </div>
          <Text className="text-ui-fg-subtle">No design types found</Text>
        </div>
      </div>
    }

    return (
      <div className="overflow-x-auto">
        <Table className="border border-ui-border-base rounded-lg w-full">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="w-1/4">Name</Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 hidden md:table-cell">ID</Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 hidden md:table-cell">Created</Table.HeaderCell>
              <Table.HeaderCell className="w-1/4 hidden md:table-cell">Updated</Table.HeaderCell>
              <Table.HeaderCell className="text-right w-24">Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="divide-y divide-ui-border-base">
            {data.types.map((designType: DesignType) => (
              <Table.Row key={designType.id} className="hover:bg-ui-bg-base-hover transition-colors">
                <Table.Cell>{designType.name}</Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <div className="truncate text-ui-fg-subtle w-full" title={designType.id}>{designType.id}</div>
                </Table.Cell>
                <Table.Cell className="text-ui-fg-subtle hidden md:table-cell">{formatDate(designType.created_at)}</Table.Cell>
                <Table.Cell className="text-ui-fg-subtle hidden md:table-cell">{formatDate(designType.updated_at)}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-1.5 rounded-md text-ui-fg-subtle hover:bg-ui-bg-base-hover hover:text-ui-fg-base transition-colors"
                      onClick={() => handleEditClick(designType)}
                      title="Edit"
                    >
                      <PenSquare size={18} />
                    </button>
                    <button
                      className="p-1.5 rounded-md text-ui-fg-subtle hover:bg-ui-bg-danger hover:text-ui-fg-base transition-colors"
                      onClick={() => handleDeleteClick(designType.id, designType.name)}
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    )
  }

  // Render pagination
  const renderPagination = () => {
    if (!data?.count || data.count <= pageSize) return null

    return (
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
    )
  }

  return (
    <Container className="p-0">
      <div className="flex flex-col">
        <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row py-4 px-6 sm:justify-between sm:items-center">
          <Heading level="h2">Design Types</Heading>
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-64"
              autoComplete="off"
            />
            <Button 
              variant="primary" 
              size="base"
              onClick={() => {
                setShowAddForm(true)
                setShowEditForm(false)
                resetForm()
              }}
            >
              <Plus size={16} /> Create
            </Button>
          </div>
        </div>
        
        {renderTable()}
        {renderPagination()}
        
        {/* Add Form Modal */}
        <FormModal
          isOpen={showAddForm}
          onClose={() => {
            setShowAddForm(false)
            resetForm()
          }}
          title="Create Design Type"
          name={formName}
          setName={setFormName}
          onSubmit={handleCreateSubmit}
          isSubmitting={createMutation.isPending}
        />
        
        {/* Edit Form Modal */}
        <FormModal
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false)
            setCurrentDesignType(null)
            resetForm()
          }}
          title="Edit Design Type"
          name={formName}
          setName={setFormName}
          onSubmit={handleEditSubmit}
          isSubmitting={updateMutation.isPending}
        />
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false)
            setDeleteId(null)
          }}
          onConfirm={handleDelete}
          name={deletingName}
          isDeleting={deleteMutation.isPending}
        />
      </div>
    </Container>
  )
}

export default DesignTypeTab