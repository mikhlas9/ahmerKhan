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

    // Helper function to render award links
    const renderLinks = (links) => {
        if (!links || links.length === 0) return null
        const getLinkLabel = (url) => {
            try {
                const urlObj = new URL(url)
                return urlObj.hostname.replace('www.', '')
            } catch {
                return 'Link'
            }
        }
        return (
            <div className="mt-3 flex flex-wrap gap-2">
                {links.map((link, idx) => (
                    <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-gray-700 hover:text-gray-900 border-b border-gray-300 hover:border-gray-600 transition-colors"
                    >
                        {getLinkLabel(link)}
                        <svg className="ml-1.5 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                ))}
            </div>
        )
    }

    // Helper function to split items into columns
    const splitIntoColumns = (items, numColumns = 3) => {
        const columns = Array.from({ length: numColumns }, () => [])
        items.forEach((item, index) => {
            columns[index % numColumns].push(item)
        })
        return columns
    }


    const columns = splitIntoColumns(allAwards, 3)

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-10 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl  mb-5 tracking-wide uppercase leading-tight">
                        Awards, Nominations & Honours
                    </h1>
                    {/* <p className="text-sm md:text-base font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Honored for outstanding journalism and storytelling that brings critical stories to light
                    </p> */}
                </div>
            </section>

            {/* Awards List Section */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {allAwards.length === 0 ? (
                        <p className="text-center text-gray-500">No awards found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {columns.map((column, colIdx) => (
                                <div key={colIdx} className="space-y-6">
                                    {column.map((item, idx) => (
                                        <div key={item.id || idx} className="space-y-1.5">
                                            <div className="text-gray-900 font-medium text-sm md:text-base leading-tight">
                                                {item.award}
                                                {item.status && (
                                                    <span className="text-gray-600"> - {item.status}</span>
                                                )}
                                            </div>
                                            {item.title && (
                                                <div className="text-sm text-gray-700 italic mt-1 leading-relaxed">
                                                    {item.title}
                                                </div>
                                            )}
                                            {item.outlet && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {item.outlet}
                                                </div>
                                            )}
                                            {item.year && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {item.year}
                                                </div>
                                            )}
                                            {item.description && (
                                                <div className="text-sm text-gray-600 mt-2 leading-relaxed">
                                                    {item.description}
                                                </div>
                                            )}
                                            {item.links && item.links.length > 0 && renderLinks(item.links)}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </main>
    )
}