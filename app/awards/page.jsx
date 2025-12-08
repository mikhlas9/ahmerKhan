"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getAwards, AWARD_TYPES } from "@/lib/awards"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Awards() {
    const [playingVideo, setPlayingVideo] = useState(null)
    const [fullscreenImage, setFullscreenImage] = useState(null)
    const [awards, setAwards] = useState([])
    const [recognitionAwards, setRecognitionAwards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAwards() {
            try {
                const [mainAwardsData, recognitionData] = await Promise.all([
                    getAwards(AWARD_TYPES.AWARD),
                    getAwards(AWARD_TYPES.RECOGNITION)
                ])
                setAwards(mainAwardsData)
                setRecognitionAwards(recognitionData)
            } catch (error) {
                console.error('Error loading awards:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAwards()
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
        return <LoadingSpinner text="Loading" />
    }

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase font-chonburi">
                        Awards & Recognition
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Honored for outstanding journalism and storytelling that brings critical stories to light
                    </p>
                </div>
            </section>

            {/* Awards Grid */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                    {awards.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No awards found. Add awards from the admin panel.
                        </div>
                    ) : (
                        awards.map((award, index) => {
                        // id 1 (index 0) = left, id 2 (index 1) = right, id 3 (index 2) = left, etc.
                        const isLeft = index % 2 === 0

                        return (
                            <div key={award.id} className="w-full">
                                {award.image && !award.videoUrl ? (
                                    // Image-based Award Layout - Alternating
                                    <div className={`flex flex-col md:flex-row gap-8 lg:gap-12 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                                        {/* Image */}
                                        <div 
                                            className="w-full md:w-2/5 relative aspect-video bg-[#fefbf5] cursor-pointer group rounded-lg overflow-hidden shadow-xl"
                                            onClick={() => openFullscreen(award.image)}
                                        >
                                            <Image
                                                src={award.image}
                                                alt={award.title || award.award}
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

                                        {/* Content */}
                                        <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-base md:text-lg font-bold text-gray-900">
                                                    {award.year}, {award.award}
                                                </p>
                                                {award.title && (
                                                    <h2 className="text-lg md:text-xl font-medium italic text-gray-900">
                                                        {award.title}{award.outlet && `, ${award.outlet}`}
                                                    </h2>
                                                )}
                                            </div>
                                            {award.description && (
                                                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                    {award.description}
                                                </p>
                                            )}
                                            {award.quote && (
                                                <div className="space-y-2">
                                                    <p className="text-[16px] font-normal text-gray-800 leading-relaxed italic">
                                                        "{award.quote}"
                                                    </p>
                                                    {award.attribution && (
                                                        <p className="text-sm font-medium text-gray-700">
                                                            -{award.attribution}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : award.videoUrl ? (
                                    // Video-based Award Layout - Alternating
                                    <div className={`flex flex-col md:flex-row gap-8 lg:gap-12 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Content */}
                                        <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-base md:text-lg font-bold text-gray-900">
                                                    {award.year}, {award.award}
                                                    {award.status && ` - ${award.status}`}
                                                </p>
                                                <h2 className="text-lg md:text-xl font-medium italic text-gray-900">
                                                    {award.title}
                                                </h2>
                                                {award.outlet && (
                                                    <p className="text-sm md:text-base font-medium text-gray-700">
                                                        {award.outlet}
                                                    </p>
                                                )}
                                            </div>
                                            {award.description && (
                                                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                    {award.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Video Player */}
                                        <div className="w-full md:w-2/5 relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                                            {playingVideo === award.id ? (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(award.videoUrl)}?autoplay=1`}
                                                    title={award.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => setPlayingVideo(award.id)}
                                                    className="absolute inset-0 cursor-pointer group"
                                                >
                                                    <Image
                                                        src={award.videoThumbnail}
                                                        alt={award.title}
                                                        fill
                                                        className="object-cover"
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
                                                                {award.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // Text-only Award Layout
                                    <div className="bg-[#fefbf5] p-8 md:p-12 lg:p-16">
                                        <div className="space-y-4">
                                            <p className="text-base md:text-lg font-bold text-gray-900">
                                                {award.year}, {award.award}
                                            </p>
                                            {award.title && (
                                                <h2 className="text-lg md:text-xl font-medium italic text-gray-900">
                                                    {award.title}
                                                </h2>
                                            )}
                                            {award.outlet && (
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    {award.outlet}
                                                </p>
                                            )}
                                            {award.description && (
                                                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                    {award.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }))}
                </div>
            </section>

            {/* Recognition Section */}
            <section className="pb-24 px-6 md:px-8 bg-[#ececf3] py-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-15 uppercase text-center">
                        Recognition
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {recognitionAwards.length === 0 ? (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No recognition awards found. Add awards from the admin panel.
                            </div>
                        ) : (
                            recognitionAwards.map((award) => (
                            <div key={award.id} className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-base md:text-lg font-bold text-gray-900">
                                        {award.year}, {award.award}
                                    </p>
                                    <p className="text-lg md:text-xl font-medium italic text-gray-900">
                                        {award.status}: {award.title}
                                    </p>
                                </div>
                                <div className="relative aspect-video bg-gray-900 cursor-pointer group rounded-lg overflow-hidden shadow-xl" onClick={() => setPlayingVideo(award.id)}>
                                    {playingVideo === award.id ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(award.videoUrl)}?autoplay=1`}
                                            title={award.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                        />
                                    ) : (
                                        <>
                                            <Image
                                                src={award.videoThumbnail}
                                                alt={award.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                                                {/* Play Button */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                                        <svg
                                                            className="w-8 h-8 text-white ml-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                
                                                {/* Top bar */}
                                                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                            </svg>
                                                        </div>
                                                        <span className="text-white text-xs font-medium">Watch on YouTube</span>
                                                    </div>
                                                </div>

                                                {/* Bottom title */}
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <h3 className="text-white text-sm font-semibold drop-shadow-lg">
                                                        {award.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            ))
                        )}
                    </div>
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