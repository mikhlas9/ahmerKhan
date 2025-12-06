"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function PhotoStories() {
    const [fullscreenImage, setFullscreenImage] = useState(null)

    const openFullscreen = (imageSrc) => {
        setFullscreenImage(imageSrc)
    }

    const closeFullscreen = () => {
        setFullscreenImage(null)
    }

    const photoStories = [
        {
            id: 1,
            title: "On Kolkata's trams, a journey through the city's 'soul'",
            role: "Photo Journalist",
            network: "The Christian Science Monitor",
            description: "As electric trams slowly rumble through the vibrant neighborhoods of Kolkata, formerly known as Calcutta, they take the passengers on a journey back in time. Part of the cultural fabric of the city for more than a century, the tram system has been allowed to atrophy for a lack of riders. Now, enthusiasts and climate activists are fighting to keep tram service as an eco-friendly transportation option.",
            quote: "\"Trams are a great way to reduce emissions in the city,\" says Debasish Bhattacharyya, president of the Calcutta Tramways Users' Association (CTUA). \"In a time of climate crisis, we need to embrace modes of transport that are sustainable and efficient.\"",
            images: [
                "/images/ps1.png",
            ],
            readMoreLink: "https://www.csmonitor.com/The-Culture/2023/0420/In-Pictures-On-Kolkata-s-trams-a-journey-through-the-city-s-soul"
        },
        {
            id: 2,
            title: "'A dying art': India's female seaweed divers look to a brighter future for their girls",
            role: "Photographer",
            network: "The Guardian",
            description: "With sacks tied around their saris and well-used goggles as their only equipment, the seaweed collectors of India's south-east coast have been diving in the Gulf of Mannar for decades, passing skills from mother to daughter. The women spend six hours a day in the sea, diving up to 4 metres (13ft) to harvest the seaweed from sharp rocks, holding their breath as they tuck the fronds into bags tied around their waists.",
            images: [
                "/images/ps2.png",

            ],
            readMoreLink: "https://www.theguardian.com/global-development/2023/jun/30/dying-art-india-female-seaweed-divers-look-to-a-brighter-future-for-their-girls"
        },
        {
            id: 3,
            title: "'I trusted him': human trafficking surges in cyclone-hit east India",
            role: "Photographer",
            network: "The Guardian",
            description: "It began gently at first, as a romantic relationship with Rubik, an older man from out of town. He promised her a better life, away from the devastation that Cyclone Amphan had left in their village. But what started as hope quickly turned into a nightmare of exploitation and human trafficking. Already an area where destitution is rife, and about 50% live below the poverty line, the Sundarbans is now on the forefront of the climate crisis. It is the area of India most regularly affected by cyclones, including three super cyclones in the past four years that killed hundreds of people, decimated homes and livelihoods and left the land salinated and arid.",
            images: [
                "/images/ps3.png",
            ],
            readMoreLink: "https://www.theguardian.com/world/2023/jun/13/i-trusted-him-human-trafficking-surges-in-cyclone-hit-east-india"
        }
    ]

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase">
                        Photo Stories
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Visual narratives capturing human stories through photography
                    </p>
                </div>
            </section>

            {/* Photo Stories Grid */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                    {photoStories.map((story, index) => {
                        const isEven = index % 2 === 1
                        const imageLeft = !isEven

                        return (
                            <div key={story.id} className="w-full">
                                {/* Photo Story Layout - Alternating */}
                                <div className={`flex flex-col md:flex-row min-h-[600px] md:min-h-[700px] ${imageLeft ? '' : 'md:flex-row-reverse'}`}>
                                    {/* Content Area */}
                                    <div className="w-full md:w-2/3 bg-[#fefcf8] p-8 md:p-12 lg:p-16 flex flex-col justify-between order-1 md:order-2">
                                        <div className="space-y-6">
                                            {/* Main Headline */}
                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-tight text-gray-900">
                                                {story.title}
                                            </h2>

                                            {/* Role and Network */}
                                            <div className="space-y-1">
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    Role: {story.role}
                                                </p>
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    Network: {story.network}
                                                </p>
                                            </div>

                                            {/* Body Text */}
                                            <p className="text-[16px] md:text-[16px] font-normal text-gray-800 leading-relaxed max-w-2xl">
                                                {story.description}
                                            </p>

                                            {/* Quote if available */}
                                            {story.quote && (
                                                <div className="space-y-2 pt-4">
                                                    <p className="text-[16px] font-normal text-gray-800 leading-relaxed italic">
                                                        {story.quote}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Read More Button */}
                                        <div className="mt-8">
                                            <Link
                                                href={story.readMoreLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative inline-block bg-gray-800 text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-all duration-500 ease-in-out"
                                            >
                                                <span className="flex items-center gap-3 px-8 py-3 transition-all duration-500 ease-in-out group-hover:pr-14">
                                                    <span>READ MORE</span>
                                                    <svg
                                                        className="w-4 h-4 absolute right-5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-in-out"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Images Sidebar */}
                                    <div className="w-full md:w-1/3 bg-[#fefcf8] flex flex-col min-h-[400px] md:min-h-0 order-2 md:order-1">
                                        {/* Stacked Images */}
                                        <div className="flex-1 flex flex-col gap-1">
                                            {story.images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative flex-1 min-h-[200px] md:min-h-0 cursor-pointer group bg-gray-100 rounded-lg overflow-hidden"
                                                    onClick={() => openFullscreen(img)}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${story.title} - Image ${idx + 1}`}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                    {/* Fullscreen Icon on Hover */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 ease-out">
                                                            <svg
                                                                className="w-4 h-4 text-gray-900"
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
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
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

