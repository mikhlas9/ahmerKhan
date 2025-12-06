"use client"
import { useState, useEffect } from "react"

// EmailJS - Simplest email solution, no domain verification needed
// Get your credentials from https://www.emailjs.com/
const EMAILJS_SERVICE_ID = "service_2e9v7qm"
const EMAILJS_TEMPLATE_ID = "template_bs2ax69"
const EMAILJS_PUBLIC_KEY = "aZResZzNAe34lYH2k"

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })
    const [status, setStatus] = useState({ type: "", message: "" })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [emailjsLoaded, setEmailjsLoaded] = useState(false)

    // Load EmailJS script
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.emailjs) {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
            script.async = true
            script.onload = () => {
                if (window.emailjs) {
                    window.emailjs.init(EMAILJS_PUBLIC_KEY)
                    setEmailjsLoaded(true)
                }
            }
            document.body.appendChild(script)
        } else if (window.emailjs) {
            setEmailjsLoaded(true)
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setStatus({ type: "", message: "" })

        try {
            if (!emailjsLoaded || !window.emailjs) {
                throw new Error("Email service is not ready. Please refresh the page.")
            }

            // Send email using EmailJS
            const result = await window.emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: "mohammadikhlas99@gmail.com"
                }
            )

            if (result.text === 'OK') {
                setStatus({
                    type: "success",
                    message: "Thank you for your message! I'll get back to you soon."
                })
                
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                })
            } else {
                throw new Error("Failed to send message")
            }
        } catch (error) {
            console.error("Form submission error:", error)
            setStatus({
                type: "error",
                message: "Something went wrong. Please try again or email me directly at mohammadikhlas99@gmail.com"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

  return (
    <main className="min-h-screen bg-white text-black ">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-6 md:px-8 ">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase">
                        Get In Touch
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Available for editorial assignments, documentary projects, and speaking engagements. Let's collaborate on telling important stories.
                    </p>
          </div>
            </section>

            {/* Contact Content */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Contact Information - Left Side */}
                        <div className="space-y-8">
                            <div className="bg-[#f5f1e8] p-8 md:p-10 rounded-2xl">
                                <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tight">
                                    Contact Information
                                </h2>

          <div className="space-y-8">
                                    {/* Email */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
            <div>
                                            <h3 className="font-semibold text-gray-900 mb-2 uppercase text-sm tracking-wide">Email</h3>
                                            <a href="mailto:contact@example.com" className="text-gray-700 hover:text-gray-900 transition-colors text-base">
                                                contact@example.com
                                            </a>
                                        </div>
            </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2 uppercase text-sm tracking-wide">Phone</h3>
                                            <a href="tel:+1234567890" className="text-gray-700 hover:text-gray-900 transition-colors text-base">
                                                +1 (234) 567-890
                </a>
              </div>
            </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center shrink-0">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2 uppercase text-sm tracking-wide">Location</h3>
                                            <p className="text-gray-700 text-base">Based in South Asia</p>
                                            <p className="text-gray-700 text-sm mt-1">Available for international assignments</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form - Right Side */}
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900"
                                        placeholder="Your name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900"
                                        placeholder="What would you like to discuss?"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors resize-none bg-white text-gray-900"
                                        placeholder="Tell me about your project or inquiry..."
                                    />
                                </div>

                                {/* Status Message */}
                                {status.message && (
                                    <div className={`p-4 rounded-lg ${
                                        status.type === "success" 
                                            ? "bg-green-50 text-green-800 border border-green-200" 
                                            : "bg-red-50 text-red-800 border border-red-200"
                                    }`}>
                                        {status.message}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="group relative inline-block bg-gray-900 text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-all duration-500 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="flex items-center gap-3 px-8 py-4 transition-all duration-500 ease-in-out group-hover:pr-14">
                                        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                                        {!isSubmitting && (
                                            <svg
                                                className="w-4 h-4 absolute right-5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-in-out"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                </button>
                            </form>
                        </div>
          </div>
        </div>
      </section>
    </main>
  )
}