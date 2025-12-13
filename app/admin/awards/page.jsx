"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { getAwards, createAward, updateAward, deleteAward } from "@/lib/awards"
import Toast from "@/components/Toast"

function AdminAwards() {
  const [allAwards, setAllAwards] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    year: "",
    award: "",
    title: "",
    outlet: "",
    description: "",
    status: "",
    links: [], // Array of URLs
    order: 0
  })
  const [linkInput, setLinkInput] = useState("")

  useEffect(() => {
    loadAwards()
  }, [])

  async function loadAwards() {
    setLoading(true)
    try {
      // Get all awards without filtering by type
      const allAwardsData = await getAwards()
      setAllAwards(allAwardsData)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load awards" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(award) {
    setFormData({
      year: award.year || "",
      award: award.award || "",
      title: award.title || "",
      outlet: award.outlet || "",
      description: award.description || "",
      status: award.status || "",
      links: award.links || [],
      order: award.order || 0
    })
    setEditingId(award.id)
    setShowForm(true)
    setLinkInput("")
  }

  function handleNew() {
    // Auto-suggest next order number (max order + 1, or 1 if empty)
    const validOrders = allAwards
      .map(a => a.order || 0)
      .filter(order => order >= 1) // Only consider orders >= 1
    const maxOrder = validOrders.length > 0 
      ? Math.max(...validOrders)
      : 0
    const nextOrder = maxOrder + 1
    
    setFormData({
      year: "",
      award: "",
      title: "",
      outlet: "",
      description: "",
      status: "",
      links: [],
      order: nextOrder
    })
    setEditingId(null)
    setShowForm(true)
    setLinkInput("")
  }

  function handleAddLink() {
    if (linkInput.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...(prev.links || []), linkInput.trim()]
      }))
      setLinkInput("")
    }
  }

  function handleRemoveLink(index) {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    const dataToSave = { ...formData }

    const result = editingId
      ? await updateAward(editingId, dataToSave)
      : await createAward(dataToSave)

    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      setShowForm(false)
      setEditingId(null)
      loadAwards()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save award" })
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this award?")) return

    const result = await deleteAward(id)
    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      loadAwards()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete award" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Awards</h1>
          <p className="text-gray-600">Add, edit, and delete your awards</p>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-6">
            <button
              onClick={handleNew}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              + New Award
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Award" : "New Award"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Award Name *</label>
                  <input
                    type="text"
                    value={formData.award}
                    onChange={(e) => setFormData({ ...formData, award: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outlet</label>
                  <input
                    type="text"
                    value={formData.outlet}
                    onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <input
                    type="text"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="e.g., Finalist, Nomination"
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
                    min="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lower numbers appear first. Awards are displayed in order.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Links Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddLink()
                        }
                      }}
                      placeholder="https://example.com"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Add Link
                    </button>
                  </div>
                  {formData.links && formData.links.length > 0 && (
                    <div className="space-y-1">
                      {formData.links.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-sm text-blue-600 hover:text-blue-800 truncate"
                          >
                            {link}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index)}
                            className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  {editingId ? "Update Award" : "Create Award"}
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
            <div className="text-center py-12 text-gray-500">Loading awards...</div>
          ) : allAwards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No awards found. Use the migration script to initialize with default data.
            </div>
          ) : (
            <div className="space-y-4">
              {allAwards.map((award) => (
                <div key={award.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">Order: {award.order || 0}</span>
                        <h3 className="font-semibold text-gray-900">{award.year || ''} {award.year && '-'} {award.award}</h3>
                      </div>
                      {award.title && <p className="text-sm text-gray-600 mt-1">{award.title}</p>}
                      {award.outlet && <p className="text-xs text-gray-500 mt-1">{award.outlet}</p>}
                      {award.status && <p className="text-xs text-gray-500 mt-1">Status: {award.status}</p>}
                      {award.links && award.links.length > 0 && (
                        <p className="text-xs text-blue-600 mt-1">{award.links.length} link(s)</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(award)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(award.id)}
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

export default function AdminAwardsPage() {
  return (
    <AdminAuthWrapper>
      <AdminAwards />
    </AdminAuthWrapper>
  )
}

