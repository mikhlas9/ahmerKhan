"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { getVideoReports, createVideoReport, updateVideoReport, deleteVideoReport } from "@/lib/video-reports"
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from "@/lib/storage"
import Toast from "@/components/Toast"

function AdminVideoReports() {
  const [videoReports, setVideoReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const formRef = useRef(null)

  const [formData, setFormData] = useState({
    outlet: "",
    title: "",
    videoUrl: "",
    videoThumbnail: "",
    order: 0
  })

  useEffect(() => {
    loadVideoReports()
  }, [])

  async function loadVideoReports() {
    setLoading(true)
    try {
      const data = await getVideoReports()
      setVideoReports(data)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load video reports" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(report) {
    setFormData({
      outlet: report.outlet || "",
      title: report.title || "",
      videoUrl: report.videoUrl || "",
      videoThumbnail: report.videoThumbnail || "",
      order: report.order || 0
    })
    setEditingId(report.id)
    setShowForm(true)
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleNew() {
    // Auto-suggest next order number (max order + 1, or 1 if empty)
    const validOrders = videoReports
      .map(r => r.order || 0)
      .filter(order => order >= 1) // Only consider orders >= 1
    const maxOrder = validOrders.length > 0 
      ? Math.max(...validOrders)
      : 0
    const nextOrder = maxOrder + 1
    
    setFormData({
      outlet: "",
      title: "",
      videoUrl: "",
      videoThumbnail: "",
      order: nextOrder
    })
    setEditingId(null)
    setShowForm(true)
    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Handle video URL change and auto-fill thumbnail
  const handleVideoUrlChange = (url) => {
    const videoId = extractYouTubeVideoId(url)
    let thumbnailUrl = ""
    
    if (videoId) {
      thumbnailUrl = getYouTubeThumbnailUrl(videoId)
    }
    
    setFormData(prev => ({
      ...prev,
      videoUrl: url,
      videoThumbnail: thumbnailUrl
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    if (!formData.outlet || !formData.title || !formData.videoUrl) {
      setMessage({ type: "error", text: "Please fill in all required fields" })
      setSaving(false)
      return
    }

    try {
    const result = editingId
      ? await updateVideoReport(editingId, formData)
      : await createVideoReport(formData)

    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      setShowForm(false)
      setEditingId(null)
      loadVideoReports()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save video report" })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this video report?")) return

    setDeletingId(id)
    try {
    const result = await deleteVideoReport(id)
    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      loadVideoReports()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete video report" })
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Video Reports</h1>
          <p className="text-gray-600">Add, edit, and delete your video reports</p>
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
              <h2 className="text-xl font-semibold text-gray-900">Video Reports</h2>
            </div>
            <button
              onClick={handleNew}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              + New Video Report
            </button>
          </div>

          {showForm && (
            <form ref={formRef} onSubmit={handleSubmit} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">{editingId ? "Edit Video Report" : "New Video Report"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Outlet *</label>
                  <input
                    type="text"
                    value={formData.outlet}
                    onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                    placeholder="e.g., The New York Times"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">The publication or network name (shown at top)</p>
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
                    Lower numbers appear first. Orders are independent for Video Reports only.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Inside India's Crackdown on Kashmir | The Dispatch"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">The video report title (shown below outlet)</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL *</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a YouTube URL. The thumbnail will be automatically generated.
                </p>
              </div>

              {formData.videoThumbnail && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Thumbnail (Auto-generated)</label>
                  <div className="relative w-full max-w-md border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <div className="relative aspect-video w-full">
                      <img
                        src={formData.videoThumbnail}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This thumbnail is automatically generated from the YouTube video URL.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {editingId ? "Update Video Report" : "Create Video Report"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading video reports...</div>
          ) : videoReports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No video reports found. Use the migration script to initialize with default data.
            </div>
          ) : (
            <div className="space-y-4">
              {videoReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 uppercase text-sm">{report.outlet}</p>
                      <p className="text-base text-gray-700 mt-1">{report.title}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Order: {report.order}</span>
                        {report.videoUrl && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Video</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(report)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        disabled={deletingId === report.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {deletingId === report.id && (
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

export default function AdminVideoReportsPage() {
  return (
    <AdminAuthWrapper>
      <AdminVideoReports />
    </AdminAuthWrapper>
  )
}

