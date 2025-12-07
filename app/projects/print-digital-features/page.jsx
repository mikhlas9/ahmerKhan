"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getProjects, PROJECT_CATEGORIES } from "@/lib/projects"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function PrintDigitalFeatures() {
    const [playingVideo, setPlayingVideo] = useState(null)
    const [fullscreenImage, setFullscreenImage] = useState(null)
    const [features, setFeatures] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchFeatures() {
            try {
                const data = await getProjects(PROJECT_CATEGORIES.PRINT_DIGITAL_FEATURES)
                setFeatures(data)
            } catch (error) {
                console.error('Error loading features:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchFeatures()
    }, [])

    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
        return match ? match[1] : null
    }

    const openFullscreen = (imageSrc) => {
        setFullscreenImage(imageSrc)
    }

    const closeFullscreen = () => {
        setFullscreenImage(null)
    }

    if (loading) {
        return <LoadingSpinner />
    }

    // Fallback to empty array if no data
    const featuresList = features || []

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase">
                        Print & Digital Features
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Published work across print and digital platforms
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                    {featuresList.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No features found. Add projects from the admin panel.
                        </div>
                    ) : (
                        featuresList.map((feature, index) => {
                        // id 1 (index 0) = left, id 2 (index 1) = right, id 3 (index 2) = left
                        const isLeft = index % 2 === 0

                        return (
                            <div key={feature.id} className="w-full">
                                {feature.type === "photo" ? (
                                    // Photo-based Feature Layout
                                    <div className={`flex flex-col md:flex-row min-h-[600px] md:min-h-[700px] ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                                        {/* Content Area */}
                                        <div className="w-full md:w-2/3 bg-[#fdfdfd] p-8 md:p-12 lg:p-16 flex flex-col justify-between order-1 md:order-2">
                                            <div className="space-y-6">
                                                {/* Main Headline */}
                                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-tight text-gray-900">
                                                    {feature.title}
                                                </h2>

                                                {/* Role and Network */}
                                                <div className="space-y-1">
                                                    <p className="text-sm md:text-base font-medium text-gray-700">
                                                        Role: {feature.role}
                                                    </p>
                                                    <p className="text-sm md:text-base font-medium text-gray-700">
                                                        Network: {feature.network}
                                                    </p>
                                                </div>

                                                {/* Body Text */}
                                                <p className="text-[16px] md:text-[16px] font-normal text-gray-800 leading-relaxed max-w-2xl">
                                                    {feature.description}
                                                </p>
                                            </div>

                                            {/* Read More Button */}
                                            <div className="mt-8">
                                                <Link
                                                    href={feature.readMoreLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative inline-block bg-gray-800 text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-all duration-500 ease-in-out"
                                                >
                                                    <span className="flex items-center gap-3 px-8 py-3 transition-all duration-500 ease-in-out group-hover:pr-14">
                                                        <span>READ MORE</span>
                                                        <svg
                                                            className="w-4 h-4 absolute right-5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-in-out"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Image Sidebar */}
                                        <div className="w-full md:w-1/3 bg-[#fdfdfd] flex flex-col min-h-[400px] md:min-h-0 order-2 md:order-1">
                                            <div className="flex-1 flex flex-col gap-1">
                                                {(feature.images && feature.images.length > 0) ? (
                                                    feature.images.map((img, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="relative flex-1 min-h-[200px] md:min-h-0 cursor-pointer group bg-gray-100 rounded-lg overflow-hidden"
                                                            onClick={() => openFullscreen(img)}
                                                        >
                                                            <Image
                                                                src={img}
                                                                alt={`${feature.title} - Image ${idx + 1}`}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                            {/* Fullscreen Icon on Hover */}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 ease-out">
                                                                    <svg
                                                                        className="w-4 h-4 text-gray-900"
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
                                                    ))
                                                ) : (
                                                    <div className="relative flex-1 min-h-[200px] md:min-h-0 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-gray-400">No image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Video-based Feature Layout
                                    <div className={`flex flex-col md:flex-row gap-8 lg:gap-12 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                                        {/* Content */}
                                        <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-tight text-gray-900">
                                                    {feature.title}
                                                </h2>
                                                <div className="space-y-1">
                                                    <p className="text-sm md:text-base font-medium text-gray-700">
                                                        Role: {feature.role}
                                                    </p>
                                                    <p className="text-sm md:text-base font-medium text-gray-700">
                                                        Network: {feature.network}
                                                    </p>
                                                </div>
                                            </div>
                                            {feature.description && (
                                                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Video Player */}
                                        <div className="w-full md:w-2/5 relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                                            {playingVideo === feature.id ? (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(feature.videoUrl)}?autoplay=1`}
                                                    title={feature.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => setPlayingVideo(feature.id)}
                                                    className="absolute inset-0 cursor-pointer group"
                                                >
                                                    <img
                                                        src={feature.videoThumbnail}
                                                        alt={feature.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {/* Video Overlay with gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                                                        {/* Play Button */}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                                                <svg
                                                                    className="w-8 h-8 text-white ml-1"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Top bar with Watch on YouTube */}
                                                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                                    </svg>
                                                                </div>
                                                                <span className="text-white text-sm font-medium">Watch on YouTube</span>
                                                            </div>
                                                            <button className="text-white hover:text-gray-300">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Bottom title */}
                                                        <div className="absolute bottom-4 left-4 right-4">
                                                            <h3 className="text-white text-base md:text-lg font-semibold drop-shadow-lg">
                                                                {feature.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }))}
                </div>
            </section>

            {/* Fullscreen Image Modal */}
            {fullscreenImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={closeFullscreen}
                >
                    <button
                        onClick={closeFullscreen}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
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

