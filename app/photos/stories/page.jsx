"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPhotos, PHOTO_TYPES } from "@/lib/photos"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Stories() {
  const router = useRouter()
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [fullscreenData, setFullscreenData] = useState(null) // { currentIndex, allImages, storyHeading }
  const [isClosing, setIsClosing] = useState(false)
  const [imageChanging, setImageChanging] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  useEffect(() => {
    async function fetchStories() {
      try {
        const data = await getPhotos(PHOTO_TYPES.STORY)
        setStories(data)
      } catch (error) {
        console.error('Error loading stories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStories()
  }, [])

  // Filter out stories without images
  const validStories = stories.filter(story => 
    story.images && Array.isArray(story.images) && story.images.length > 0
  )

  // Generate slug from story heading
  const generateSlug = (heading) => {
    return heading
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
  }

  // Get images from a specific story for fullscreen gallery
  const getStoryImages = (storyIndex) => {
    const story = validStories[storyIndex]
    if (!story) return []
    
    return story.images.map((img, imgIndex) => ({
      src: img,
      storyIndex,
      imageIndex: imgIndex,
      storyHeading: story.heading
    }))
  }

  const openFullscreen = (storyIndex, imageIndex) => {
    const story = validStories[storyIndex]
    if (!story) return
    
    const slug = generateSlug(story.heading)
    
    // Navigate directly to slug page without showing modal here
    router.push(`/photos/stories/${slug}`)
  }

  const closeFullscreen = () => {
    setIsClosing(true)
    setTimeout(() => {
    setFullscreenData(null)
      setIsClosing(false)
    // Reset URL to base stories page
    router.push('/photos/stories')
    }, 300) // Match transition duration
  }

  const handleShare = async () => {
    if (!fullscreenData) return
    
    const slug = generateSlug(fullscreenData.storyHeading)
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/photos/stories/${slug}`
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: fullscreenData.storyHeading,
          url: url
        })
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(url)
          alert('Link copied to clipboard!')
        }
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const goToPreviousImage = () => {
    if (!fullscreenData) return
    setImageChanging(true)
    setTimeout(() => {
    const newIndex = fullscreenData.currentIndex === 0 
      ? fullscreenData.allImages.length - 1 
      : fullscreenData.currentIndex - 1
    setFullscreenData({ ...fullscreenData, currentIndex: newIndex })
      setTimeout(() => setImageChanging(false), 50)
    }, 150)
  }

  const goToNextImage = () => {
    if (!fullscreenData) return
    setImageChanging(true)
    setTimeout(() => {
    const newIndex = fullscreenData.currentIndex === fullscreenData.allImages.length - 1 
      ? 0 
      : fullscreenData.currentIndex + 1
    setFullscreenData({ ...fullscreenData, currentIndex: newIndex })
      setTimeout(() => setImageChanging(false), 50)
    }, 150)
  }

  const goToImage = (index) => {
    if (!fullscreenData) return
    if (index === fullscreenData.currentIndex) return
    setImageChanging(true)
    setTimeout(() => {
    setFullscreenData({ ...fullscreenData, currentIndex: index })
      setTimeout(() => setImageChanging(false), 50)
    }, 150)
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
    if (!touchStart || !touchEnd || !fullscreenData) return
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
    if (!fullscreenData) return

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
  }, [fullscreenData])

  if (loading) {
    return <LoadingSpinner text="Loading" />
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <section className="py-10 md:py-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl text-gray-500 md:text-4xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
            Stories
          </h1>
        </div>
      </section>

      {/* Stories List */}
      <section className="pb-24 px-3 md:px-4">
        <div className="max-w-6xl mx-3 md:mx-auto">
          {validStories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No stories found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {validStories.map((story, storyIndex) => {
            return (
                  <div
                    key={storyIndex}
                    className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                    onClick={() => openFullscreen(storyIndex, 0)}
                  >
                    {/* Story Image Preview - First image only */}
                    <div className="relative w-full aspect-[4/3] bg-gray-900 overflow-hidden">
                      {story.images && story.images.length > 0 && (
                      <Image
                          src={story.images[0]}
                          alt={story.heading}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      )}
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

                    {/* Text Content Box */}
                    <div className="p-4 md:p-5 space-y-2.5">
                      <h3 className="text-sm md:text-base font-medium text-gray-800 leading-[1.5]">
                    {story.heading}
                      </h3>
                      {story.paragraph && (
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {story.paragraph}
                  </p>
                      )}
                    </div>
                </div>
            )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {fullscreenData && fullscreenData.allImages.length > 0 && (
        <div
          className={`fixed inset-0 z-50 bg-white flex flex-col p-4 transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-95' : isOpening ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={closeFullscreen}
        >
          <div className="absolute top-4 right-4 flex gap-3 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleShare()
              }}
              className="text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Share story"
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
            <button
              onClick={closeFullscreen}
              className="text-gray-900 hover:text-gray-600 transition-colors cursor-pointer"
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
          </div>

          {/* Main Image Container with Navigation */}
          <div 
            className="relative flex-1 flex items-center justify-center min-h-0"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Left Navigation - Hidden on mobile */}
            {fullscreenData.allImages.length > 1 && (
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
            <div className="relative max-w-[95%] w-full h-full flex items-center justify-center">
              <Image
                key={fullscreenData.currentIndex}
                src={fullscreenData.allImages[fullscreenData.currentIndex].src}
                alt="Fullscreen view"
                width={1920}
                height={1080}
                className={`object-contain max-w-full max-h-full transition-opacity duration-300 ${
                  isClosing || imageChanging ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Right Navigation - Hidden on mobile */}
            {fullscreenData.allImages.length > 1 && (
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

          {/* Thumbnail Gallery */}
          {fullscreenData.allImages.length > 1 && (
            <div className="flex-shrink-0 flex justify-center px-4 py-2">
              <div className="flex gap-1.5 overflow-x-auto max-w-7xl" onClick={(e) => e.stopPropagation()}>
                {fullscreenData.allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToImage(index)
                    }}
                    className={`relative w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      index === fullscreenData.currentIndex
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
