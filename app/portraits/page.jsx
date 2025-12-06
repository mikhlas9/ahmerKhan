"use client"
import Image from "next/image"
import { useState } from "react"

export default function Portraits() {
    const [fullscreenImage, setFullscreenImage] = useState(null)

    const portraits = [
        { id: 1, src: "/images/po1.png", alt: "Portrait 1", width: 400, height: 600 },
        { id: 2, src: "/images/po2.png", alt: "Portrait 2", width: 600, height: 600 },
        { id: 3, src: "/images/po3.png", alt: "Portrait 3", width: 500, height: 400 },
        { id: 4, src: "/images/po4.png", alt: "Portrait 4", width: 600, height: 400 },
        { id: 5, src: "/images/po5.png", alt: "Portrait 5", width: 400, height: 600 },
        { id: 6, src: "/images/po6.png", alt: "Portrait 6", width: 500, height: 400 },
        { id: 7, src: "/images/po7.png", alt: "Portrait 7", width: 500, height: 500 },
        { id: 8, src: "/images/po8.png", alt: "Portrait 8", width: 600, height: 500 }
    ]

    const countryProjects = [
        { id: 1, name: "Bangladesh", image: "/images/poc1.png", link: "#" },
        { id: 2, name: "Afghanistan", image: "/images/poc2.png", link: "#" },
        { id: 3, name: "Sri Lanka", image: "/images/poc3.png", link: "#" },
        { id: 4, name: "South Korea", image: "/images/poc4.png", link: "#" }
    ]

    const openFullscreen = (imageSrc) => {
        setFullscreenImage(imageSrc)
    }

    const closeFullscreen = () => {
        setFullscreenImage(null)
    }

  return (
    <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase">
                        Portraits
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl">
                        A collection of portrait work documenting lives affected by conflict and humanitarian challenges. These portraits capture the human stories at the heart of investigative journalism.
                    </p>
                </div>
            </section>

            {/* Portraits Gallery - CSS Columns Masonry */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
                        {portraits.map((portrait) => (
                            <div
                                key={portrait.id}
                                className="break-inside-avoid mb-4 md:mb-6 cursor-pointer group relative"
                                onClick={() => openFullscreen(portrait.src)}
                            >
                                <div className="relative overflow-hidden rounded-xl">
                                    <Image
                                        src={portrait.src}
                                        alt={portrait.alt}
                                        width={portrait.width}
                                        height={portrait.height}
                                        className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-105"
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Country Projects Section with Curved Top */}
            <section className="relative bg-[#f5f1e8] pb-24">
                {/* Curved Top Border */}
                <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-16 md:h-24"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z"
                            fill="#f5f1e8"
                        />
                    </svg>
                </div>

                <div className="pt-24 md:pt-32 px-6 md:px-8">
                    <div className="max-w-7xl mx-auto">
                      

                        {/* Country Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {countryProjects.map((country) => (
                                <div
                                    key={country.id}
                                    onClick={() => openFullscreen(country.image)}
                                    className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                                >
                                    <Image
                                        src={country.image}
                                        alt={country.name}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    
                                    {/* Country Name with Search Icon on Hover */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        {/* Search Icon - appears on hover above text */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out transform translate-y-4 group-hover:translate-y-0 mb-4">
                                            <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                <svg
                                                    className="w-5 h-5 text-gray-900"
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
                                        <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide text-center px-4 drop-shadow-2xl">
                                            {country.name}
                                        </h3>
                                    </div>

                                    {/* Hover Border Effect */}
                                    <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 transition-all duration-500 rounded-2xl" />
                                </div>
                            ))}
                        </div>
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