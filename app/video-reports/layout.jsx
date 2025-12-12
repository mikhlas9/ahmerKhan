import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Video Reports",
  description: "Video journalism and news reports covering critical stories, breaking news, and investigative reporting across South Asia.",
  url: "/video-reports",
})

export default function VideoReportsLayout({ children }) {
  return <>{children}</>
}

