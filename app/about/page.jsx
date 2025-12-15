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
                    <h1 className="text-4xl md:text-5xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
                        About
                    </h1>
                </div>
            </section>

            {/* About Section */}
            <section className="pb-12 md:pb-16 px-6 md:px-8">
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

            {/* Divider Line */}
            <section className="px-6 md:px-8">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="border-t border-gray-300 w-full max-w-2xl"></div>
                </div>
            </section>

            {/* Media Coverage Section */}
            <section className="py-8 md:py-12 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-medium mb-6 text-black uppercase tracking-wide">
                        MEDIA COVERAGE
                    </h2>
                    <div className="space-y-3">
                        <a 
                            href="https://www.livemint.com/mint-lounge/features/emmy-2020-meet-kashmiri-journalist-ahmer-khan-nominated-for-a-caa-documentary/amp-11600604947598.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-gray-900 text-base md:text-lg hover:text-gray-700 transition-colors cursor-pointer group"
                        >
                            <span>Mint, 2020</span>
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                        <a 
                            href="https://www.theweek.in/leisure/society/2020/10/18/covering-other-humanitarian-stories-helped-me-process-the-trauma-of-jandk-my-homeland.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-gray-900 text-base md:text-lg hover:text-gray-700 transition-colors cursor-pointer group"
                        >
                            <span>The Week, 2020</span>
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                        <a 
                            href="https://globalindiannetwork.com/indias-fake-news-crisis-with-ahmer-khan/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between text-gray-900 text-base md:text-lg hover:text-gray-700 transition-colors cursor-pointer group"
                        >
                            <span>Global Indian Network, 2020</span>
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    )
}
