"use client"
import React, { useState, useEffect } from "react"
import { Dialog } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import toast from "react-hot-toast"
import FrontendDesigner from "./FrontendDesigner"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface DesignerUploadProps {
  designDetails: any
  setUploadedFiles: React.Dispatch<React.SetStateAction<any[]>>
}

const DesignerUpload = ({
  designDetails,
  setUploadedFiles,
}: DesignerUploadProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showExitConfirmation, setShowExitConfirmation] = useState(false)

  // Handler for popstate (back button)
  const handlePopState = () => {
    // This prevents the actual navigation
    window.history.pushState(null, "", window.location.pathname)

    setShowExitConfirmation(true)
  }

  useEffect(() => {
    if (!isModalOpen) return

    // Save current history state to restore later
    const currentState = window.history.state

    // Push a new state to the history stack
    window.history.pushState(null, "", window.location.pathname)

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)

      // Optionally restore original history state when component unmounts
      if (currentState) {
        window.history.replaceState(currentState, "", window.location.pathname)
      }
    }
  }, [isModalOpen])

  // Modified save handler that works with the existing upload state
  const handleDesignSave = async (dataUrl: string) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      // Convert dataUrl to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()

      // Create FormData
      const formData = new FormData()
      const file = new File([blob], "custom-design.png", { type: "image/png" })
      formData.append("file", file)

      // Upload to your backend
      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/upload`,
        {
          method: "POST",
          headers: {
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
          },
          body: formData,
        }
      )

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload design")
      }

      const data = await uploadResponse.json()
      const uploadedFile = data.files[0]

      // Add to uploadedFiles state using the same structure as FileUpload
      const newFile = {
        url: uploadedFile.url,
        name: "Custom Design",
        type: "image/png",
        size: blob.size,
        uploadedAt: new Date().toISOString(),
        file_key: uploadedFile.id,
      }

      setUploadedFiles((prev) => [...prev, newFile])
      toast.success("Design saved successfully")
      setIsModalOpen(false)
    } catch (error) {
      console.error("Error saving design:", error)
      toast.error("Failed to save design")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsModalOpen(true)
          }}
          className="flex flex-col items-center justify-center w-full h-36 
            border border-ui-border-base border-dashed
            cursor-pointer bg-ui-bg-subtle hover:bg-ui-bg-base-hover transition-colors p-5"
        >
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-8 h-8 mb-2 text-ui-fg-subtle"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <p className="text-lg text-ui-fg-subtle text-center">
              <span className="font-medium">Create Custom Design</span>
            </p>
            <p className="text-base text-ui-fg-muted mt-1">
              Use our design tool to create custom artwork
            </p>
          </div>
        </button>
      </div>

      {/* Full-screen Modal for Designer */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full h-full bg-white">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="ml-4 flex lg:ml-0">
                  <span className="sr-only">Your Company</span>
                  {/* Replace the Image component with inline SVG */}
                  <LocalizedClientLink href={'/'}>
                  <h1 className="text-[1.7rem] text-secondary tracking-wide font-normal" style={{WebkitTextStroke: '1.5px'}}>
                    Brandify
                  </h1>
                </LocalizedClientLink>
           
              </div>
                <button
                  onClick={() => setShowExitConfirmation(true)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {isModalOpen && (
                <FrontendDesigner
                  onSave={handleDesignSave}
                  exportedMetadata={designDetails?.meta_data}
                  // cancel confirmation model
                  isVisible={showExitConfirmation}
                  onClose={() => setShowExitConfirmation(false)}
                  onConfirm={() => {
                    setShowExitConfirmation(false)
                    setIsModalOpen(false)
                    // Allow the back navigation to proceed
                    window.removeEventListener("popstate", handlePopState)
                    window.history.back()
                  }}
                />
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default DesignerUpload
