"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { getContactData, updateContactData, initializeContactData } from "@/lib/contact"
import Toast from "@/components/Toast"

function AdminContact() {
  const [contactInfo, setContactInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: "",
    phone: "",
    location: "",
    locationDescription: "",
    emailjsServiceId: "",
    emailjsTemplateId: "",
    emailjsPublicKey: "",
    recipientEmail: ""
  })

  useEffect(() => {
    loadContactData()
  }, [])

  async function loadContactData() {
    setLoading(true)
    try {
      const data = await getContactData()
      setContactInfo(data)
      setFormData({
        title: data.title || "",
        description: data.description || "",
        email: data.email || "",
        phone: data.phone || "",
        location: data.location || "",
        locationDescription: data.locationDescription || "",
        emailjsServiceId: data.emailjsServiceId || "",
        emailjsTemplateId: data.emailjsTemplateId || "",
        emailjsPublicKey: data.emailjsPublicKey || "",
        recipientEmail: data.recipientEmail || ""
      })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load contact information" })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: "", text: "" })

    const result = await updateContactData(formData)

    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      loadContactData()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to update contact information" })
    }
    setSaving(false)
  }

  async function handleInitialize() {
    if (!confirm("This will reset all contact information to default values. Continue?")) return

    setSaving(true)
    setMessage({ type: "", text: "" })

    const result = await initializeContactData()

    if (result.success) {
      setMessage({ type: "success", text: "Updated" })
      loadContactData()
    } else {
      setMessage({ type: "error", text: result.error || "Failed to initialize contact information" })
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin" className="text-gray-600 hover:text-gray-900 mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Contact Information</h1>
          <p className="text-gray-600">Update your contact details and EmailJS configuration</p>
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
            <div className="text-center py-12 text-gray-500">Loading contact information...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Page Header</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (234) 567-890"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location Description</label>
                    <input
                      type="text"
                      value={formData.locationDescription}
                      onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
                      placeholder="Available for international assignments"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* EmailJS Configuration Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">EmailJS Configuration</h2>
                <p className="text-sm text-gray-600 mb-4">Configure EmailJS settings for the contact form. Get your credentials from <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">emailjs.com</a></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service ID *</label>
                    <input
                      type="text"
                      value={formData.emailjsServiceId}
                      onChange={(e) => setFormData({ ...formData, emailjsServiceId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template ID *</label>
                    <input
                      type="text"
                      value={formData.emailjsTemplateId}
                      onChange={(e) => setFormData({ ...formData, emailjsTemplateId: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Public Key *</label>
                    <input
                      type="text"
                      value={formData.emailjsPublicKey}
                      onChange={(e) => setFormData({ ...formData, emailjsPublicKey: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email *</label>
                    <input
                      type="email"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleInitialize}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Reset to Defaults
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminContactPage() {
  return (
    <AdminAuthWrapper>
      <AdminContact />
    </AdminAuthWrapper>
  )
}
