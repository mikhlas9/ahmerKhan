"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import ImageUpload from "@/components/ImageUpload"
import { getPhotos, createPhoto, updatePhoto, deletePhoto, PHOTO_TYPES } from "@/lib/photos"
import { deleteImage, isFirebaseStorageUrl } from "@/lib/storage"
import Toast from "@/components/Toast"

function AdminStories() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [uploading, setUploading] = useState({})
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    heading: "",
    paragraph: "",
    images: [],
    type: PHOTO_TYPES.STORY,
    order: 0
  })

  useEffect(() => {
    loadStories()
  }, [])

  async function loadStories() {
    setLoading(true)
    try {
      const data = await getPhotos(PHOTO_TYPES.STORY)
      setStories(data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load stories" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(item) {
    setFormData({
      heading: item.heading || "",
      paragraph: item.paragraph || "",
      images: Array.isArray(item.images) ? [...item.images] : [],
      type: PHOTO_TYPES.STORY,
      order: item.order !== undefined ? item.order : 0
    })
    setEditingId(item.id)
    setShowForm(true)
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleNew() {
    // Auto-suggest next order number
    const validOrders = stories
      .map(s => s.order !== undefined ? s.order : 999)
      .filter(order => order >= 0)
    const maxOrder = validOrders.length > 0 
      ? Math.max(...validOrders)
      : -1
    const nextOrder = maxOrder + 1
    
    setFormData({
      heading: "",
      paragraph: "",
      images: [],
      type: PHOTO_TYPES.STORY,
      order: nextOrder
    })
    setEditingId(null)
    setShowForm(true)
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleAddImage() {
    setFormData({
      ...formData,
      images: [...formData.images, ""]
    })
  }

  function handleImageChange(index, url) {
    const newImages = [...formData.images]
    newImages[index] = url
    setFormData({ ...formData, images: newImages })
  }

  function handleRemoveImage(index) {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
  }

  function handleImageUploadingChange(index, isUploading) {
    setUploading(prev => ({
      ...prev,
      [index]: isUploading
    }))
  }

  const isAnyUploading = Object.values(uploading).some(val => val === true)

  async function handleSubmit(e) {
    e.preventDefault()
    if (isAnyUploading) return
    
    setSaving(true)
    setMessage({ type: "", text: "" })

    // Filter out empty images
    const imagesToSave = formData.images.filter(img => img.trim() !== "")

    const dataToSave = {
      heading: formData.heading,
      paragraph: formData.paragraph,
      images: imagesToSave,
      type: PHOTO_TYPES.STORY,
      order: parseInt(formData.order) || 0
    }

    try {
      const result = editingId
        ? await updatePhoto(editingId, dataToSave)
        : await createPhoto(dataToSave)

      if (result.success) {
        setMessage({ type: "success", text: "Updated" })
        setShowForm(false)
        setEditingId(null)
        loadStories()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save story" })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this story?")) return

    setDeletingId(id)
    try {
      const result = await deletePhoto(id)
      if (result.success) {
        // Delete images from storage
        if (result.imageUrls && result.imageUrls.length > 0) {
          for (const imageUrl of result.imageUrls) {
            if (isFirebaseStorageUrl(imageUrl)) {
              await deleteImage(imageUrl)
            }
          }
        }
        setMessage({ type: "success", text: "Updated" })
        loadStories()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete story" })
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Stories</h1>
          <p className="text-gray-600">Add, edit, and delete your photo stories</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Stories</h2>
            </div>
            <button
              onClick={handleNew}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              + New Story
            </button>
          </div>

          {showForm && (
            <form ref={formRef} onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Story" : "New Story"}</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Heading *</label>
                <input
                  type="text"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="Story Title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph *</label>
                <textarea
                  value={formData.paragraph}
                  onChange={(e) => setFormData({ ...formData, paragraph: e.target.value })}
                  rows={4}
                  placeholder="Story description..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Images *</label>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    + Add Image
                  </button>
                </div>
                {formData.images.length === 0 ? (
                  <p className="text-sm text-gray-500 mb-2">No images added. Click "+ Add Image" to add one.</p>
                ) : (
                  <div className="space-y-4">
                    {formData.images.map((imageUrl, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Image {index + 1}</label>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                        <ImageUpload
                          value={imageUrl}
                          onChange={(url) => handleImageChange(index, url)}
                          folder="photos/stories"
                          label=""
                          placeholder="/images/po1.png"
                          onUploadingChange={(isUploading) => handleImageUploadingChange(index, isUploading)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first. Orders are automatically adjusted when inserting between items.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isAnyUploading || saving || formData.images.length === 0}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  disabled={isAnyUploading || saving}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading stories...</div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No stories found. Click "+ New Story" to add one.
            </div>
          ) : (
            <div className="space-y-4">
              {stories.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.heading || "Untitled Story"}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.paragraph || "No description"}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {item.images && Array.isArray(item.images) && item.images.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {item.images.length} image{item.images.length !== 1 ? 's' : ''}
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Order: {item.order !== undefined ? item.order : 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {deletingId === item.id && (
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminStoriesPage() {
  return (
    <AdminAuthWrapper>
      <AdminStories />
    </AdminAuthWrapper>
  )
}
