"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getTearsheets } from "@/lib/tearsheets"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Tearsheets() {
    const [fullscreenImage, setFullscreenImage] = useState(null)
    const [tearsheets, setTearsheets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchTearsheets() {
            try {
                const data = await getTearsheets()
                setTearsheets(data)
            } catch (error) {
                console.error('Error loading tearsheets:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTearsheets()
    }, [])

    const openFullscreen = (imageSrc) => {
        setFullscreenImage(imageSrc)
    }

    const closeFullscreen = () => {
        setFullscreenImage(null)
    }

    if (loading) {
        return <LoadingSpinner />
    }

  return (
    <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-4 md:px-6 ">
                <div className="max-w-[1600px] mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase">
                        Tearsheets
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Published work in leading international publications including National Geographic, The Guardian, BBC, Al Jazeera, and prestigious documentary film festivals showcasing investigative journalism and multimedia storytelling.
                    </p>
                </div>
            </section>

            {/* Tearsheets Gallery - CSS Columns Masonry */}
            <section className="py-12 md:py-16 px-4 md:px-6 ">
                <div className="max-w-[1600px] mx-auto">
                    {tearsheets.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No tearsheets found. Add tearsheets from the admin panel.
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 gap-4 md:gap-6">
                            {tearsheets.map((tearsheet) => (
                            <div
                                key={tearsheet.id}
                                className="break-inside-avoid mb-4 md:mb-6 cursor-pointer group relative"
                                onClick={() => openFullscreen(tearsheet.src)}
                            >
                                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-white">
                                    {/* Paper texture border effect */}
                                    <div className="p-3 md:p-4 bg-white">
                                        <div className="relative overflow-hidden rounded-lg">
                                            <Image
                                                src={tearsheet.src}
                                                alt={tearsheet.alt || "Tearsheet"}
                                                width={tearsheet.width || 600}
                                                height={tearsheet.height || 800}
                                                className="w-full h-auto transition-all duration-700 ease-out group-hover:scale-105"
                                            />
                                            {/* Subtle overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
                                            
                                            {/* Fullscreen Icon on Hover */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                                <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 ease-out shadow-2xl">
                                                    <svg
                                                        className="w-7 h-7 text-gray-900"
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

                                    {/* Publication label */}
                                    {tearsheet.publication && (
                                        <div className="absolute top-6 right-6 md:top-7 md:right-7">
                                            <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold uppercase tracking-wide shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                                {tearsheet.publication}
          </div>
        </div>
      )}

                                    {/* Corner fold effect */}
                                    <div className="absolute top-3 right-3 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-gray-200 opacity-50" />
                                </div>
                            </div>
                            ))}
                        </div>
                    )}
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