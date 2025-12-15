import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Stories",
  description: "Photo stories by Ahmer Khan, documenting human narratives and visual storytelling.",
  url: "/photos/stories",
})

export default function StoriesLayout({ children }) {
  return <>{children}</>
}
