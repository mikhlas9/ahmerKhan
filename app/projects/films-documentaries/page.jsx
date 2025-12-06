"use client"
import Image from "next/image"
import { useState } from "react"

export default function FilmsDocumentaries() {
    const [playingVideo, setPlayingVideo] = useState(null)

    const getYouTubeVideoId = (url) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
        return match ? match[1] : null
    }

    const films = [
        {
            id: 1,
            title: "Love Jihad in India's Uttar Pradesh",
            role: "Film Maker & Report",
            network: "TRT World",
            description: "Why has love become a crime in India's largest state? Uttar Pradesh's Hindutva far-right government is using recently enacted anti-conversion laws to target interfaith unions.",
            videoThumbnail: "https://img.youtube.com/vi/WXwcUK1-evo/maxresdefault.jpg",
            videoUrl: "https://www.youtube.com/watch?v=WXwcUK1-evo"
        },
        {
            id: 2,
            title: "India Burning",
            role: "Film Maker & Report",
            network: "Vice News",
            description: "India has been engulfed in riots after the world's biggest democracy suddenly stripped nearly two million people of their citizenship. As the nation's leaders ramp up Hindu nationalist rhetoric, a newly-enacted law has signaled to India's 200 million Muslims that they are the true target. This could mean that they end up in one of the brand-new detention camps quietly being constructed across the country.",
            videoThumbnail: "https://img.youtube.com/vi/MCyBL8dBOEo/maxresdefault.jpg",
            videoUrl: "https://www.youtube.com/watch?v=MCyBL8dBOEo"
        },
        {
            id: 3,
            title: "Defending Kashmir: Anchar's last stand against India's control",
            role: "Film Maker & Report",
            network: "The Guardian",
            description: "People living in the suburb of Anchar are battling to keep security forces out. Since India stripped Jammu and Kashmir of its special status, the disputed region has been on security lockdown. Anchar, part of the main city of Srinagar, is thought to be the only major pocket of resistance",
            videoThumbnail: "https://img.youtube.com/vi/_JtibKy_xkk/maxresdefault.jpg",
            videoUrl: "https://www.youtube.com/watch?v=_JtibKy_xkk"
        }
    ]

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase">
                        Films & Documentaries
                    </h1>
                    <p className="text-base md:text-lg font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Documentary films and video journalism exploring critical stories
                    </p>
                </div>
            </section>

            {/* Films Grid */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                    {films.map((film, index) => {
                        // id 1 (index 0) = left, id 2 (index 1) = right, id 3 (index 2) = left
                        const isLeft = index % 2 === 0

                        return (
                            <div key={film.id} className="w-full">
                                {/* Video-based Film Layout - Alternating */}
                                <div className={`flex flex-col md:flex-row gap-8 lg:gap-12 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                                    {/* Content */}
                                    <div className="w-full md:w-3/5 flex flex-col justify-center space-y-4">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-tight text-gray-900">
                                                {film.title}
                                            </h2>
                                            <div className="space-y-1">
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    Role: {film.role}
                                                </p>
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    Network: {film.network}
                                                </p>
                                            </div>
                                        </div>
                                        {film.description && (
                                            <p className="text-[16px] font-normal text-gray-800 leading-relaxed">
                                                {film.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Video Player */}
                                    <div className="w-full md:w-2/5 relative aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                                        {playingVideo === film.id ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(film.videoUrl)}?autoplay=1`}
                                                title={film.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 w-full h-full"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setPlayingVideo(film.id)}
                                                className="absolute inset-0 cursor-pointer group"
                                            >
                                                <img
                                                    src={film.videoThumbnail}
                                                    alt={film.title}
                                                    className="w-full h-full object-cover"
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
                                                            {film.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}

