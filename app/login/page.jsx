"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, resetPassword, getCurrentUser } from "@/lib/auth"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push("/admin")
    }
  }, [router])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: "", text: "" })

    const result = await signIn(email, password)

    if (result.success) {
      setMessage({ type: "success", text: "Login successful! Redirecting..." })
      setTimeout(() => {
        router.push("/admin")
      }, 500)
    } else {
      setMessage({ type: "error", text: result.error })
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setIsResetting(true)
    setMessage({ type: "", text: "" })

    if (!resetEmail) {
      setMessage({ type: "error", text: "Please enter your email address" })
      setIsResetting(false)
      return
    }

    const result = await resetPassword(resetEmail)

    if (result.success) {
      setMessage({ type: "success", text: result.message })
      setShowForgotPassword(false)
      setResetEmail("")
    } else {
      setMessage({ type: "error", text: result.error })
    }
    setIsResetting(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Sign in to access the admin panel
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === "success" 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {!showForgotPassword ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true)
                    setMessage({ type: "", text: "" })
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            /* Forgot Password Form */
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors bg-white text-gray-900"
                  placeholder="Enter your email address"
                />
                <p className="mt-2 text-sm text-gray-600">
                  We'll send you a link to reset your password
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetEmail("")
                    setMessage({ type: "", text: "" })
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Journalist Portfolio Admin Panel</p>
        </div>
      </div>
    </main>
  )
}

