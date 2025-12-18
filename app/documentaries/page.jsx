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
                    <h1 className="text-3xl text-gray-500 md:text-4xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
                        Documentaries
                    </h1>
                    {/* <p className="text-sm md:text-base font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Documentary films and video journalism exploring critical stories
                    </p> */}
                </div>
            </section>

            {/* Documentaries Grid - Card/Box Layout */}
            <section className="pb-24 px-3 md:px-4">
                <div className="max-w-6xl mx-3 md:mx-auto">
                    {documentaries.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No documentaries found. Add documentaries from the admin panel.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                            {documentaries.map((doc) => {
                                const videoId = getYouTubeVideoId(doc.videoUrl)
                                
                                return (
                                    <div key={doc.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                        {/* Video Thumbnail Box */}
                                        <div className="relative w-full aspect-video bg-gray-900">
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
                                                    {doc.customThumbnail || doc.videoThumbnail ? (
                                                        <Image
                                                            src={doc.customThumbnail || doc.videoThumbnail}
                                                            alt={doc.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-800" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Text Content Box */}
                                        <div className="p-4 md:p-5 space-y-2.5">
                                            <p className="text-xs md:text-sm font-medium text-gray-900 uppercase tracking-wide">
                                                {doc.outlet}
                                            </p>
                                            <h3 className="text-sm md:text-base font-normal text-gray-800 leading-[1.5]">
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

