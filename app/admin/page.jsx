"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import AdminAuthWrapper from "@/components/AdminAuthWrapper"
import { signOutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { getProjects, PROJECT_CATEGORIES } from "@/lib/projects"
import { getAwards } from "@/lib/awards"
import { getTearsheets } from "@/lib/tearsheets"
import LoadingSpinner from "@/components/LoadingSpinner"

function AdminDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        projects: 0,
        awards: 0,
        tearsheets: 0,
        photoStories: 0
    })

    useEffect(() => {
        async function fetchStats() {
            try {
                const [allProjects, allAwards, allTearsheets, photoStories] = await Promise.all([
                    getProjects(null), // Get all projects
                    Promise.all([
                        getAwards('award'),
                        getAwards('recognition')
                    ]).then(results => results.flat()), // Get all awards
                    getTearsheets(),
                    getProjects(PROJECT_CATEGORIES.PHOTO_STORIES) // Get photo stories
                ])

                setStats({
                    projects: allProjects.length,
                    awards: allAwards.length,
                    tearsheets: allTearsheets.length,
                    photoStories: photoStories.length
                })
            } catch (error) {
                console.error('Error loading stats:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const handleLogout = async () => {
        const result = await signOutUser()
        if (result.success) {
            router.push("/login")
        }
    }

    if (loading) {
        return (
            <AdminAuthWrapper>
                <LoadingSpinner text="Loading" />
            </AdminAuthWrapper>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
                        <p className="text-sm text-gray-600">Manage your portfolio content</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>

                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Projects</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.projects}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Awards</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.awards}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tearsheets</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.tearsheets}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Photo Stories</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.photoStories}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow mb-8 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/admin/homepage" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Manage Homepage</span>
                        </Link>
                        <Link href="/admin/projects" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2m-4 6h4m-4 0h4m-4 0V7m0 10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Manage Projects</span>
                        </Link>
                        <Link href="/admin/awards" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Manage Awards</span>
                        </Link>
                        <Link href="/admin/portraits" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Manage Portraits</span>
                        </Link>
                        <Link href="/admin/tearsheets" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Manage Tearsheets</span>
                        </Link>
                        <Link href="/admin/contact" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Manage Contact</span>
                        </Link>
                        <Link href="/admin/footer" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Manage Footer</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function AdminDashboardPage() {
    return (
        <AdminAuthWrapper>
            <AdminDashboard />
        </AdminAuthWrapper>
    )
}
