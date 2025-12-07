import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Photo Stories",
  description: "In-depth photo stories documenting conflict, human rights, and resilience across South Asia through powerful visual narratives.",
  url: "/projects/photo-stories",
})

export default function PhotoStoriesLayout({ children }) {
  return <>{children}</>
}

