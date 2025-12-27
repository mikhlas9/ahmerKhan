"use client"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { useState, useEffect, useRef } from "react"
import { getHomepageData, saveHomepageData } from "@/lib/homepage"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"
import VideoUpload from "@/components/VideoUpload"
import Toast from "@/components/Toast"

function HomepageAdmin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    desktopVideoUrl: "",
    mobileImages: ["/images/home.jpeg"]
  })

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHomepageData()
        if (data) {
          // Support both old and new data structure for backward compatibility
          if (data.desktopVideoUrl !== undefined || data.mobileImages !== undefined) {
          setFormData({
              desktopVideoUrl: data.desktopVideoUrl || "",
              mobileImages: data.mobileImages && data.mobileImages.length > 0 
                ? data.mobileImages 
                : ["/images/home.jpeg"]
            })
          } else {
            // Migrate old structure to new structure
            const desktopVideoUrl = data.mediaType === 'video' ? (data.mediaUrl || "") : ""
            const mobileImages = data.mediaType === 'image' 
              ? [data.mediaUrl || "/images/home.jpeg"] 
              : ["/images/home.jpeg"]
            setFormData({
              desktopVideoUrl,
              mobileImages
          })
          }
        } else {
          // Initialize with default
          setFormData({
            desktopVideoUrl: "",
            mobileImages: ["/images/home.jpeg"]
          })
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setMessage({ type: "error", text: "Failed to load homepage data" })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMobileImageChange = (index, url) => {
    setFormData(prev => {
      const newImages = [...prev.mobileImages]
      newImages[index] = url
      return {
        ...prev,
        mobileImages: newImages
      }
    })
  }

  const addMobileImage = () => {
    if (formData.mobileImages.length < 4) {
      setFormData(prev => ({
        ...prev,
        mobileImages: [...prev.mobileImages, ""]
      }))
    }
  }

  const removeMobileImage = (index) => {
    if (formData.mobileImages.length > 1) {
      setFormData(prev => ({
        ...prev,
        mobileImages: prev.mobileImages.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (uploading) return
    
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const result = await saveHomepageData({
        desktopVideoUrl: formData.desktopVideoUrl,
        mobileImages: formData.mobileImages.filter(img => img && img.trim() !== "")
      })

      if (result.success) {
        setMessage({ type: "success", text: "Updated" })
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "An error occurred" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Homepage</h1>
          <p className="text-gray-600 mt-2">Upload a video for desktop and 3-4 images for mobile</p>
        </div>

        {/* Toast Notification */}
        <Toast 
          message={message.type === "success" ? message.text : null} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })}
        />
        
        {/* Error Message */}
        {message.type === "error" && message.text && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
            {message.text}
          </div>
        )}

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Desktop Video Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Desktop Video (Laptop/Desktop)</h2>
            <VideoUpload
              value={formData.desktopVideoUrl}
              onChange={(url) => handleInputChange("desktopVideoUrl", url)}
              folder="homepage"
              label="Desktop Video"
              placeholder="/videos/homepage-video.mp4"
              onUploadingChange={setUploading}
            />
            <p className="text-xs text-gray-500 mt-2">
              This video will be displayed on laptop and desktop screens. The video will autoplay, loop, and be muted.
            </p>
          </div>

          {/* Mobile Images Upload */}
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mobile Images (3-4 images)</h2>
              {formData.mobileImages.length < 4 && (
                <button
                  type="button"
                  onClick={addMobileImage}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  + Add Image
                </button>
              )}
            </div>
            <div className="space-y-4">
              {formData.mobileImages.map((imageUrl, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile Image {index + 1}
                    </label>
                    {formData.mobileImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMobileImage(index)}
                        className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
              <ImageUpload
                    value={imageUrl}
                    onChange={(url) => handleMobileImageChange(index, url)}
                folder="homepage"
                    label=""
                    placeholder="/images/home-mobile.jpg"
                    id={`mobile-image-${index}`}
                onUploadingChange={setUploading}
              />
            </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload 3-4 images that will be displayed in a grid on mobile devices. These images will be shown in a 2x2 grid layout.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={uploading || saving}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              disabled={uploading || saving}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function HomepageAdminPage() {
  return (
    <AdminAuthWrapper>
      <HomepageAdmin />
    </AdminAuthWrapper>
  )
}

