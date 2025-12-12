"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getDocumentaries } from "@/lib/documentaries"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Documentaries() {
    const [playingVideo, setPlayingVideo] = useState(null)
    const [documentaries, setDocumentaries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchDocumentaries() {
            try {
                const data = await getDocumentaries()
                setDocumentaries(data)
            } catch (error) {
                console.error('Error loading documentaries:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDocumentaries()
    }, [])

    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
        return match ? match[1] : null
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-10 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-wide uppercase leading-tight">
                        Documentaries
                    </h1>
                    <p className="text-sm md:text-base font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Documentary films and video journalism exploring critical stories
                    </p>
                </div>
            </section>

            {/* Documentaries Grid */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {documentaries.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No documentaries found. Add documentaries from the admin panel.
                        </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                            {documentaries.map((doc) => {
                                const videoId = getYouTubeVideoId(doc.videoUrl)
                                
                                return (
                                  <div key={doc.id} className="space-y-6">
                                        {/* Video Player */}
                                        <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                                            {playingVideo === doc.id ? (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                                    title={doc.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => setPlayingVideo(doc.id)}
                                                    className="absolute inset-0 cursor-pointer group"
                                                >
                                                    {doc.videoThumbnail ? (
                                                        <Image
                                                            src={doc.videoThumbnail}
                                                            alt={doc.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-800" />
                                                    )}
                                                    {/* Video Overlay with gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                                                        {/* Play Button */}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                                                <svg
                                                                    className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Outlet and Title */}
                                        <div className="space-y-2.5 text-center pt-3">
                                            <p className="text-sm md:text-[15px] font-bold text-gray-900 uppercase tracking-wide">
                                                {doc.outlet}
                                            </p>
                                            <h3 className="text-[15px] md:text-lg font-normal text-gray-800 leading-[1.6] max-w-md mx-auto">
                                                {doc.title}
                                            </h3>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

