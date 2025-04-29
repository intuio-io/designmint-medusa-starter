"use client"

import React, { useRef } from "react"
import toast from "react-hot-toast"

// Constants
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

// Types
interface FileInfo {
  url: string
  name: string
  type: string
  uploadedAt: string
  size: number
  file_key: string
}

interface FileUploadProps {
  setUploadedFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>
  uploading: boolean
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUpload = ({ setUploadedFiles, uploading, setUploading }: FileUploadProps) => {
  // State
  const fileInputRef = useRef<HTMLInputElement>(null)

  // File validation
  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`${file.name} must be a PDF, JPEG, or PNG file.`)
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${file.name} exceeds 10MB limit.`)
      return false
    }

    return true
  }

  // Upload handling
  const uploadFile = async (file: File): Promise<FileInfo> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/upload`, {
      method: "POST",
      headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp" },
      body: formData,
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Upload failed")
    }

    const data = await response.json()
    const uploadedFile = data.files[0]

    return {
      url: uploadedFile.url,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      file_key: uploadedFile.id,
    }
  }

  // Event handlers
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault()
    const files = Array.from(event.target.files || [])

    if (files.length === 0) return

    setUploading(true)
    const validFiles = files.filter(validateFile)

    try {
      const uploadPromises = validFiles.map(uploadFile)
      const newUploadedFiles = await Promise.all(uploadPromises)

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
      toast.success("Files uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload some files")
    } finally {
      setUploading(false)
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)

    if (files.length === 0) return

    setUploading(true)
    const validFiles = files.filter(validateFile)

    try {
      const uploadPromises = validFiles.map(uploadFile)
      const newUploadedFiles = await Promise.all(uploadPromises)

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
      toast.success("Files uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload some files")
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      {/* Upload Area */}
      <div>
        <div
          className="flex items-center justify-center w-full"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label
            className={`
            flex flex-col items-center justify-center w-full h-36
            border border-ui-border-base border-dashed
            cursor-pointer bg-ui-bg-subtle hover:bg-ui-bg-base-hover transition-colors
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          >
            <div className="flex flex-col items-center justify-center p-5">
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <svg 
                    className="animate-spin h-5 w-5 text-ui-fg-subtle" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-sm text-ui-fg-subtle">Uploading...</span>
                </div>
              ) : (
                <>
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg text-ui-fg-subtle text-center">
                    <span className="font-medium">Click to upload</span> or drag files
                  </p>
                  <p className="text-base text-ui-fg-muted mt-1">
                    PDF, JPEG, PNG (Max. 10MB)
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>
    </>
  )
}

export const FileList = ({
  uploadedFiles,
  setUploadedFiles,
}: any) => {
  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const truncateFileName = (name: string, maxLength: number = 20): string => {
    if (name.length <= maxLength) return name
    const extension = name.split(".").pop()
    const nameWithoutExt = name.slice(0, -(extension?.length ?? 0) - 1)
    return `${nameWithoutExt.slice(0, maxLength - 3)}...${extension}`
  }

  const handleRemoveFile = async (fileInfo: FileInfo) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/upload/${fileInfo.file_key}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp" 
        },
      })


      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      setUploadedFiles((prev: any) =>
        prev.filter((f: any) => f.file_key !== fileInfo.file_key)
      )
      toast.success("File removed")
    } catch (error) {
      toast.error("Failed to remove file")
    }
  }

  return (
    <>
      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
            {uploadedFiles.map((file: any, index: any) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-16 h-16 object-contain rounded-sm"
                    />
                  ) : (
                    <span className="text-lg">📄</span>
                  )}
                  <div>
                    <p
                      className="text-lg font-medium text-gray-900"
                      title={file.name}
                    >
                      {truncateFileName(file.name)}
                    </p>
                    <p className="text-base text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleRemoveFile(file)
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default FileUpload
