"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import ImageUpload from "@/components/ImageUpload"
import { getAwards, createAward, updateAward, deleteAward, AWARD_TYPES } from "@/lib/awards"
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from "@/lib/storage"

function AdminAwards() {
  const [awards, setAwards] = useState([])
  const [recognitionAwards, setRecognitionAwards] = useState([])
  const [selectedType, setSelectedType] = useState(AWARD_TYPES.AWARD)
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
    quote: "",
    attribution: "",
    image: "",
    videoUrl: "",
    videoThumbnail: "",
    status: "",
    type: AWARD_TYPES.AWARD,
    order: 0,
    mediaType: "image" // "image" or "video"
  })

  useEffect(() => {
    loadAwards()
  }, [])

  async function loadAwards() {
    setLoading(true)
    try {
      const [awardsData, recognitionData] = await Promise.all([
        getAwards(AWARD_TYPES.AWARD),
        getAwards(AWARD_TYPES.RECOGNITION)
      ])
      setAwards(awardsData)
      setRecognitionAwards(recognitionData)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load awards" })
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(award) {
    // Determine media type based on what exists
    const mediaType = award.videoUrl ? "video" : "image"
    
    setFormData({
      year: award.year || "",
      award: award.award || "",
      title: award.title || "",
      outlet: award.outlet || "",
      description: award.description || "",
      quote: award.quote || "",
      attribution: award.attribution || "",
      image: award.image || "",
      videoUrl: award.videoUrl || "",
      videoThumbnail: award.videoThumbnail || "",
      status: award.status || "",
      type: award.type || AWARD_TYPES.AWARD,
      order: award.order || 0,
      mediaType: mediaType
    })
    setEditingId(award.id)
    setSelectedType(award.type)
    setShowForm(true)
  }

  function handleNew() {
    setFormData({
      year: "",
      award: "",
      title: "",
      outlet: "",
      description: "",
      quote: "",
      attribution: "",
      image: "",
      videoUrl: "",
      videoThumbnail: "",
      status: "",
      type: selectedType,
      order: 0,
      mediaType: "image"
    })
    setEditingId(null)
    setShowForm(true)
  }

  // Handle media type change (image or video)
  const handleMediaTypeChange = (newType) => {
    if (newType === "image") {
      // Clear video fields when switching to image
      setFormData(prev => ({
        ...prev,
        mediaType: "image",
        videoUrl: "",
        videoThumbnail: ""
      }))
    } else {
      // Clear image field when switching to video
      setFormData(prev => ({
        ...prev,
        mediaType: "video",
        image: ""
      }))
    }
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
      videoThumbnail: thumbnailUrl,
      // Also set image to thumbnail URL for display
      image: thumbnailUrl
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    // Prepare data based on media type
    const dataToSave = { ...formData }
    
    if (dataToSave.mediaType === "image") {
      // Clear video fields if image is selected
      dataToSave.videoUrl = ""
      dataToSave.videoThumbnail = ""
    } else {
      // Clear image field if video is selected
      dataToSave.image = ""
    }
    
    // Remove mediaType from data (not needed in database)
    delete dataToSave.mediaType

    const result = editingId
      ? await updateAward(editingId, dataToSave)
      : await createAward(dataToSave)

    if (result.success) {
      setMessage({ type: "success", text: editingId ? "Award updated!" : "Award created!" })
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
      setMessage({ type: "success", text: "Award deleted!" })
      loadAwards()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete award" })
    }
  }

  const currentAwards = selectedType === AWARD_TYPES.AWARD ? awards : recognitionAwards

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Awards</h1>
          <p className="text-gray-600">Add, edit, and delete your awards and recognition</p>
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
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={AWARD_TYPES.AWARD}>Main Awards</option>
                <option value={AWARD_TYPES.RECOGNITION}>Recognition</option>
              </select>
            </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status (for Recognition)</label>
                  <input
                    type="text"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="e.g., Finalist"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={AWARD_TYPES.AWARD}>Main Award</option>
                    <option value={AWARD_TYPES.RECOGNITION}>Recognition</option>
                  </select>
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attribution</label>
                <input
                  type="text"
                  value={formData.attribution}
                  onChange={(e) => setFormData({ ...formData, attribution: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Media Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Media Type *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="image"
                      checked={formData.mediaType === "image"}
                      onChange={(e) => handleMediaTypeChange("image")}
                      className="mr-2"
                    />
                    Image
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="video"
                      checked={formData.mediaType === "video"}
                      onChange={(e) => handleMediaTypeChange("video")}
                      className="mr-2"
                    />
                    Video
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Choose either image or video, not both.</p>
              </div>

              {/* Image Upload (shown when image is selected) */}
              {formData.mediaType === "image" && (
                <div className="mb-4">
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    folder="awards"
                    label="Image *"
                    placeholder="/images/a1.png"
                  />
                </div>
              )}

              {/* Video Fields (shown when video is selected) */}
              {formData.mediaType === "video" && (
                <div className="space-y-4 mb-4">
                  <div>
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
                    <div>
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
                        This thumbnail is automatically generated from the YouTube video URL and will be used as the image.
                      </p>
                    </div>
                  )}
                </div>
              )}

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
          ) : currentAwards.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No awards found in this category. Use the migration script to initialize with default data.
            </div>
          ) : (
            <div className="space-y-4">
              {currentAwards.map((award) => (
                <div key={award.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{award.year} - {award.award}</h3>
                      {award.title && <p className="text-sm text-gray-600 mt-1">{award.title}</p>}
                      {award.outlet && <p className="text-xs text-gray-500 mt-1">{award.outlet}</p>}
                      <div className="mt-2 flex gap-2">
                        {award.image && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Image</span>}
                        {award.videoUrl && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Video</span>}
                        {award.quote && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Quote</span>}
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{award.type}</span>
                      </div>
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

