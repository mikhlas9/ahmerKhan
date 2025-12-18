"use client"
import { useState, useEffect } from "react"
import { getAwards } from "@/lib/awards"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Awards() {
    const [allAwards, setAllAwards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAwards() {
            try {
                // Fetch all awards without filtering by type
                const allAwardsData = await getAwards()
                
                // Awards are already sorted by order in getAwards()
                setAllAwards(allAwardsData)
            } catch (error) {
                console.error('Error loading awards:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAwards()
    }, [])

    if (loading) {
        return <LoadingSpinner text="Loading" />
    }

    // Get the first link if available
    const getFirstLink = (item) => {
        if (item.links && item.links.length > 0) {
            return item.links[0]
        }
        return null
    }

    // Render award content
    const renderAwardContent = (item) => {
        return (
            <>
                <span className="font-medium">{item.award}</span>
                {item.status && (
                    <span className="font-normal text-gray-700"> – {item.status}</span>
                )}
                {item.title && (
                    <span className="font-normal text-gray-700"> — {item.title}</span>
                )}
                {item.year && (
                    <span className="font-normal text-gray-700"> — {item.year}</span>
                )}
            </>
        )
    }

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-10 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl text-gray-500 md:text-4xl mb-2 md:mb-5 tracking-wide uppercase leading-tight">
                        Awards, Nominations & Honours
                    </h1>
                </div>
            </section>

            {/* Awards List Section */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {allAwards.length === 0 ? (
                        <p className="text-center text-gray-500">No awards found.</p>
                    ) : (
                        <div className="space-y-4">
                            {allAwards.map((item, idx) => {
                                const link = getFirstLink(item)
                                
                                if (link) {
                                    return (
                                        <div key={item.id || idx} className="border-b border-gray-200 pb-4">
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-900 text-sm md:text-base leading-tight hover:text-gray-600 transition-colors cursor-pointer block"
                                            >
                                                {renderAwardContent(item)}
                                            </a>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={item.id || idx} className="border-b border-gray-200 pb-4">
                                            <div className="text-gray-900 text-sm md:text-base leading-tight">
                                                {renderAwardContent(item)}
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    )}
                </div>
            </section>

        </main>
    )
}