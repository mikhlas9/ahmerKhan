"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { getHomepageData } from "@/lib/homepage"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Home() {
  const [homepageData, setHomepageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHomepageData()
        setHomepageData(data)
      } catch (error) {
        console.error('Error loading homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVideoLoaded = () => {
    setVideoLoaded(true)
  }

  if (loading) {
    return <LoadingSpinner text="Loading" />
  }

  // Support both old and new data structure for backward compatibility
  const desktopVideoUrl = homepageData?.desktopVideoUrl || (homepageData?.mediaType === 'video' ? homepageData?.mediaUrl : '')
  const mobileImages = homepageData?.mobileImages || (homepageData?.mediaType === 'image' ? [homepageData?.mediaUrl || '/images/home.jpeg'] : ['/images/home.jpeg'])

  return (
    <main className="w-full bg-black">
      {/* Desktop: Show Video */}
      <div className="hidden md:block relative w-full h-screen min-h-screen">
        {desktopVideoUrl ? (
          <>
            {/* Show loading spinner with white background while video loads */}
            {!videoLoaded && (
              <div className="absolute inset-0 z-10 bg-white">
                <LoadingSpinner text="Loading" />
              </div>
            )}
            <video
              ref={videoRef}
              src={desktopVideoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onCanPlay={handleVideoLoaded}
              onLoadedData={handleVideoLoaded}
              className={`w-full h-full object-cover transition-opacity duration-300 ${videoLoaded ? 'relative z-0 opacity-100' : 'opacity-0 absolute'}`}
            />
            {/* Audio Toggle Button */}
            {videoLoaded && (
              <button
                onClick={toggleAudio}
                className="absolute bottom-6 right-6 z-20 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center"
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              >
                {isMuted ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            )}
          </>
        ) : (
          <Image 
            src={mobileImages[0] || '/images/home.jpeg'} 
            alt="Home" 
            fill 
            className="object-cover" 
            priority 
          />
        )}
      </div>

      {/* Mobile: Show Images (vertically stacked) */}
      <div className="md:hidden relative w-full">
        <div className="flex flex-col">
          {mobileImages.slice(0, 4).map((imageUrl, index) => (
            <div key={index} className="relative w-full aspect-[4/3]">
              <Image 
                src={imageUrl} 
                alt={`Home ${index + 1}`} 
                fill 
                className="object-cover" 
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
