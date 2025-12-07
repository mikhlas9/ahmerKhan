"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import ImageUpload from "@/components/ImageUpload"
import { getTearsheets, createTearsheet, updateTearsheet, deleteTearsheet } from "@/lib/tearsheets"

function AdminTearsheets() {
  const [tearsheets, setTearsheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    width: 600,
    height: 800,
    publication: "",
    order: 0
  })

  useEffect(() => {
    loadTearsheets()
  }, [])

  async function loadTearsheets() {
    setLoading(true)
    try {
      const data = await getTearsheets()
      setTearsheets(data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load tearsheets" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(tearsheet) {
    setFormData({
      src: tearsheet.src || "",
      alt: tearsheet.alt || "",
      width: tearsheet.width || 600,
      height: tearsheet.height || 800,
      publication: tearsheet.publication || "",
      order: tearsheet.order || 0
    })
    setEditingId(tearsheet.id)
    setShowForm(true)
  }

  function handleNew() {
    setFormData({
      src: "",
      alt: "",
      width: 600,
      height: 800,
      publication: "",
      order: 0
    })
    setEditingId(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    const dataToSave = {
      src: formData.src,
      alt: formData.alt,
      width: parseInt(formData.width) || 600,
      height: parseInt(formData.height) || 800,
      publication: formData.publication,
      order: parseInt(formData.order) || 0
    }

    const result = editingId
      ? await updateTearsheet(editingId, dataToSave)
      : await createTearsheet(dataToSave)

    if (result.success) {
      setMessage({ type: "success", text: editingId ? "Tearsheet updated!" : "Tearsheet created!" })
      setShowForm(false)
      setEditingId(null)
      loadTearsheets()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save tearsheet" })
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this tearsheet?")) return

    const result = await deleteTearsheet(id)
    if (result.success) {
      setMessage({ type: "success", text: "Tearsheet deleted!" })
      loadTearsheets()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete tearsheet" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Tearsheets</h1>
          <p className="text-gray-600">Add, edit, and delete your tearsheets</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="text-gray-700">
              Total tearsheets: <span className="font-semibold">{tearsheets.length}</span>
            </div>
            <button
              onClick={handleNew}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              + New Tearsheet
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "New"} Tearsheet</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <ImageUpload
                    value={formData.src}
                    onChange={(url) => setFormData({ ...formData, src: url })}
                    folder="tearsheets"
                    label="Image *"
                    placeholder="/images/t1.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt}
                    onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                    placeholder="Tearsheet description"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publication</label>
                  <input
                    type="text"
                    value={formData.publication}
                    onChange={(e) => setFormData({ ...formData, publication: e.target.value })}
                    placeholder="The Guardian"
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) || 600 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 800 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading tearsheets...</div>
          ) : tearsheets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tearsheets found. Use the migration script to initialize with default data.
            </div>
          ) : (
            <div className="space-y-4">
              {tearsheets.map((tearsheet) => (
                <div key={tearsheet.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 flex items-center gap-4">
                      {tearsheet.src && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={tearsheet.src}
                            alt={tearsheet.alt || "Tearsheet"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{tearsheet.alt || "Tearsheet"}</h3>
                        <p className="text-sm text-gray-600 mt-1">{tearsheet.src}</p>
                        {tearsheet.publication && (
                          <p className="text-sm text-gray-600 mt-1">Publication: {tearsheet.publication}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Size: {tearsheet.width} × {tearsheet.height}px</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tearsheet)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tearsheet.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm cursor-pointer"
                      >
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

export default function AdminTearsheetsPage() {
  return (
    <AdminAuthWrapper>
      <AdminTearsheets />
    </AdminAuthWrapper>
  )
}
