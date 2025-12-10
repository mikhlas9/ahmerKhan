"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { getHomepageData } from "@/lib/homepage"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Home() {
  const [homepageData, setHomepageData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHomepageData()
        setHomepageData(data)
      } catch (error) {
        console.error('Error loading homepage:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Show loading state
  if (loading) {
    return <LoadingSpinner />
  }

  // Show error state if data failed to load
  if (!homepageData) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500">Failed to load homepage data</div>
          <div className="text-gray-500 text-sm">Please try refreshing the page</div>
        </div>
      </main>
    )
  }

  const data = homepageData

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero section with portrait */}
      <section className="py-7 md:py-16 px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl w-full space-y-12">
          {/* Name and title */}
          <div className="text-center space-y-6">
            <h1 className="text-7xl md:text-8xl font-bold tracking-wider leading-tight">
              {data.name}
            </h1>
            <p className="text-[14px] leading-[25px] font-normal tracking-widest text-gray-600 uppercase">
              {data.title}
            </p>
          </div>

          {/* Professional portrait */}
          <div className="relative w-full h-80 md:h-[720px] rounded-sm overflow-hidden shadow-lg">
            <Image 
              src={data.portraitImage} 
              alt={`${data.name} portrait`} 
              fill 
              className="object-cover" 
              priority 
            />
          </div>

          {/* Brief bio */}
          <div className="text-center space-y-6 text-size-26px font-normal leading-relaxed text-gray-700">
            <div>
              {Array.isArray(data.bio) ? (
                // If bio is an array, render each paragraph
                data.bio.map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : ""}>
                    {paragraph}
                  </p>
                ))
              ) : (
                // Fallback if bio is a string
                <p>{data.bio}</p>
              )}
            </div>
            <p className="text-gray-500">{data.credentials}</p>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center pt-1">
            <div className="text-center text-sm font-light text-gray-400">
              <div className="animate-bounce">↓</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
