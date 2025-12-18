"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getVideoReports } from "@/lib/video-reports"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function VideoReports() {
    const [playingVideo, setPlayingVideo] = useState(null)
    const [videoReports, setVideoReports] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchVideoReports() {
            try {
                const data = await getVideoReports()
                setVideoReports(data)
            } catch (error) {
                console.error('Error loading video reports:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchVideoReports()
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
                        Video Reports
                    </h1>
                    {/* <p className="text-sm md:text-base font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Video journalism and news reports covering critical stories
                    </p> */}
                </div>
            </section>

            {/* Video Reports Grid - Card/Box Layout */}
            <section className="pb-24 px-3 md:px-4">
                <div className="max-w-6xl mx-3 md:mx-auto">
                    {videoReports.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No video reports found. Add video reports from the admin panel.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                            {videoReports.map((report) => {
                                const videoId = getYouTubeVideoId(report.videoUrl)
                                
                                return (
                                    <div key={report.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                        {/* Video Thumbnail Box */}
                                        <div className="relative w-full aspect-video bg-gray-900">
                                            {playingVideo === report.id ? (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                                    title={report.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => setPlayingVideo(report.id)}
                                                    className="absolute inset-0 cursor-pointer group"
                                                >
                                                    {report.customThumbnail || report.videoThumbnail ? (
                                                        <Image
                                                            src={report.customThumbnail || report.videoThumbnail}
                                                            alt={report.title}
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
                                            <p className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide">
                                                {report.outlet}
                                            </p>
                                            <h3 className="text-sm md:text-base font-normal text-gray-800 leading-[1.5]">
                                                {report.title}
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

