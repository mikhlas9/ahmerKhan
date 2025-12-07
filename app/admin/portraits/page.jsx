"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import ImageUpload from "@/components/ImageUpload"
import { getPortraits, createPortrait, updatePortrait, deletePortrait, PORTRAIT_TYPES } from "@/lib/portraits"

function AdminPortraits() {
  const [portraits, setPortraits] = useState([])
  const [countryProjects, setCountryProjects] = useState([])
  const [selectedType, setSelectedType] = useState(PORTRAIT_TYPES.PORTRAIT)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    src: "",
    alt: "",
    width: 500,
    height: 600,
    name: "",
    image: "",
    link: "#",
    type: PORTRAIT_TYPES.PORTRAIT,
    order: 0
  })

  useEffect(() => {
    loadPortraits()
  }, [])

  async function loadPortraits() {
    setLoading(true)
    try {
      const [portraitsData, countryData] = await Promise.all([
        getPortraits(PORTRAIT_TYPES.PORTRAIT),
        getPortraits(PORTRAIT_TYPES.COUNTRY_PROJECT)
      ])
      setPortraits(portraitsData)
      setCountryProjects(countryData)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load portraits" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(item) {
    if (item.type === PORTRAIT_TYPES.PORTRAIT) {
      setFormData({
        src: item.src || "",
        alt: item.alt || "",
        width: item.width || 500,
        height: item.height || 600,
        name: "",
        image: "",
        link: "#",
        type: PORTRAIT_TYPES.PORTRAIT,
        order: item.order || 0
      })
    } else {
      setFormData({
        src: "",
        alt: "",
        width: 500,
        height: 600,
        name: item.name || "",
        image: item.image || "",
        link: item.link || "#",
        type: PORTRAIT_TYPES.COUNTRY_PROJECT,
        order: item.order || 0
      })
    }
    setEditingId(item.id)
    setSelectedType(item.type)
    setShowForm(true)
  }

  function handleNew() {
    if (selectedType === PORTRAIT_TYPES.PORTRAIT) {
      setFormData({
        src: "",
        alt: "",
        width: 500,
        height: 600,
        name: "",
        image: "",
        link: "#",
        type: PORTRAIT_TYPES.PORTRAIT,
        order: 0
      })
    } else {
      setFormData({
        src: "",
        alt: "",
        width: 500,
        height: 600,
        name: "",
        image: "",
        link: "#",
        type: PORTRAIT_TYPES.COUNTRY_PROJECT,
        order: 0
      })
    }
    setEditingId(null)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    // Prepare data based on type
    const dataToSave = selectedType === PORTRAIT_TYPES.PORTRAIT
      ? {
          src: formData.src,
          alt: formData.alt,
          width: parseInt(formData.width) || 500,
          height: parseInt(formData.height) || 600,
          type: PORTRAIT_TYPES.PORTRAIT,
          order: parseInt(formData.order) || 0
        }
      : {
          name: formData.name,
          image: formData.image,
          link: formData.link,
          type: PORTRAIT_TYPES.COUNTRY_PROJECT,
          order: parseInt(formData.order) || 0
        }

    const result = editingId
      ? await updatePortrait(editingId, dataToSave)
      : await createPortrait(dataToSave)

    if (result.success) {
      setMessage({ type: "success", text: editingId ? "Portrait updated!" : "Portrait created!" })
      setShowForm(false)
      setEditingId(null)
      loadPortraits()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save portrait" })
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this portrait?")) return

    const result = await deletePortrait(id)
    if (result.success) {
      setMessage({ type: "success", text: "Portrait deleted!" })
      loadPortraits()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete portrait" })
    }
  }

  const currentItems = selectedType === PORTRAIT_TYPES.PORTRAIT ? portraits : countryProjects

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Portraits</h1>
          <p className="text-gray-600">Add, edit, and delete your portraits and country projects</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Type</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value)
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={PORTRAIT_TYPES.PORTRAIT}>Main Portraits</option>
                <option value={PORTRAIT_TYPES.COUNTRY_PROJECT}>Country Projects</option>
              </select>
            </div>
            <button
              onClick={handleNew}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              + New {selectedType === PORTRAIT_TYPES.PORTRAIT ? "Portrait" : "Country Project"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit" : "New"} {selectedType === PORTRAIT_TYPES.PORTRAIT ? "Portrait" : "Country Project"}</h2>
              
              {selectedType === PORTRAIT_TYPES.PORTRAIT ? (
                <>
                  <div className="mb-4">
                    <ImageUpload
                      value={formData.src}
                      onChange={(url) => setFormData({ ...formData, src: url })}
                      folder="portraits"
                      label="Image *"
                      placeholder="/images/po1.png"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={formData.alt}
                        onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                        placeholder="Portrait description"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Bangladesh"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <ImageUpload
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url })}
                        folder="portraits"
                        label="Image *"
                        placeholder="/images/poc1.png"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                      <input
                        type="text"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="#"
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
                  </div>
                </>
              )}

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
            <div className="text-center py-12 text-gray-500">Loading portraits...</div>
          ) : currentItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No {selectedType === PORTRAIT_TYPES.PORTRAIT ? "portraits" : "country projects"} found. Use the migration script to initialize with default data.
            </div>
          ) : (
            <div className="space-y-4">
              {currentItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 flex items-center gap-4">
                      {item.type === PORTRAIT_TYPES.PORTRAIT ? (
                        <>
                          {item.src && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.src}
                                alt={item.alt || "Portrait"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.alt || "Portrait"}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.src}</p>
                            <p className="text-xs text-gray-500 mt-1">Size: {item.width} × {item.height}px</p>
                          </div>
                        </>
                      ) : (
                        <>
                          {item.image && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.image}</p>
                            {item.link && <p className="text-xs text-gray-500 mt-1">Link: {item.link}</p>}
                          </div>
                        </>
                      )}
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

export default function AdminPortraitsPage() {
  return (
    <AdminAuthWrapper>
      <AdminPortraits />
    </AdminAuthWrapper>
  )
}
