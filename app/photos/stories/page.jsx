"use client"
import Image from "next/image"
import { useState, useRef } from "react"

export default function Stories() {
  const stories = [
    {
      heading: "Story Title One",
      images: ["/images/po1.png", "/images/po2.png", "/images/po3.png"],
      paragraph: "This is a short paragraph describing the story. It captures the essence of the narrative and provides context for the images displayed above."
    },
    {
      heading: "Story Title Two",
      images: ["/images/po4.png", "/images/po5.png", "/images/po6.png"],
      paragraph: "Another compelling story with its own narrative. The images tell a visual story that complements the written description."
    },
    {
      heading: "Story Title Three",
      images: ["/images/po7.png", "/images/po8.png", "/images/poc1.png"],
      paragraph: "A third story showcasing different perspectives and moments captured through photography."
    }
  ]

  // State to track current image index for each story
  const [currentIndices, setCurrentIndices] = useState(
    stories.reduce((acc, _, index) => {
      acc[index] = 0
      return acc
    }, {})
  )
  const [fullscreenImage, setFullscreenImage] = useState(null)
  
  // Touch handling for swipe
  const touchStartX = useRef({})
  const touchStartY = useRef({})
  const touchEndX = useRef({})
  const touchEndY = useRef({})
  
  const minSwipeDistance = 50

  const goToPrevious = (storyIndex) => {
    const story = stories[storyIndex]
    setCurrentIndices((prev) => ({
      ...prev,
      [storyIndex]: prev[storyIndex] === 0 ? story.images.length - 1 : prev[storyIndex] - 1
    }))
  }

  const goToNext = (storyIndex) => {
    const story = stories[storyIndex]
    setCurrentIndices((prev) => ({
      ...prev,
      [storyIndex]: prev[storyIndex] === story.images.length - 1 ? 0 : prev[storyIndex] + 1
    }))
  }

  const onTouchStart = (e, storyIndex) => {
    touchStartX.current[storyIndex] = e.touches[0].clientX
    touchStartY.current[storyIndex] = e.touches[0].clientY
  }

  const onTouchMove = (e, storyIndex) => {
    touchEndX.current[storyIndex] = e.touches[0].clientX
    touchEndY.current[storyIndex] = e.touches[0].clientY
  }

  const onTouchEnd = (storyIndex) => {
    if (!touchStartX.current[storyIndex] || !touchEndX.current[storyIndex]) return
    
    const distanceX = touchStartX.current[storyIndex] - touchEndX.current[storyIndex]
    const distanceY = touchStartY.current[storyIndex] - touchEndY.current[storyIndex]
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)
    
    // Only handle horizontal swipes
    if (isVerticalSwipe) return
    
    if (isLeftSwipe) {
      goToNext(storyIndex)
    } else if (isRightSwipe) {
      goToPrevious(storyIndex)
    }
    
    // Reset touch positions
    touchStartX.current[storyIndex] = null
    touchEndX.current[storyIndex] = null
  }

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
            Stories
          </h1>
        </div>
      </section>

      {/* Stories List */}
      <section className="pb-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {stories.map((story, storyIndex) => {
            const currentImageIndex = currentIndices[storyIndex] || 0
            
            return (
              <article key={storyIndex} className="space-y-8">
                {/* Image Slider */}
                <div 
                  className="relative w-full h-[500px] md:h-[600px] overflow-hidden cursor-pointer group" 
                  onClick={() => openFullscreen(story.images[currentImageIndex])}
                  onTouchStart={(e) => onTouchStart(e, storyIndex)}
                  onTouchMove={(e) => onTouchMove(e, storyIndex)}
                  onTouchEnd={() => onTouchEnd(storyIndex)}
                >
                  {story.images.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        imgIndex === currentImageIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={img}
                          alt={`${story.heading} - Image ${imgIndex + 1}`}
                          fill
                          className="object-contain"
                        />
                        
                        {/* Fullscreen Icon on Hover - only shows on visible image */}
                        {imgIndex === currentImageIndex && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out pointer-events-none">
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
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Navigation Arrows */}
                  {story.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          goToPrevious(storyIndex)
                        }}
                        className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-1.5 rounded-full shadow-md transition-all duration-200 z-10 cursor-pointer opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          goToNext(storyIndex)
                        }}
                        className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-1.5 rounded-full shadow-md transition-all duration-200 z-10 cursor-pointer opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Heading and Paragraph - Centered */}
                <div className="text-center space-y-4">
                  {/* Heading */}
                  <h2 className="text-lg md:text-xl font-normal tracking-wide uppercase text-gray-800">
                    {story.heading}
                  </h2>

                  {/* Paragraph */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto text-left">
                    {story.paragraph}
                  </p>
                </div>
              </article>
            )
          })}
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
