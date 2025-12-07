export default function LoadingSpinner({ text = "Loading" }) {
  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Elegant Spinner */}
        <div className="relative w-20 h-20">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-gray-900 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          {/* Inner pulsing dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-gray-900 rounded-full animate-pulse"></div>
          </div>
        </div>
        {/* Loading text with fade animation */}
        <div className="text-xs font-light tracking-[0.3em] text-gray-400 uppercase animate-pulse">
          {text}
        </div>
      </div>
    </main>
  )
}

