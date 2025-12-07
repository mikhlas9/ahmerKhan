"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, onAuthStateChange } from "@/lib/auth"

export default function AdminAuthWrapper({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check auth state
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setAuthenticated(true)
        setLoading(false)
      } else {
        setAuthenticated(false)
        setLoading(false)
        router.push("/login")
      }
    })

    // Also check current user immediately
    const user = getCurrentUser()
    if (user) {
      setAuthenticated(true)
      setLoading(false)
    }

    return () => unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null // Will redirect to login
  }

  return <>{children}</>
}

