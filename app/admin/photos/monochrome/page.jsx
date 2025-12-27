"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import ImageUpload from "@/components/ImageUpload"
import { getPhotos, createPhoto, updatePhoto, deletePhoto, PHOTO_TYPES } from "@/lib/photos"
import { deleteImage, isFirebaseStorageUrl } from "@/lib/storage"
import Toast from "@/components/Toast"

function AdminMonochrome() {
  const [monochrome, setMonochrome] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    caption: "",
    width: 500,
    height: 600,
    type: PHOTO_TYPES.MONOCHROME,
    order: 0
  })

  useEffect(() => {
    loadMonochrome()
  }, [])

  async function loadMonochrome() {
    setLoading(true)
    try {
      const data = await getPhotos(PHOTO_TYPES.MONOCHROME)
      setMonochrome(data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load monochrome photos" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(item) {
    setFormData({
      src: item.src || "",
      alt: item.alt || "",
      caption: item.caption || "",
      width: item.width || 500,
      height: item.height || 600,
      type: PHOTO_TYPES.MONOCHROME,
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
    const validOrders = monochrome
      .map(m => m.order !== undefined ? m.order : 999)
      .filter(order => order >= 0)
    const maxOrder = validOrders.length > 0 
      ? Math.max(...validOrders)
      : -1
    const nextOrder = maxOrder + 1
    
    setFormData({
      src: "",
      alt: "",
      caption: "",
      width: 500,
      height: 600,
      type: PHOTO_TYPES.MONOCHROME,
      order: nextOrder
    })
    setEditingId(null)
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

    const dataToSave = {
      src: formData.src,
      alt: formData.alt,
      caption: formData.caption || "",
      width: parseInt(formData.width) || 500,
      height: parseInt(formData.height) || 600,
      type: PHOTO_TYPES.MONOCHROME,
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
        loadMonochrome()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save monochrome photo" })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this monochrome photo?")) return

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
        loadMonochrome()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to delete monochrome photo" })
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Monochrome</h1>
          <p className="text-gray-600">Add, edit, and delete your monochrome photos</p>
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
              <h2 className="text-xl font-semibold text-gray-900">Monochrome Photos</h2>
            </div>
            <button
              onClick={handleNew}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              + New Monochrome
            </button>
          </div>

          {showForm && (
            <form ref={formRef} onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Monochrome Photo" : "New Monochrome Photo"}</h2>
              
              <div className="mb-4">
                <ImageUpload
                  value={formData.src}
                  onChange={(url) => setFormData({ ...formData, src: url })}
                  folder="photos/monochrome"
                  label="Image *"
                  placeholder="/images/monochrome1.png"
                  onUploadingChange={setUploading}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="A monochrome photograph description"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Text that appears below the image
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    placeholder="Photo description"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 500 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 600 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
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
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  disabled={uploading || saving}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading monochrome photos...</div>
          ) : monochrome.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No monochrome photos found. Click "+ New Monochrome" to add one.
            </div>
          ) : (
            <div className="space-y-4">
              {monochrome.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 flex items-center gap-4">
                      {item.src && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={item.src}
                            alt={item.alt || "Monochrome"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.alt || "Monochrome"}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.src}</p>
                        {item.caption && (
                          <p className="text-sm text-gray-700 mt-1 italic line-clamp-2">{item.caption}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Size: {item.width} × {item.height}px | Order: {item.order !== undefined ? item.order : 0}</p>
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

export default function AdminMonochromePage() {
  return (
    <AdminAuthWrapper>
      <AdminMonochrome />
    </AdminAuthWrapper>
  )
}
