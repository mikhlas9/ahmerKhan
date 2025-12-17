"use client"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { useState, useEffect, useRef } from "react"
import { getHomepageData, saveHomepageData } from "@/lib/homepage"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"
import Toast from "@/components/Toast"

function HomepageAdmin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    mediaType: "image", // "image" or "video"
    mediaUrl: ""
  })

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHomepageData()
        if (data) {
          setFormData({
            mediaType: data.mediaType || "image",
            mediaUrl: data.mediaUrl || "/images/home.jpeg"
          })
        } else {
          // Initialize with default
          setFormData({
            mediaType: "image",
            mediaUrl: "/images/home.jpeg"
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (uploading) return
    
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const result = await saveHomepageData({
        mediaType: formData.mediaType,
        mediaUrl: formData.mediaUrl
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
          <p className="text-gray-600 mt-2">Upload an image or video to display on the homepage</p>
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
          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
            <input
                  type="radio"
                  value="image"
                  checked={formData.mediaType === "image"}
                  onChange={(e) => handleInputChange("mediaType", e.target.value)}
                  className="mr-2"
            />
                <span>Image</span>
            </label>
              <label className="flex items-center">
            <input
                  type="radio"
                  value="video"
                  checked={formData.mediaType === "video"}
                  onChange={(e) => handleInputChange("mediaType", e.target.value)}
                  className="mr-2"
            />
                <span>Video</span>
            </label>
                </div>
            <p className="text-xs text-gray-500 mt-1">
              Select whether to display an image or video on the homepage. Videos will autoplay when the page loads.
            </p>
          </div>

          {/* Media Upload */}
          {formData.mediaType === "image" ? (
            <div>
              <ImageUpload
                value={formData.mediaUrl}
                onChange={(url) => handleInputChange("mediaUrl", url)}
                folder="homepage"
                label="Homepage Image"
                placeholder="/images/home.jpeg"
                onUploadingChange={setUploading}
              />
            </div>
          ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
            </label>
            <input
              type="text"
                value={formData.mediaUrl}
                onChange={(e) => handleInputChange("mediaUrl", e.target.value)}
                placeholder="https://example.com/video.mp4 or /videos/video.mp4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the URL or path to the video file. The video will autoplay, loop, and be muted when the page loads.
              </p>
              {formData.mediaUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                  <div className="relative w-full max-w-2xl aspect-video border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <video
                      src={formData.mediaUrl}
                      controls
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
          </div>
              )}
          </div>
          )}

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

