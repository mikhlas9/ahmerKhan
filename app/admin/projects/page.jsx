"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import ImageUpload from "@/components/ImageUpload"
import { deleteImage, isFirebaseStorageUrl, extractYouTubeVideoId, getYouTubeThumbnailUrl } from "@/lib/storage"
import { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  PROJECT_CATEGORIES,
  PROJECT_TYPES
} from "@/lib/projects"

function ProjectsAdmin() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(PROJECT_CATEGORIES.ALL)
  
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    network: "",
    description: "",
    type: PROJECT_TYPES.PHOTO,
    category: PROJECT_CATEGORIES.ALL,
    images: [""],
    videoUrl: "",
    videoThumbnail: "",
    videoTitle: "",
    quote: "",
    readMoreLink: "",
    order: 0
  })

  useEffect(() => {
    loadProjects()
  }, [selectedCategory])

  async function loadProjects() {
    setLoading(true)
    try {
      const data = await getProjects(selectedCategory === PROJECT_CATEGORIES.ALL ? null : selectedCategory)
      setProjects(data)
      if (data.length === 0) {
        console.log('No projects found. Category:', selectedCategory)
        console.log('Available categories:', PROJECT_CATEGORIES)
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      setMessage({ type: "error", text: `Failed to load projects: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
      videoThumbnail: thumbnailUrl || prev.videoThumbnail // Keep existing if no video ID found
    }))
  }

  const handleImageChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }))
  }

  const removeImage = async (index) => {
    if (formData.images.length > 1) {
      const imageToRemove = formData.images[index]
      
      // Delete from Firebase Storage if it's a Firebase Storage URL
      if (imageToRemove && isFirebaseStorageUrl(imageToRemove)) {
        await deleteImage(imageToRemove)
      }
      
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      role: "",
      network: "",
      description: "",
      type: PROJECT_TYPES.PHOTO,
      category: PROJECT_CATEGORIES.ALL,
      images: [""],
      videoUrl: "",
      videoThumbnail: "",
      videoTitle: "",
      quote: "",
      readMoreLink: "",
      order: 0
    })
    setEditingProject(null)
    setShowForm(false)
  }

  const handleEdit = (project) => {
    setEditingProject(project.id)
    setFormData({
      title: project.title || "",
      role: project.role || "",
      network: project.network || "",
      description: project.description || "",
      type: project.type || PROJECT_TYPES.PHOTO,
      category: project.category || PROJECT_CATEGORIES.ALL,
      images: project.images && project.images.length > 0 ? project.images : [""],
      videoUrl: project.videoUrl || "",
      videoThumbnail: project.videoThumbnail || "",
      videoTitle: project.videoTitle || "",
      quote: project.quote || "",
      readMoreLink: project.readMoreLink || "",
      order: project.order || 0
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const imagesToSave = formData.images.filter(img => img.trim() !== "")
      
      const projectData = {
        title: formData.title,
        role: formData.role,
        network: formData.network,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        readMoreLink: formData.readMoreLink || "",
        order: parseInt(formData.order) || 0
      }

      if (formData.type === PROJECT_TYPES.PHOTO) {
        projectData.images = imagesToSave
        if (formData.quote) projectData.quote = formData.quote
      } else {
        projectData.videoUrl = formData.videoUrl
        projectData.videoThumbnail = formData.videoThumbnail
        if (formData.videoTitle) projectData.videoTitle = formData.videoTitle
      }

      let result
      if (editingProject) {
        result = await updateProject(editingProject, projectData)
      } else {
        result = await createProject(projectData)
      }

      if (result.success) {
        setMessage({ type: "success", text: editingProject ? "Project updated!" : "Project created!" })
        resetForm()
        loadProjects()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "An error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    const result = await deleteProject(projectId)
    if (result.success) {
      setMessage({ type: "success", text: "Project deleted!" })
      loadProjects()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete" })
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
              <p className="text-gray-600 mt-2">Add, edit, and delete your projects</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              + New Project
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "success" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option value={PROJECT_CATEGORIES.ALL}>All Projects (Main Page)</option>
            <option value={PROJECT_CATEGORIES.PHOTO_STORIES}>Photo Stories</option>
            <option value={PROJECT_CATEGORIES.FILMS_DOCUMENTARIES}>Films & Documentaries</option>
            <option value={PROJECT_CATEGORIES.PRINT_DIGITAL_FEATURES}>Print & Digital Features</option>
            <option value={PROJECT_CATEGORIES.GLOBAL_ASSIGNMENTS}>Global Assignments</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 mb-4">No projects found in this category.</p>
            <p className="text-sm text-gray-400">Use the migration scripts to initialize with default data.</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <span>Category: {project.category}</span>
                      <span>Type: {project.type}</span>
                      <span>Network: {project.network}</span>
                      <span>Order: {project.order || 0}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProject ? "Edit Project" : "New Project"}
                  </h2>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        required
                      >
                        <option value={PROJECT_CATEGORIES.ALL}>All Projects (Main Page)</option>
                        <option value={PROJECT_CATEGORIES.PHOTO_STORIES}>Photo Stories</option>
                        <option value={PROJECT_CATEGORIES.FILMS_DOCUMENTARIES}>Films & Documentaries</option>
                        <option value={PROJECT_CATEGORIES.PRINT_DIGITAL_FEATURES}>Print & Digital Features</option>
                        <option value={PROJECT_CATEGORIES.GLOBAL_ASSIGNMENTS}>Global Assignments</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Network *</label>
                      <input
                        type="text"
                        value={formData.network}
                        onChange={(e) => handleInputChange("network", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value={PROJECT_TYPES.PHOTO}
                          checked={formData.type === PROJECT_TYPES.PHOTO}
                          onChange={(e) => handleInputChange("type", e.target.value)}
                          className="mr-2"
                        />
                        Photo
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value={PROJECT_TYPES.VIDEO}
                          checked={formData.type === PROJECT_TYPES.VIDEO}
                          onChange={(e) => handleInputChange("type", e.target.value)}
                          className="mr-2"
                        />
                        Video
                      </label>
                    </div>
                  </div>

                  {formData.type === PROJECT_TYPES.PHOTO && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">Images</label>
                        <div className="space-y-4">
                          {formData.images.map((img, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                                {formData.images.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                  >
                                    Remove Image
                                  </button>
                                )}
                              </div>
                              <ImageUpload
                                value={img}
                                onChange={(url) => handleImageChange(index, url)}
                                folder="projects"
                                label=""
                                placeholder="/images/image.png"
                              />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={addImage}
                          className="mt-4 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                        >
                          + Add Image
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quote (Optional)</label>
                        <textarea
                          value={formData.quote}
                          onChange={(e) => handleInputChange("quote", e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  {formData.type === PROJECT_TYPES.VIDEO && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video URL *</label>
                        <input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) => handleVideoUrlChange(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          required={formData.type === PROJECT_TYPES.VIDEO}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter a YouTube URL. The thumbnail will be automatically generated.
                        </p>
                      </div>
                      <div>
                        <ImageUpload
                          value={formData.videoThumbnail}
                          onChange={(url) => handleInputChange("videoThumbnail", url)}
                          folder="projects"
                          label="Video Thumbnail *"
                          placeholder="https://img.youtube.com/vi/... or /images/thumbnail.png"
                        />
                        {formData.videoThumbnail && formData.videoThumbnail.includes('youtube.com/vi/') && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Thumbnail automatically generated from YouTube video URL
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video Title (Optional)</label>
                        <input
                          type="text"
                          value={formData.videoTitle}
                          onChange={(e) => handleInputChange("videoTitle", e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Read More Link</label>
                      <input
                        type="url"
                        value={formData.readMoreLink}
                        onChange={(e) => handleInputChange("readMoreLink", e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order (for display sequence)</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => handleInputChange("order", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Lower numbers appear first. Projects alternate left/right based on index.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function ProjectsAdminPage() {
  return (
    <AdminAuthWrapper>
      <ProjectsAdmin />
    </AdminAuthWrapper>
  )
}
