"use client"
import { useState, useEffect } from "react"
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
        console.error('Error loading homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner text="Loading" />
  }

  const mediaType = homepageData?.mediaType || 'image'
  const mediaUrl = homepageData?.mediaUrl || '/images/home.jpeg'

  return (
    <main className="w-full bg-black">
      <div className="relative w-full h-[calc(100vh-100px)] min-h-[calc(100vh-100px)]">
        {mediaType === 'video' ? (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
            <Image 
            src={mediaUrl} 
            alt="Home" 
              fill 
            className="object-cover" 
              priority 
            />
              )}
            </div>
    </main>
  )
}
