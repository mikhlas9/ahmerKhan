"use client"
import { useState, useEffect } from "react"
import { getAbout } from "@/lib/about"
import LoadingSpinner from "@/components/LoadingSpinner"
import Image from "next/image"

export default function About() {
    const [aboutData, setAboutData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAbout() {
            try {
                const data = await getAbout()
                setAboutData(data)
            } catch (error) {
                console.error('Error loading about:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAbout()
    }, [])

    if (loading) {
        return <LoadingSpinner text="Loading" />
    }

    if (!aboutData) {
        return (
            <main className="min-h-screen bg-white text-black">
                {/* Header Section */}
                <section className="py-10 md:py-10 px-6 md:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl mb-3 tracking-wide uppercase leading-tight">
                            About
                        </h1>
                    </div>
                </section>
                <section className="pb-24 px-6 md:px-8">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-gray-500">About content not found.</p>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-10 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl  mb-5 tracking-wide uppercase leading-tight">
                        About
                    </h1>
                </div>
            </section>

            {/* About Section */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
                        {/* Photo on Left */}
                        <div className="w-full md:w-1/3 lg:w-2/5 flex-shrink-0">
                            <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden shadow-lg">
                                <Image 
                                    src={aboutData.imagePath || "/images/profile.jpeg"} 
                                    alt="Ahmer Khan" 
                                    fill 
                                    className="object-cover" 
                                    priority
                                />
                            </div>
                        </div>

                        {/* Text on Right */}
                        <div className="w-full md:w-2/3 lg:w-3/5 flex-1">
                            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                                {aboutData.bio ? (
                                    <div className="space-y-4 text-base md:text-lg">
                                        {Array.isArray(aboutData.bio) ? (
                                            aboutData.bio.map((paragraph, index) => (
                                                <p key={index} className="mb-4">
                                                    {paragraph}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="whitespace-pre-line">{aboutData.bio}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">No bio content available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
