"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getPhotos, PHOTO_TYPES } from "@/lib/photos"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function StorySlugPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug || ''
  
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [fullscreenData, setFullscreenData] = useState(null)

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
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  // Get images from a specific story
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

  // Open story based on slug when stories are loaded
  useEffect(() => {
    if (!loading && slug && validStories.length > 0 && !fullscreenData) {
      const storyIndex = validStories.findIndex(story => 
        generateSlug(story.heading) === slug
      )
      if (storyIndex >= 0) {
        const storyImages = getStoryImages(storyIndex)
        setFullscreenData({
          currentIndex: 0,
          allImages: storyImages,
          storyHeading: validStories[storyIndex].heading
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, slug, validStories.length])

  const closeFullscreen = () => {
    setFullscreenData(null)
    router.push('/photos/stories')
  }

  const handleShare = async () => {
    if (!fullscreenData) return
    
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/photos/stories/${slug}`
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: fullscreenData.storyHeading,
          url: url
        })
      } catch (err) {
        console.log('Share cancelled or failed')
      }
    } else {
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

  // Only show fullscreen if we have the story loaded
  if (!fullscreenData || fullscreenData.allImages.length === 0) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Story not found</p>
          <button
            onClick={() => router.push('/photos/stories')}
            className="mt-4 text-gray-900 hover:text-gray-600 underline"
          >
            Back to Stories
          </button>
        </div>
      </main>
    )
  }

  return (
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
  )
}
