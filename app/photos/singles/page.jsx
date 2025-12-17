"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getPhotos, PHOTO_TYPES } from "@/lib/photos"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Singles() {
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [singles, setSingles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSingles() {
      try {
        const data = await getPhotos(PHOTO_TYPES.SINGLE)
        setSingles(data)
      } catch (error) {
        console.error('Error loading singles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSingles()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Loading" />
  }

  // Convert singles data to images format
  const images = singles.map(item => ({
    src: item.src || "",
    alt: item.alt || "Single",
    width: item.width || 500,
    height: item.height || 600
  })).filter(img => img.src) // Filter out items without src

  const openFullscreen = (imageSrc) => {
    setFullscreenImage(imageSrc)
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <section className="py-10 md:py-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
            Singles
          </h1>
        </div>
      </section>

      {/* Gallery - CSS Columns Masonry */}
      <section className="pb-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No singles found.
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
              {images.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-4 md:mb-6 cursor-pointer group relative"
                onClick={() => openFullscreen(image.src)}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width || 500}
                    height={image.height || 600}
                    className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Fullscreen Icon on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 ease-out shadow-lg">
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-gray-900 hover:text-gray-600 transition-colors z-10 cursor-pointer"
            aria-label="Close fullscreen"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <Image
              src={fullscreenImage}
              alt="Fullscreen view"
              width={1920}
              height={1080}
              className="object-contain max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </main>
  )
}
