"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { getAbout, saveAbout } from "@/lib/about"
import ImageUpload from "@/components/ImageUpload"
import { deleteImage, isFirebaseStorageUrl } from "@/lib/storage"
import Toast from "@/components/Toast"

function AdminAbout() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    imagePath: "/images/profile.jpeg"
  })

  useEffect(() => {
    loadAbout()
  }, [])

  async function loadAbout() {
    setLoading(true)
    try {
      const data = await getAbout()
      if (data) {
        setAboutData(data)
        setFormData({
          name: data.name || "",
          title: data.title || "",
          bio: Array.isArray(data.bio) ? data.bio.join('\n\n') : (data.bio || ""),
          imagePath: data.imagePath || "/images/profile.jpeg"
        })
      } else {
        // Initialize with default values if no data exists
        setFormData({
          name: "",
          title: "",
          bio: "",
          imagePath: "/images/profile.jpeg"
        })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load about data" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit() {
    setShowForm(true)
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (uploading) return
    
    setSaving(true)
    setMessage({ type: "", text: "" })

    // Convert bio text to array of paragraphs (split by double newlines)
    const bioArray = formData.bio
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0)

    const dataToSave = {
      name: formData.name || "",
      title: formData.title || "",
      bio: bioArray.length > 0 ? bioArray : formData.bio,
      imagePath: formData.imagePath
    }

    try {
    const result = await saveAbout(dataToSave)

    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      setShowForm(false)
      loadAbout()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save about data" })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage About Page</h1>
          <p className="text-gray-600">Edit the about page content and image</p>
        </div>

        {/* Toast Notification */}
        <Toast 
          message={message.type === "success" ? message.text : null} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })}
        />
        
        {/* Error Message */}
        {message.type === "error" && message.text && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800">
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading about data...</div>
          ) : (
            <>
              {!showForm ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-6">
                    <button
                      onClick={handleEdit}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      {aboutData ? "Edit About" : "Create About"}
                    </button>
                  </div>

                  {aboutData ? (
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Name</h3>
                        <p className="text-gray-900">{aboutData.name || "Not set"}</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Title</h3>
                        <p className="text-gray-900">{aboutData.title || "Not set"}</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Image</h3>
                        {aboutData.imagePath && (
                          <div className="relative w-full max-w-xs aspect-[3/4] rounded-sm overflow-hidden border border-gray-300 mb-2">
                            <img 
                              src={aboutData.imagePath} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-gray-500 text-sm">{aboutData.imagePath || "/images/profile.jpeg"}</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Bio</h3>
                        <div className="text-gray-900 whitespace-pre-line">
                          {Array.isArray(aboutData.bio) 
                            ? aboutData.bio.join('\n\n')
                            : (aboutData.bio || "No bio content")}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No about data found. Click "Create About" to add content.
                    </div>
                  )}
                </>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Edit About Page</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., AHMER KHAN"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Full name (displayed in navbar and about page header)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title/Subtitle *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Filmmaker & Investigative Journalist"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Professional title or subtitle (displayed in navbar and about page header)
                    </p>
                  </div>

                  <div>
                    <ImageUpload
                      value={formData.imagePath}
                      onChange={(url) => setFormData({ ...formData, imagePath: url })}
                      folder="about"
                      label="Profile Image"
                      placeholder="/images/profile.jpeg"
                      onUploadingChange={setUploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio Text *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={20}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Enter the bio text. Use double line breaks to separate paragraphs."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the bio text. Use double line breaks (blank line) to separate paragraphs.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={uploading || saving}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {aboutData ? "Update About" : "Create About"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        loadAbout()
                      }}
                      disabled={uploading || saving}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminAboutPage() {
  return (
    <AdminAuthWrapper>
      <AdminAbout />
    </AdminAuthWrapper>
  )
}
