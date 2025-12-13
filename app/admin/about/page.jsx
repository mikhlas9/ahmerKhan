"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { getAbout, saveAbout } from "@/lib/about"
import Toast from "@/components/Toast"

function AdminAbout() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
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
          bio: Array.isArray(data.bio) ? data.bio.join('\n\n') : (data.bio || ""),
          imagePath: data.imagePath || "/images/profile.jpeg"
        })
      } else {
        // Initialize with default values if no data exists
        setFormData({
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
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    // Convert bio text to array of paragraphs (split by double newlines)
    const bioArray = formData.bio
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0)

    const dataToSave = {
      bio: bioArray.length > 0 ? bioArray : formData.bio,
      imagePath: formData.imagePath
    }

    const result = await saveAbout(dataToSave)

    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      setShowForm(false)
      loadAbout()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save about data" })
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
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Image Path</h3>
                        <p className="text-gray-900">{aboutData.imagePath || "/images/profile.jpeg"}</p>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Edit About Page</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image Path
                    </label>
                    <input
                      type="text"
                      value={formData.imagePath}
                      onChange={(e) => setFormData({ ...formData, imagePath: e.target.value })}
                      placeholder="/images/profile.jpeg"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Path to the profile image (e.g., /images/profile.jpeg)
                    </p>
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
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      {aboutData ? "Update About" : "Create About"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        loadAbout()
                      }}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
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
