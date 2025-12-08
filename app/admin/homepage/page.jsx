"use client"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { useState, useEffect } from "react"
import { getHomepageData, saveHomepageData, initializeHomepage } from "@/lib/homepage"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"
import Toast from "@/components/Toast"

function HomepageAdmin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: [""], // Array of paragraphs
    credentials: "",
    portraitImage: ""
  })

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getHomepageData()
        if (data) {
          setFormData({
            name: data.name || "",
            title: data.title || "",
            bio: Array.isArray(data.bio) ? data.bio : [data.bio || ""],
            credentials: data.credentials || "",
            portraitImage: data.portraitImage || ""
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

  const handleBioChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      bio: prev.bio.map((para, i) => i === index ? value : para)
    }))
  }

  const addBioParagraph = () => {
    setFormData(prev => ({
      ...prev,
      bio: [...prev.bio, ""]
    }))
  }

  const removeBioParagraph = (index) => {
    if (formData.bio.length > 1) {
      setFormData(prev => ({
        ...prev,
        bio: prev.bio.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // Filter out empty bio paragraphs
      const bioToSave = formData.bio.filter(para => para.trim() !== "")
      
      const result = await saveHomepageData({
        ...formData,
        bio: bioToSave
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

  const handleInitialize = async () => {
    if (confirm("This will initialize the homepage with default data. Continue?")) {
      const result = await initializeHomepage()
      if (result.success) {
        setMessage({ type: "success", text: "Updated" })
        // Reload the form
        window.location.reload()
      } else {
        setMessage({ type: "error", text: result.message || result.error })
      }
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
          <p className="text-gray-600 mt-2">Update your name, title, bio, and credentials</p>
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

        {/* Initialize Button (if no data exists) */}
        {formData.name === "" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 mb-3">No homepage data found. Initialize with default data?</p>
            <button
              onClick={handleInitialize}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 cursor-pointer"
            >
              Initialize Homepage
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title/Subtitle *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="e.g., Filmmaker & Investigative Journalist"
              required
            />
          </div>

          {/* Bio Paragraphs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio (Each paragraph will appear on a new line) *
            </label>
            <div className="space-y-3">
              {formData.bio.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) => handleBioChange(index, e.target.value)}
                    rows={3}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    placeholder={`Paragraph ${index + 1}`}
                  />
                  {formData.bio.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBioParagraph(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addBioParagraph}
              className="mt-3 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              + Add Paragraph
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Each paragraph will be displayed on a separate line. Add multiple paragraphs for better formatting.
            </p>
          </div>

          {/* Credentials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credentials
            </label>
            <input
              type="text"
              value={formData.credentials}
              onChange={(e) => handleInputChange("credentials", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="e.g., Emmy nominated | Al Jazeera | BBC | DCE Director"
            />
          </div>

          {/* Portrait Image */}
          <div>
            <ImageUpload
              value={formData.portraitImage}
              onChange={(url) => handleInputChange("portraitImage", url)}
              folder="homepage"
              label="Portrait Image"
              placeholder="/images/image.png"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 cursor-pointer"
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

