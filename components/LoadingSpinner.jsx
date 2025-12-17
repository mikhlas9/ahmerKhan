export default function LoadingSpinner({ text = "Loading" }) {
  return (
    <main className="min-h-screen bg-white text-black flex items-start justify-center pt-50 md:pt-50">
      <div className="flex flex-col items-center justify-center">
        {/* Name Text - Stacked */}
        <div className="text-center mb-2">
          <div className="text-lg md:text-xl font-normal tracking-wide text-gray-400 uppercase">
            AHMER
          </div>
          <div className="text-lg md:text-xl font-normal tracking-wide text-gray-400 uppercase">
            KHAN
          </div>
        </div>
        
        {/* Simple Spinner */}
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
        </div>
      </div>
    </main>
  )
}

