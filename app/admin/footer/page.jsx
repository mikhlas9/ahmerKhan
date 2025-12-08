"use client"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { useState, useEffect } from "react"
import { getFooterData, saveFooterData, initializeFooter } from "@/lib/footer"
import { useRouter } from "next/navigation"
import Toast from "@/components/Toast"

function FooterAdmin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [formData, setFormData] = useState({
    socialLinks: [
      { name: 'X (Twitter)', href: '', ariaLabel: '', enabled: true },
      { name: 'Instagram', href: '', ariaLabel: '', enabled: true },
      { name: 'LinkedIn', href: '', ariaLabel: '', enabled: true },
      { name: 'Vimeo', href: '', ariaLabel: '', enabled: true },
      { name: 'Email', href: '', ariaLabel: '', enabled: true },
    ],
    copyrightText: ""
  })

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getFooterData()
        if (data) {
          setFormData({
            socialLinks: data.socialLinks || formData.socialLinks,
            copyrightText: data.copyrightText || ""
          })
        }
      } catch (error) {
        console.error('Error loading data:', error)
        setMessage({ type: "error", text: "Failed to load footer data" })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSocialLinkChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const handleToggleSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, enabled: !link.enabled } : link
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const result = await saveFooterData({
        socialLinks: formData.socialLinks,
        copyrightText: formData.copyrightText
      })

      if (result.success) {
        setMessage({ type: "success", text: "Updated" })
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save" })
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "An error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const handleInitialize = async () => {
    if (confirm("This will initialize the footer with default data. Continue?")) {
      const result = await initializeFooter()
      if (result.success) {
        setMessage({ type: "success", text: "Updated" })
        // Reload the form
        window.location.reload()
      } else {
        setMessage({ type: "error", text: result.message || result.error })
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Footer</h1>
          <p className="text-gray-600 mt-2">Manage social links and copyright text</p>
        </div>

        {/* Toast Notification */}
        <Toast 
          message={message.type === "success" ? message.text : null} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })}
        />
        
        {/* Error Message */}
        {message.type === "error" && message.text && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
            {message.text}
          </div>
        )}

        {/* Initialize Button (if no data exists) */}
        {formData.copyrightText === "" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 mb-3">No footer data found. Initialize with default data?</p>
            <button
              onClick={handleInitialize}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 cursor-pointer"
            >
              Initialize Footer
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Social Links
            </label>
            <div className="space-y-4">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={link.enabled}
                        onChange={() => handleToggleSocialLink(index)}
                        className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800 cursor-pointer"
                      />
                      <span className="font-medium text-gray-900">{link.name}</span>
                    </div>
                  </div>
                  {link.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          URL *
                        </label>
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => handleSocialLinkChange(index, 'href', e.target.value)}
                          placeholder={link.name === 'Email' ? 'mailto:contact@example.com' : 'https://...'}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                          required={link.enabled}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Aria Label (for accessibility)
                        </label>
                        <input
                          type="text"
                          value={link.ariaLabel}
                          onChange={(e) => handleSocialLinkChange(index, 'ariaLabel', e.target.value)}
                          placeholder={`e.g., Follow on ${link.name}`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Copyright Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copyright Text *
            </label>
            <input
              type="text"
              value={formData.copyrightText}
              onChange={(e) => setFormData(prev => ({ ...prev, copyrightText: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Ahmer Khan. All rights reserved."
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              The year will be automatically added. Example: "Ahmer Khan. All rights reserved." will display as "© 2024 Ahmer Khan. All rights reserved."
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default function FooterAdminPage() {
  return (
    <AdminAuthWrapper>
      <FooterAdmin />
    </AdminAuthWrapper>
  )
}

