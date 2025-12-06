"use client"
import Image from "next/image"
import { useState } from "react"

export default function Awards() {
    const [playingVideo, setPlayingVideo] = useState(null)
    const [fullscreenImage, setFullscreenImage] = useState(null)

    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
        return match ? match[1] : null
    }

    const openFullscreen = (imageSrc) => {
        setFullscreenImage(imageSrc)
    }

    const closeFullscreen = () => {
        setFullscreenImage(null)
    }

    const awards = [
        {
            id: 1,
            year: "2018",
            award: "Lorenzo Natali Price",
            title: "A school under metro bridge teaches Delhi children",
            outlet: "RFI",
            description: "There are millions of children of primary-school age in India who don't attend school. For some, school is too far away, others have to work at home and some can't afford to go.",
            image: "/images/a1.png",
            videoUrl: null
        },
        {
            id: 2,
            year: "2019",
            award: "AFP's Kate Webb Prize",
            title: "Kashmir Reporting",
            outlet: "AFP",
            description: "Honoured for a series of video and written reports that vividly illustrated the impact on locals in the Muslim-majority area following India's decision to strip occupied Kashmir of its special status in August of last year.",
            image: "/images/a2.png",
            videoUrl: null
        },
        {
            id: 3,
            year: "2020",
            award: "Edward R. Murrow & Rory Peck Award",
            title: "India Burning",
            outlet: "VICE News",
            description: "Riots in India, citizenship stripping, Hindu nationalist rhetoric, and the targeting of 200 million Muslims for potential detention camps.",
            videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
            videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo",
            image: null
        },
      
        {
            id: 4,
            year: "2020",
            award: "Human Rights Press Award",
            title: "Defending Kashmir, Short film",
            outlet: "The Guardian",
            description: "People in Anchar battling security forces after Jammu and Kashmir's special status was revoked, leading to a security lockdown.",
            videoThumbnail: "https://img.youtube.com/vi/_JtibKy_xkk/maxresdefault.jpg",
            videoUrl: "https://www.youtube.com/watch?v=_JtibKy_xkk",
            image: null
        },
        {
            id: 5,
            year: "2021",
            award: "Lovei Award",
            title: "Love Jihad in India's Uttar Pradesh",
            outlet: "TRT World",
            description: "Why has love become a crime in India's largest state? Uttar Pradesh's Hindutva far-right government is using recently enacted anti-conversion laws to target interfaith unions.",
            videoThumbnail: "https://img.youtube.com/vi/WXwcUK1-evo/maxresdefault.jpg",
            videoUrl: "https://www.youtube.com/watch?v=WXwcUK1-evo",
            image: null
        },
        {
            id: 6,
            year: "2023",
            award: "Martin Adler Prize",
            quote: "Ahmer Khan's journalism sheds light on some of the toughest and most heated issues in India, while his writing shows impact and sensitivity. He tackled one of the most difficult stories in one of the most difficult places. It's fearless reporting at its best.",
            attribution: "Martin Adler Prize Jury",
            image: "/images/a3.jpeg"
        }
    ]

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-16 md:py-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase">
                        Awards & Recognition
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl">
                        Honored for outstanding journalism and storytelling that brings critical stories to light
                    </p>
                </div>
            </section>

            {/* Awards Grid */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                    {awards.map((award, index) => {
                        const isEven = index % 2 === 1
                        const imageLeft = !isEven

                        return (
                            <div key={award.id} className="w-full">
                                {award.image && !award.videoUrl ? (
                                    // Image-based Award Layout - Alternating
                                    <div className={`flex flex-col md:flex-row gap-8 lg:gap-12 ${imageLeft ? '' : 'md:flex-row-reverse'}`}>
                                        {/* Image */}
                                        <div 
                                            className="w-full md:w-1/2 relative aspect-video bg-[#f5f1e8] cursor-pointer group"
                                            onClick={() => openFullscreen(award.image)}
                                        >
                                            <Image
                                                src={award.image}
                                                alt={award.title || award.award}
                                                fill
                                                className="object-cover"
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

                                        {/* Content */}
                                        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-base md:text-lg font-bold text-gray-900">
                                                    {award.year}, {award.award}
                                                </p>
                                                {award.title && (
                                                    <h2 className="text-lg md:text-xl font-medium italic text-gray-900">
                                                        {award.title}{award.outlet && `, ${award.outlet}`}
                                                    </h2>
                                                )}
                                            </div>
                                            {award.description && (
                                                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                    {award.description}
                                                </p>
                                            )}
                                            {award.quote && (
                                                <div className="space-y-2">
                                                    <p className="text-[16px] font-normal text-gray-800 leading-relaxed italic">
                                                        "{award.quote}"
                                                    </p>
                                                    {award.attribution && (
                                                        <p className="text-sm font-medium text-gray-700">
                                                            -{award.attribution}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : award.videoUrl ? (
                                    // Video-based Award Layout - Alternating
                                    <div className={`flex flex-col lg:flex-row gap-8 lg:gap-12 bg-[#f5f1e8] p-8 md:p-12 lg:p-16 ${imageLeft ? '' : 'lg:flex-row-reverse'}`}>
                                        {/* Content */}
                                        <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-base md:text-lg font-bold text-gray-900">
                                                    {award.year}, {award.award}
                                                    {award.status && ` - ${award.status}`}
                                                </p>
                                                <h2 className="text-lg md:text-xl font-medium italic text-gray-900">
                                                    {award.title}
                                                </h2>
                                                {award.outlet && (
                                                    <p className="text-sm md:text-base font-medium text-gray-700">
                                                        {award.outlet}
                                                    </p>
                                                )}
                                            </div>
                                            {award.description && (
                                                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                    {award.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Video Player */}
                                        <div className="w-full lg:w-1/2 relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                                            {playingVideo === award.id ? (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(award.videoUrl)}?autoplay=1`}
                                                    title={award.title}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0 w-full h-full"
                                                />
                                            ) : (
                                                <div
                                                    onClick={() => setPlayingVideo(award.id)}
                                                    className="absolute inset-0 cursor-pointer group"
                                                >
                                                    <Image
                                                        src={award.videoThumbnail}
                                                        alt={award.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {/* Video Overlay with gradient */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                                                        {/* Play Button */}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                                                <svg
                                                                    className="w-8 h-8 text-white ml-1"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Top bar with Watch on YouTube */}
                                                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                                    </svg>
                                                                </div>
                                                                <span className="text-white text-sm font-medium">Watch on YouTube</span>
                                                            </div>
                                                            <button className="text-white hover:text-gray-300">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                                </svg>
                                                            </button>
                                                        </div>

                                                        {/* Bottom title */}
                                                        <div className="absolute bottom-4 left-4 right-4">
                                                            <h3 className="text-white text-base md:text-lg font-semibold drop-shadow-lg">
                                                                {award.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    // Text-only Award Layout
                                    <div className="bg-[#f5f1e8] p-8 md:p-12 lg:p-16">
                                        <div className="space-y-4">
                                            <p className="text-base md:text-lg font-bold text-gray-900">
                                                {award.year}, {award.award}
                                            </p>
                                            {award.title && (
                                                <h2 className="text-lg md:text-xl font-medium italic text-gray-900">
                                                    {award.title}
                                                </h2>
                                            )}
                                            {award.outlet && (
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    {award.outlet}
                                                </p>
                                            )}
                                            {award.description && (
                                                <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                    {award.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Recognition Section */}
            <section className="pb-24 px-6 md:px-8 bg-[#f5f1e8] py-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 uppercase text-center">
                        Recognition
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            {
                                id: 7,
                                year: "2020",
                                award: "Emmy Awards",
                                title: "India Burning",
                                status: "Finalist",
                                videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
                                videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo"
                            },
                            {
                                id: 8,
                                year: "2021",
                                award: "Scripps Howard Award",
                                title: "India Burning",
                                status: "Finalist",
                                videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
                                videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo"
                            },
                            {
                                id: 9,
                                year: "2022",
                                award: "Emmy Awards",
                                title: "Inside India's Covid Hell",
                                status: "Finalist",
                                videoThumbnail: "https://img.youtube.com/vi/myb8GxLLpT0/maxresdefault.jpg",
                                videoUrl: "https://www.youtube.com/watch?v=myb8GxLLpT0"
                            }
                        ].map((award) => (
                            <div key={award.id} className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-base md:text-lg font-bold text-gray-900">
                                        {award.year}, {award.award}
                                    </p>
                                    <p className="text-lg md:text-xl font-medium italic text-gray-900">
                                        {award.status}: {award.title}
                                    </p>
                                </div>
                                <div className="relative aspect-video bg-gray-900 cursor-pointer group rounded-lg overflow-hidden shadow-xl" onClick={() => setPlayingVideo(award.id)}>
                                    {playingVideo === award.id ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(award.videoUrl)}?autoplay=1`}
                                            title={award.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                        />
                                    ) : (
                                        <>
                                            <Image
                                                src={award.videoThumbnail}
                                                alt={award.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                                                {/* Play Button */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                                                        <svg
                                                            className="w-8 h-8 text-white ml-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                
                                                {/* Top bar */}
                                                <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                            </svg>
                                                        </div>
                                                        <span className="text-white text-xs font-medium">Watch on YouTube</span>
                                                    </div>
                                                </div>

                                                {/* Bottom title */}
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <h3 className="text-white text-sm font-semibold drop-shadow-lg">
                                                        {award.title}
                                                    </h3>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
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