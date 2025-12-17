"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { uploadImage, deleteImage, isFirebaseStorageUrl } from "@/lib/storage"

/**
 * ImageUpload Component
 * Handles image upload to Firebase Storage with preview and delete functionality
 * 
 * @param {string} value - Current image URL or path
 * @param {function} onChange - Callback when image changes (receives new URL or empty string)
 * @param {string} folder - Firebase Storage folder (e.g., 'homepage', 'projects', 'portraits')
 * @param {string} label - Label for the upload field
 * @param {string} placeholder - Placeholder text for the input
 * @param {string} id - Optional unique ID for the file input (auto-generated if not provided)
 */
export default function ImageUpload({ 
  value = "", 
  onChange, 
  folder = "images", 
  label = "Image",
  placeholder = "/images/image.png",
  id = null,
  onUploadingChange = null
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || "")
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)
  const uniqueId = id || `image-upload-${folder}-${Math.random().toString(36).substr(2, 9)}`

  // Update preview when value changes externally
  useEffect(() => {
    setPreview(value || "")
  }, [value])

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB')
      return
    }

    setError("")
    setUploading(true)
    if (onUploadingChange) onUploadingChange(true)

    try {
      // Show local preview immediately
      const localPreview = URL.createObjectURL(file)
      setPreview(localPreview)

      // Upload to Firebase Storage
      const result = await uploadImage(file, folder)
      
      if (result.success) {
        // Update with Firebase Storage URL
        setPreview(result.url)
        onChange(result.url)
      } else {
        setError(result.error || 'Failed to upload image')
        // Revert preview to original value
        setPreview(value || "")
        URL.revokeObjectURL(localPreview)
      }
    } catch (err) {
      setError(err.message || 'An error occurred while uploading')
      setPreview(value || "")
    } finally {
      setUploading(false)
      if (onUploadingChange) onUploadingChange(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async () => {
    if (!value) return

    if (!confirm("Are you sure you want to delete this image?")) return

    setError("")
    
    // If it's a Firebase Storage URL, delete from storage
    if (isFirebaseStorageUrl(value)) {
      const result = await deleteImage(value)
      if (!result.success) {
        setError(result.error || 'Failed to delete image from storage')
        return
      }
    }

    // Clear the image (empty string means no image)
    setPreview("")
    onChange("")
  }

  // Determine image source for preview
  const getImageSrc = () => {
    if (!preview) return null
    
    // If it's a Firebase Storage URL or full URL, use as-is
    if (preview.startsWith('http://') || preview.startsWith('https://')) {
      return preview
    }
    
    // If it's a public folder path, use as-is (Next.js will handle it)
    return preview
  }

  const imageSrc = getImageSrc()

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Current Image Preview */}
      {imageSrc && (
        <div className="relative w-full max-w-md border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <div className="relative aspect-video w-full">
            <Image
              src={imageSrc}
              alt="Preview"
              fill
              className="object-contain"
              unoptimized={preview.startsWith('blob:') || isFirebaseStorageUrl(preview)}
            />
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={uploading}
            className="absolute top-2 right-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}

      {/* Upload Controls */}
      <div className="flex gap-3 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={uniqueId}
        />
        <label
          htmlFor={uniqueId}
          className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
            uploading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {uploading ? "Uploading..." : imageSrc ? "Replace Image" : "Choose Image"}
        </label>
        
        {/* Manual path input (for public folder paths) */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setPreview(e.target.value)
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        {imageSrc 
          ? "Click 'Replace Image' to upload a new image, or 'Delete' to remove. You can also manually enter a path."
          : "Click 'Choose Image' to upload from your device, or manually enter a path (e.g., /images/image.png)."
        }
      </p>
    </div>
  )
}

