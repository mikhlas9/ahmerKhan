"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getPhotos, PHOTO_TYPES } from "@/lib/photos"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function PhotosMonochrome() {
  const [fullscreenIndex, setFullscreenIndex] = useState(null)
  const [monochrome, setMonochrome] = useState([])
  const [loading, setLoading] = useState(true)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  useEffect(() => {
    async function fetchMonochrome() {
      try {
        const data = await getPhotos(PHOTO_TYPES.MONOCHROME)
        setMonochrome(data)
      } catch (error) {
        console.error('Error loading monochrome:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMonochrome()
  }, [])

  // Convert monochrome data to images format
  const images = loading ? [] : monochrome.map(item => ({
    src: item.src || "",
    alt: item.alt || "Monochrome",
    caption: item.caption || "",
    width: item.width || 500,
    height: item.height || 600
  })).filter(img => img.src) // Filter out items without src

  const openFullscreen = (image) => {
    const index = images.findIndex(img => img.src === image.src)
    setFullscreenIndex(index >= 0 ? index : 0)
  }

  const closeFullscreen = () => {
    setFullscreenIndex(null)
  }

  const goToPreviousImage = () => {
    if (fullscreenIndex === null) return
    const newIndex = fullscreenIndex === 0 ? images.length - 1 : fullscreenIndex - 1
    setFullscreenIndex(newIndex)
  }

  const goToNextImage = () => {
    if (fullscreenIndex === null) return
    const newIndex = fullscreenIndex === images.length - 1 ? 0 : fullscreenIndex + 1
    setFullscreenIndex(newIndex)
  }

  // Swipe gesture handlers for mobile
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    e.stopPropagation()
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    e.stopPropagation()
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (e) => {
    e.stopPropagation()
    if (!touchStart || !touchEnd || fullscreenIndex === null) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNextImage()
    }
    if (isRightSwipe) {
      goToPreviousImage()
    }
    
    // Reset touch values
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Keyboard navigation handlers
  useEffect(() => {
    if (fullscreenIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPreviousImage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextImage()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        closeFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullscreenIndex])

  if (loading) {
    return <LoadingSpinner text="Loading" />
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <section className="py-10 md:py-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl text-gray-500 md:text-4xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
            Monochrome
          </h1>
        </div>
      </section>

      {/* Gallery - CSS Columns Masonry */}
      <section className="pb-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {images.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No monochrome photos found.
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
              {images.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-4 md:mb-6 group"
              >
                <div className="cursor-pointer relative" onClick={() => openFullscreen(image)}>
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
              </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {fullscreenIndex !== null && images[fullscreenIndex] && (
        <div
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-gray-900 hover:text-gray-600 transition-colors z-20 cursor-pointer"
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

          {/* Main Image Container with Navigation */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Left Navigation - Hidden on mobile */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPreviousImage()
                }}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200 z-10 cursor-pointer"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Main Image */}
            <div className="relative max-w-7xl w-full h-full flex flex-col items-center justify-center">
              <div className="relative max-w-full max-h-[calc(100vh-120px)] flex items-center justify-center mb-4">
                <Image
                  src={images[fullscreenIndex].src}
                  alt="Fullscreen view"
                  width={1920}
                  height={1080}
                  className="object-contain max-w-full max-h-full"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {images[fullscreenIndex].caption && (
                <p className="text-sm text-gray-600 text-center leading-relaxed max-w-3xl px-4">
                  {images[fullscreenIndex].caption}
                </p>
              )}
            </div>

            {/* Right Navigation - Hidden on mobile */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNextImage()
                }}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200 z-10 cursor-pointer"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
