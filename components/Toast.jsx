"use client"
import { useEffect } from "react"

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[90vw] ${
        type === "success" 
          ? "bg-green-500 text-white" 
          : "bg-red-500 text-white"
      }`}>
        <div className="flex-1 font-medium">{message}</div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold text-lg leading-none cursor-pointer"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}

