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
    
    const storyImages = getStoryImages(storyIndex)
    const slug = generateSlug(story.heading)
    
    setFullscreenData({
      currentIndex: imageIndex >= 0 && imageIndex < storyImages.length ? imageIndex : 0,
      allImages: storyImages,
      storyHeading: story.heading
    })
    
    // Update URL to story slug page
    router.push(`/photos/stories/${slug}`)
  }

  const closeFullscreen = () => {
    setFullscreenData(null)
    // Reset URL to base stories page
    router.push('/photos/stories')
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
    const newIndex = fullscreenData.currentIndex === 0 
      ? fullscreenData.allImages.length - 1 
      : fullscreenData.currentIndex - 1
    setFullscreenData({ ...fullscreenData, currentIndex: newIndex })
  }

  const goToNextImage = () => {
    if (!fullscreenData) return
    const newIndex = fullscreenData.currentIndex === fullscreenData.allImages.length - 1 
      ? 0 
      : fullscreenData.currentIndex + 1
    setFullscreenData({ ...fullscreenData, currentIndex: newIndex })
  }

  const goToImage = (index) => {
    if (!fullscreenData) return
    setFullscreenData({ ...fullscreenData, currentIndex: index })
  }

  if (loading) {
    return <LoadingSpinner text="Loading" />
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <section className="py-10 md:py-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl text-gray-500 md:text-5xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
            Stories
          </h1>
        </div>
      </section>

      {/* Stories List */}
      <section className="pb-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {validStories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No stories found.
            </div>
          ) : (
            validStories.map((story, storyIndex) => {
            return (
              <article key={storyIndex} className="space-y-8">
                {/* Image Grid - 2 columns (only first 2 images) */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {story.images.slice(0, 2).map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative w-full aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
                      onClick={() => openFullscreen(storyIndex, imgIndex)}
                    >
                      <Image
                        src={img}
                        alt={`${story.heading} - Image ${imgIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
                  ))}
                </div>

                {/* Heading and Paragraph - Centered */}
                <div className="text-center space-y-4">
                  {/* Heading */}
                  <h2 className="text-lg md:text-xl font-medium tracking-wide uppercase text-gray-800">
                    {story.heading}
                  </h2>

                  {/* Paragraph */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto text-center">
                    {story.paragraph}
                  </p>
                </div>
              </article>
            )
          }))}
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {fullscreenData && fullscreenData.allImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-white flex flex-col p-4"
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
          <div className="relative flex-1 flex items-center justify-center min-h-0">
            {/* Left Navigation */}
            {fullscreenData.allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPreviousImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200 z-10 cursor-pointer"
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
                src={fullscreenData.allImages[fullscreenData.currentIndex].src}
                alt="Fullscreen view"
                width={1920}
                height={1080}
                className="object-contain max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Right Navigation */}
            {fullscreenData.allImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200 z-10 cursor-pointer"
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
                        ? 'border-gray-900 ring-2 ring-gray-900'
                        : 'border-gray-300 hover:border-gray-600'
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
