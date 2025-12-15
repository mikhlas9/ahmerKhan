"use client"
import Image from "next/image"
import { useState } from "react"

export default function Singles() {
  const [fullscreenImage, setFullscreenImage] = useState(null)

  // Static portrait images for now
  const images = [
    { src: "/images/po1.png", alt: "Portrait 1" },
    { src: "/images/po2.png", alt: "Portrait 2" },
    { src: "/images/po3.png", alt: "Portrait 3" },
    { src: "/images/po4.png", alt: "Portrait 4" },
    { src: "/images/po5.png", alt: "Portrait 5" },
    { src: "/images/po6.png", alt: "Portrait 6" },
    { src: "/images/po7.png", alt: "Portrait 7" },
    { src: "/images/po8.png", alt: "Portrait 8" },
    { src: "/images/poc1.png", alt: "Portrait 9" },
    { src: "/images/poc2.png", alt: "Portrait 10" },
    { src: "/images/poc3.png", alt: "Portrait 11" },
    { src: "/images/poc4.png", alt: "Portrait 12" },
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
      <section className="py-10 md:py-10 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
            Singles
          </h1>
        </div>
      </section>

      {/* Gallery - CSS Columns Masonry */}
      <section className="pb-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="break-inside-avoid mb-4 md:mb-6 cursor-pointer group relative"
                onClick={() => openFullscreen(image.src)}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={500}
                    height={600}
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

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-gray-900 hover:text-gray-600 transition-colors z-10 cursor-pointer"
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
