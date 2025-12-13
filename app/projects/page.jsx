"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getProjects, PROJECT_CATEGORIES } from "@/lib/projects"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function Projects() {
    const [playingVideo, setPlayingVideo] = useState(null)
    const [fullscreenImage, setFullscreenImage] = useState(null)
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProjects() {
            try {
                const data = await getProjects(PROJECT_CATEGORIES.ALL)
                setProjects(data)
            } catch (error) {
                console.error('Error loading projects:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

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

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Header Section */}
            <section className="py-10 md:py-16 px-6 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl tracking-tight mb-6 uppercase">
                        My Work
                    </h1>
                    <p className="text-sm md:text-base font-normal text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        Documenting conflict, resilience, and human stories through investigative journalism and visual storytelling
                    </p>
                </div>
            </section>


            {/* Projects Grid */}
            <section className="pb-24 px-6 md:px-8">
                <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
                    {projects.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No projects found. Add projects from the admin panel.
                        </div>
                    ) : (
                        projects.map((project) => (
                        <div key={project.id} className="w-full">
                            {project.type === "photo" ? (
                                // Photo Journalist Layout - Split with dark sidebar and content area
                                <div className="flex flex-col md:flex-row min-h-[600px] md:min-h-[700px]">
                                    {/* Content Area - Shows first on mobile */}
                                    <div className="w-full md:w-2/3 bg-[#fdfdfd] p-8 md:p-12 lg:p-16 flex flex-col justify-between order-1 md:order-2">
                                        <div className="space-y-6">
                                            {/* Main Headline */}
                                            <h2 className="text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight leading-tight text-gray-900">
                                                {project.title}
                                            </h2>

                                            {/* Role and Network */}
                                            <div className="space-y-1">
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    Role: {project.role}
                                                </p>
                                                <p className="text-sm md:text-base font-medium text-gray-700">
                                                    Network: {project.network}
                                                </p>
                                            </div>

                                            {/* Body Text */}
                                            <p className="text-[16px] md:text-[16px] font-normal text-gray-800 leading-relaxed max-w-2xl">
                                                {project.description}
                                            </p>
                                        </div>

                                        {/* Read More Button */}
                                        <div className="mt-8">
                                            <Link
                                                href={project.readMoreLink}
                                                className="group relative inline-block bg-gray-800 text-white text-sm uppercase tracking-wide hover:bg-gray-900 transition-all duration-500 ease-in-out"
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

                                    {/* Images Sidebar - Shows after content on mobile */}
                                    <div className="w-full md:w-1/3 bg-[#fdfdfd] flex flex-col min-h-[400px] md:min-h-0 order-2 md:order-1">
                                        {/* Stacked Images */}
                                        <div className="flex-1 flex flex-col gap-1">
                                            {project.images.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative flex-1 min-h-[200px] md:min-h-0 cursor-pointer group"
                                                    onClick={() => openFullscreen(img)}
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${project.title} - Image ${idx + 1}`}
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
                            ) : (
                                // Video Journalist Layout - Text left, Video right
                                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[500px] bg-[#fdfdfd]">
                                    {/* Left Content */}
                                    <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 p-8 md:p-12 lg:p-16">
                                        {/* Main Heading */}
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight leading-tight text-gray-900">
                                            {project.title}
                                        </h2>

                                        {/* Role and Network */}
                                        <div className="space-y-1">
                                            <p className="text-sm md:text-base font-medium text-gray-700">
                                                Role: {project.role}
                                            </p>
                                            <p className="text-sm md:text-base font-medium text-gray-700">
                                                Network: {project.network}
                                            </p>
                                        </div>

                                        {/* Body Text */}
                                        <p className="text-[16px] md:text-[16px] font-normal text-gray-800 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Right Video Player */}
                                    <div className="w-full lg:w-1/2 relative aspect-video bg-gray-900">
                                        {playingVideo === project.id ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(project.videoUrl)}?autoplay=1`}
                                                title={project.videoTitle}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 w-full h-full"
                                            />
                                        ) : (
                                            <div
                                                onClick={() => setPlayingVideo(project.id)}
                                                className="absolute inset-0 cursor-pointer"
                                            >
                                                <Image
                                                    src={project.videoThumbnail}
                                                    alt={project.videoTitle}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {/* Video Overlay */}
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                                                        <svg
                                                            className="w-6 h-6 md:w-8 md:h-8 text-white ml-1"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {/* Video Title Overlay */}
                                                <div className="absolute top-4 left-4 right-4">
                                                    <p className="text-white text-sm md:text-base uppercase">
                                                        {project.videoTitle}
                                                    </p>
                                                </div>
                                                {/* VICE News Branding */}
                                                <div className="absolute top-4 right-4 text-white">
                                                    <p className="text-xs md:text-sm">VICE NEWS</p>
                                                    <p className="text-xs font-light">TONIGHT</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )))}
                </div>
            </section>

            {/* Project Categories Navigation */}
            <section className="py-12 md:py-16 px-6 md:px-8 bg-[#fdfdfd]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        <Link href="/projects/photo-stories" className="group">
                            <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4">
                                <Image
                                    src="/images/ps2.png"
                                    alt="Photo Stories"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm font-semibold">Photo Stories</p>
                                </div>
                            </div>
                            <p className="text-center text-sm md:text-base font-medium text-gray-900">Photo Stories</p>
                        </Link>
                        <Link href="/projects/films-documentaries" className="group">
                            <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4">
                                <Image
                                    src="/images/fd.png"
                                    alt="Films & Documentaries"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm font-semibold">Films & Documentaries</p>
                                </div>
                            </div>
                            <p className="text-center text-sm md:text-base font-medium text-gray-900">Films & Documentaries</p>
                        </Link>
                        <Link href="/projects/print-digital-features" className="group">
                            <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4">
                                <Image
                                    src="/images/pdf1.png"
                                    alt="Print & Digital Features"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm font-semibold">Print & Digital Features</p>
                                </div>
                            </div>
                            <p className="text-center text-sm md:text-base font-medium text-gray-900">Print & Digital Features</p>
                        </Link>
                        <Link href="/projects/global-assignments" className="group">
                            <div className="relative aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-4">
                                <Image
                                    src="/images/ga2.png"
                                    alt="Global Assignments"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm font-semibold">Global Assignments</p>
                                </div>
                            </div>
                            <p className="text-center text-sm md:text-base font-medium text-gray-900">Global Assignments</p>
                        </Link>
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